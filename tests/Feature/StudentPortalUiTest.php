<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\Skill;
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
        $this->get('/pilih-peran')->assertStatus(200)->assertSee('initialSection: "pilih-peran"', false);
        $this->get('/profile')->assertStatus(200)->assertSee('initialSection: "pilih-peran"', false);
        $this->get('/hasil-role')->assertStatus(200)->assertSee('initialSection: "hasil-role"', false);
        $this->get('/pengaduan')->assertStatus(200)->assertSee('initialSection: "pengaduan"', false);
        $this->get('/mahasiswa/hasil-role')->assertStatus(200)->assertSee('initialSection: "hasil-role"', false);
        $this->get('/auth/sso-return')->assertStatus(200);
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
}
