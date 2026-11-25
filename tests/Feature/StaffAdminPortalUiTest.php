<?php

namespace Tests\Feature;

use App\Models\Complaint;
use App\Models\Role;
use App\Models\StudentProfile;
use App\Models\StudentRoleEvaluation;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\AppSettingSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StaffAdminPortalUiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        $this->seed(AppSettingSeeder::class);
    }

    public function test_staff_and_admin_portal_web_routes_render_expected_sections(): void
    {
        $this->get('/master-admin')->assertStatus(200)->assertSee('initialSection: "master-admin"', false);

        $this->get('/dosen')->assertStatus(200)->assertSee('initialSection: "dosen-control"', false);
        $this->get('/dosen/control')->assertStatus(200)->assertSee('initialSection: "dosen-control"', false);
        $this->get('/lecturer/control')->assertStatus(200)->assertSee('initialSection: "dosen-control"', false);
        $this->get('/dosen/user')->assertStatus(200)->assertSee('initialSection: "dosen-user"', false);
        $this->get('/dosen/access')->assertStatus(200)->assertSee('initialSection: "dosen-user"', false);
        $this->get('/lecturer/access')->assertStatus(200)->assertSee('initialSection: "dosen-user"', false);
        $this->get('/dosen/bypass')->assertStatus(200)->assertSee('initialSection: "dosen-bypass"', false);
        $this->get('/lecturer/bypass')->assertStatus(200)->assertSee('initialSection: "dosen-bypass"', false);
        $this->get('/dosen/pengaduan')->assertStatus(200)->assertSee('initialSection: "dosen-complaints"', false);
        $this->get('/dosen/pengaduan/1')->assertStatus(200)->assertSee('initialSection: "dosen-complaint-detail"', false);

        $this->get('/praktisi')->assertStatus(200)->assertSee('initialSection: "practitioner-students"', false);
        $this->get('/praktisi/mahasiswa')->assertStatus(200)->assertSee('initialSection: "practitioner-students"', false);
        $this->get('/practitioner/dashboard')->assertStatus(200)->assertSee('initialSection: "practitioner-students"', false);
        $this->get('/praktisi/pengaduan')->assertStatus(200)->assertSee('initialSection: "practitioner-complaints"', false);
        $this->get('/practitioner/complaint')->assertStatus(200)->assertSee('initialSection: "practitioner-complaints"', false);
        $this->get('/praktisi/pengaduan/2')->assertStatus(200)->assertSee('initialSection: "practitioner-complaint-detail"', false);
        $this->get('/praktisi/input-proyek')->assertStatus(200)->assertSee('initialSection: "practitioner-project"', false);
    }

    public function test_non_student_users_are_blocked_from_student_only_endpoints(): void
    {
        $nonStudents = [
            User::factory()->admin()->create(),
            User::factory()->lecturer()->create(),
            User::factory()->practitioner()->create(),
            User::factory()->assistant()->create(),
        ];

        foreach ($nonStudents as $user) {
            Sanctum::actingAs($user);

            $this->getJson('/api/v1/student/profiling-config')->assertStatus(403);
            $this->getJson('/api/v1/student/my-team')->assertStatus(403);
            $this->getJson('/api/v1/student/teammates')->assertStatus(403);
            $this->getJson('/api/v1/complaints/teammates')->assertStatus(403);
            $this->postJson('/api/v1/complaints', [])->assertStatus(403);
        }
    }

    public function test_master_admin_can_initiate_lecturer_with_nip_and_revoke_access(): void
    {
        $admin = User::factory()->admin()->create(['nip' => '198001012005011001']);
        Sanctum::actingAs($admin);

        // Initiate lecturer with NIP
        $resCreate = $this->postJson('/api/v1/admin/lecturers', [
            'name' => 'Dr. Andi Dosen, M.Kom.',
            'email' => 'andi.dosen@mail.ugm.ac.id',
            'nip' => '198902022015041009',
            'role' => 'lecturer',
        ]);

        $resCreate->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'email' => 'andi.dosen@mail.ugm.ac.id',
                    'name' => 'Dr. Andi Dosen, M.Kom.',
                    'nip' => '198902022015041009',
                    'user_role' => 'lecturer',
                ],
            ]);

        $lecturerId = (int) $resCreate->json('data.id');

        // Verify searchable & listed with NIP
        $this->getJson('/api/v1/users?role=lecturer&search=19890202')
            ->assertStatus(200)
            ->assertJsonPath('data.0.nip', '198902022015041009');

        // Cannot delete self
        $this->deleteJson("/api/v1/users/{$admin->id}")->assertStatus(422);

        // Revoke lecturer access
        $this->deleteJson("/api/v1/users/{$lecturerId}")->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $lecturerId]);

        // Lecturer cannot revoke a Master Admin
        $otherLecturer = User::factory()->lecturer()->create();
        Sanctum::actingAs($otherLecturer);
        $this->deleteJson("/api/v1/users/{$admin->id}")->assertStatus(403);
    }

    public function test_practitioner_can_inspect_override_save_project_and_review_complaints(): void
    {
        Storage::fake('local');

        $practitioner = User::factory()->practitioner()->create();
        $rolePm = Role::where('code', 'PM')->firstOrFail();
        $roleBe = Role::where('code', 'BE')->firstOrFail();
        $roleFe = Role::where('code', 'FE')->firstOrFail();

        $team = Team::create(['team_type' => 'internal']);
        $student = User::factory()->student()->create(['name' => 'Mahasiswa Uji']);
        $teammate = User::factory()->student()->create(['name' => 'Rekan Uji']);

        StudentProfile::create([
            'user_id' => $student->id,
            'nim' => '22/500001/SV/21001',
            'role_1_id' => $rolePm->id,
            'team_id' => $team->id,
            'portfolio_link' => 'https://github.com/mhs-uji',
        ]);

        StudentRoleEvaluation::create([
            'user_id' => $student->id,
            'score_role_1' => 88.0,
            'recommended_score' => 88.0,
            'recommended_role_id' => $rolePm->id,
            'final_role_id' => $rolePm->id,
            'is_overridden' => false,
            'is_locked' => false,
        ]);

        Storage::disk('local')->put('complaints/practitioner_test.pdf', '%PDF-1.4 Test');
        $complaint = Complaint::create([
            'reporter_id' => $teammate->id,
            'reported_id' => $student->id,
            'team_id' => $team->id,
            'description' => "Alasan: Slow response\n\nBelum submit progres sprint.",
            'evidence_file_path' => 'complaints/practitioner_test.pdf',
        ]);

        Sanctum::actingAs($practitioner);

        // Detail includes team_label
        $this->getJson("/api/v1/evaluations/{$student->id}")
            ->assertStatus(200)
            ->assertJsonPath('data.student.team_label', "Kelompok {$team->id}");

        // Override Role 1 & optional Role 2 + note
        $this->patchJson("/api/v1/evaluations/{$student->id}/override", [
            'final_role_id' => $roleBe->id,
            'role_2_id' => $roleFe->id,
            'note' => 'Kuat di arsitektur backend',
        ])
            ->assertStatus(200)
            ->assertJsonPath('data.final_role.code', 'BE')
            ->assertJsonPath('data.is_overridden', true);

        $this->assertDatabaseHas('student_profiles', [
            'user_id' => $student->id,
            'role_2_id' => $roleFe->id,
        ]);

        // Reset override
        $this->postJson("/api/v1/evaluations/{$student->id}/reset")
            ->assertStatus(200)
            ->assertJsonPath('data.is_overridden', false);

        // Input project details
        $this->postJson("/api/v1/teams/{$team->id}/project", [
            'project_name' => 'Smart Mitra App',
            'project_owner_name' => 'Ir. Hendra S.T., M.Eng.',
            'project_associate' => 'PT. Digital Solusindo',
        ])
            ->assertStatus(200)
            ->assertJsonPath('data.owner_display_name', 'Ir. Hendra S.T., M.Eng.');

        // Review complaint
        $this->patchJson("/api/v1/complaints/{$complaint->id}/review")
            ->assertStatus(200)
            ->assertJsonPath('data.is_reviewed', true)
            ->assertJsonPath('data.reviewed_by.id', $practitioner->id);

        // Still blocked on Lecturer/Admin only operations
        $this->postJson('/api/v1/evaluations/lock-all')->assertStatus(403);
        $this->postJson('/api/v1/teams/auto-group')->assertStatus(403);
        $this->postJson('/api/v1/admin/lecturers', ['email' => 'x@ugm.ac.id'])->assertStatus(403);
    }

    public function test_dosen_can_update_schedule_inline_role_assign_unassign_and_bypass_team(): void
    {
        $lecturer = User::factory()->lecturer()->create();
        $assistant = User::factory()->assistant()->create(['name' => 'Asprak A']);
        $student = User::factory()->student()->create(['email' => 'calon.asprak@mail.ugm.ac.id']);
        $team = Team::create(['team_type' => 'internal']);

        Sanctum::actingAs($lecturer);

        // Update schedule timeline & custom release date
        $this->putJson('/api/v1/settings', [
            'registration_timeline' => '1 Agustus 2026 - 28 Agustus 2026',
            'settings' => [
                'registration_start_date' => '2026-08-01',
                'registration_end_date' => '2026-08-28',
                'team_release_date' => '6 September 2026',
            ],
        ])
            ->assertStatus(200)
            ->assertJsonPath('data.registration_timeline', '1 Agustus 2026 - 28 Agustus 2026')
            ->assertJsonPath('data.all_settings.team_release_date', '6 September 2026');

        // Inline role update
        $this->patchJson("/api/v1/users/{$student->id}/role", ['role' => 'practitioner'])
            ->assertStatus(200)
            ->assertJsonPath('data.user_role', 'practitioner');

        // Assign & unassign team supervisor
        $this->patchJson("/api/v1/teams/{$team->id}/supervisor", ['supervisor_id' => $assistant->id])
            ->assertStatus(200)
            ->assertJsonPath('data.supervisor.id', $assistant->id);

        $this->patchJson("/api/v1/teams/{$team->id}/supervisor", ['supervisor_id' => null])
            ->assertStatus(200)
            ->assertJsonPath('data.supervisor', null);

        $this->assertDatabaseHas('teams', ['id' => $team->id, 'supervisor' => null]);

        // Create exclusive bypass team
        $mhsBypass = User::factory()->student()->create(['email' => 'gemastik.satu@mail.ugm.ac.id']);
        $this->postJson('/api/v1/teams/exclusive', [
            'team_name' => 'Tim GEMASTIK UI',
            'team_type' => 'external',
            'project_associate' => 'GEMASTIK - Software Development',
            'members' => [['user_id' => $mhsBypass->id]],
        ])
            ->assertStatus(201)
            ->assertJsonPath('data.is_locked', true);
    }
}
