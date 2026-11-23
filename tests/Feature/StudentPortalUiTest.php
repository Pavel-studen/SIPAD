<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\Skill;
use App\Models\StudentProfile;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\AppSettingSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StudentPortalUiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        $this->seed(AppSettingSeeder::class);
    }

    public function test_student_portal_web_routes_render_successfully(): void
    {
        $this->get('/')->assertStatus(200)->assertSee('__SIPAD_CONFIG__');
        $this->get('/landing')->assertStatus(200)->assertSee('initialSection: "landing"', false);
        $this->get('/login')->assertStatus(200)->assertSee('initialSection: "landing"', false);
        $this->get('/auth/access-blocked')->assertStatus(200)->assertSee('initialSection: "access-blocked"', false);
        $this->get('/dashboard')->assertStatus(200)->assertSee('initialSection: "dashboard"', false);
        $this->get('/mahasiswa/dashboard')->assertStatus(200)->assertSee('initialSection: "dashboard"', false);
        $this->get('/pilih-peran')->assertStatus(200)->assertSee('initialSection: "pilih-peran"', false);
        $this->get('/profile')->assertStatus(200)->assertSee('initialSection: "pilih-peran"', false);
        $this->get('/hasil-role')->assertStatus(200)->assertSee('initialSection: "hasil-role"', false);
        $this->get('/pengaduan')->assertStatus(200)->assertSee('initialSection: "pengaduan"', false);
        $this->get('/mahasiswa/hasil-role')->assertStatus(200)->assertSee('initialSection: "hasil-role"', false);
        $this->get('/asisten')->assertStatus(200)->assertSee('initialSection: "asprak-dashboard"', false);
        $this->get('/asprak')->assertStatus(200)->assertSee('initialSection: "asprak-dashboard"', false);
        $this->get('/asisten/input-proyek')->assertStatus(200)->assertSee('initialSection: "asprak-project"', false);
        $this->get('/asisten/pengaduan/1')->assertStatus(200)->assertSee('initialSection: "asprak-complaint"', false);
        $this->get('/auth/sso-return')->assertStatus(200);
    }

    public function test_custom_404_page_renders_for_unknown_web_routes_while_api_stays_json(): void
    {
        $this->get('/404')
            ->assertStatus(404)
            ->assertSee('404 Not found!')
            ->assertSee('Nothing but dead flowers here....')
            ->assertSee('Tim PAD 5');

        $this->get('/halaman-tidak-ditemukan-xyz')
            ->assertStatus(404)
            ->assertSee('404 Not found!')
            ->assertSee('Nothing but dead flowers here....');

        $this->getJson('/api/v1/endpoint-yang-tidak-ada')
            ->assertStatus(404)
            ->assertHeader('Content-Type', 'application/json');
    }

    public function test_student_can_update_name_when_submitting_profile(): void
    {
        $student = User::factory()->student()->create(['name' => 'Old Name']);
        Sanctum::actingAs($student);

        $rolePm = Role::where('code', 'PM')->firstOrFail();
        $skillIds = Skill::where('role_id', $rolePm->id)->take(2)->pluck('id')->toArray();

        $response = $this->postJson('/api/v1/student/profile', [
            'name' => 'Misbahul Huda',
            'nim' => '21/473829/SV/19283',
            'role_1_id' => $rolePm->id,
            'skill_ids' => $skillIds,
            'portfolio_link' => 'https://github.com/misbahul',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'profile' => [
                        'name' => 'Misbahul Huda',
                        'nim' => '21/473829/SV/19283',
                    ],
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $student->id,
            'name' => 'Misbahul Huda',
        ]);
    }

    public function test_student_can_upload_and_stream_avatar(): void
    {
        Storage::fake('local');

        $student = User::factory()->student()->create();
        Sanctum::actingAs($student);

        // Valid 1x1 transparent PNG bytes (avoids requiring PHP GD extension in CLI tests)
        $pngBytes = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        $file = UploadedFile::fake()->createWithContent('avatar.png', $pngBytes);

        $response = $this->postJson('/api/v1/student/avatar', [
            'avatar' => $file,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ]);

        $avatarUrl = $response->json('data.avatar_link');
        $this->assertNotEmpty($avatarUrl);

        $filename = basename((string) parse_url($avatarUrl, PHP_URL_PATH));
        Storage::disk('local')->assertExists('avatars/'.$filename);

        $this->get('/avatars/'.$filename)->assertStatus(200);
    }

    public function test_asprak_can_save_project_owner_display_name_and_view_it_in_teams_and_my_team(): void
    {
        $assistant = User::factory()->assistant()->create(['name' => 'Dimas Asprak']);
        $student = User::factory()->student()->create(['name' => 'Aulia Mahasiswa', 'avatar_link' => 'https://example.com/avatar.jpg']);
        $team = Team::create([
            'team_type' => 'internal',
            'supervisor' => $assistant->id,
            'is_locked' => false,
        ]);

        StudentProfile::create([
            'user_id' => $student->id,
            'nim' => '21/471003/SV/19003',
            'team_id' => $team->id,
        ]);

        Sanctum::actingAs($assistant);

        $saveRes = $this->postJson("/api/v1/teams/{$team->id}/project", [
            'project_name' => 'E-Commerce Smart Village',
            'project_owner_name' => 'Ir. Hendra S.T., M.Eng.',
            'project_associate' => 'PT. Digital Solusindo',
        ]);

        $saveRes->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'project_name' => 'E-Commerce Smart Village',
                    'project_associate' => 'PT. Digital Solusindo',
                    'owner_display_name' => 'Ir. Hendra S.T., M.Eng.',
                ],
            ]);

        $this->getJson('/api/v1/teams')
            ->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    [
                        'id' => $team->id,
                        'project' => [
                            'project_name' => 'E-Commerce Smart Village',
                            'owner_display_name' => 'Ir. Hendra S.T., M.Eng.',
                        ],
                    ],
                ],
            ]);

        Sanctum::actingAs($student);

        $this->getJson('/api/v1/student/my-team')
            ->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'has_team' => true,
                    'team' => [
                        'id' => $team->id,
                        'project' => [
                            'name' => 'E-Commerce Smart Village',
                            'owner_display_name' => 'Ir. Hendra S.T., M.Eng.',
                        ],
                        'members' => [
                            [
                                'user_id' => $student->id,
                                'avatar_link' => 'https://example.com/avatar.jpg',
                            ],
                        ],
                    ],
                ],
            ]);
    }

    public function test_seed_sample_data_creates_two_supervised_teams_for_asprak(): void
    {
        $this->postJson('/dev/seed-sample-data')->assertStatus(200);

        $assistant = User::where('email', 'asisten.lab@mail.ugm.ac.id')->firstOrFail();
        $this->assertEquals(2, Team::where('supervisor', $assistant->id)->count());
        $this->assertDatabaseHas('users', ['email' => 'mhs.bypass@mail.ugm.ac.id']);
        $this->assertDatabaseHas('users', ['email' => 'mhs.baru@mail.ugm.ac.id']);
    }
}
