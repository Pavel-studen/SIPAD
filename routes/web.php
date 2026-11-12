<?php

use App\Enums\UserRole;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\MasterAdminController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SpecialTeamController;
use App\Http\Controllers\TeamController;
use App\Models\Complaint;
use App\Models\Project;
use App\Models\Role;
use App\Models\StudentProfile;
use App\Models\StudentRoleEvaluation;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\AppSettingSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

// Route::get('/', function () {
//     return view('welcome');
// });

// Route for the student (mahasiswa) dashboard
Route::get('/mahasiswa', [MahasiswaController::class, 'dashboard'])->name('mahasiswa.dashboard');

// Route for the master admin dashboard
Route::get('/master-admin', [MasterAdminController::class, 'dashboard'])->name('master-admin.dashboard');

// Routes for managing master admin actions
Route::delete('/master-admin/revoke', [MasterAdminController::class, 'revoke'])->name('master-admin.revoke');
Route::delete('/master-admin/store', [MasterAdminController::class, 'store'])->name('master-admin.store');

Route::delete('/master-admin/dosen/{id}', [MasterAdminController::class, 'destroyDosen'])
    ->name('master-admin.dosen-destroy');

// Routes for managing lecturer (dosen) actions
Route::get('/dosen/control', [DosenController::class, 'control'])->name('dosen.control');
Route::get('/team/randomize', [TeamController::class, 'randomize'])->name('team.randomize');
Route::get('/schedule/update', [ScheduleController::class, 'updateSchedule'])->name('schedule.update');
Route::get('/dosen/access', [DosenController::class, 'access'])->name('dosen.access');
Route::get('/dosen/bypass', [DosenController::class, 'bypass'])->name('dosen.bypass');
Route::get('/special-team/lock', [SpecialTeamController::class, 'lockTeam'])->name('special-team.lock');

// Google OAuth callback endpoint (matches GOOGLE_REDIRECT_URI)
Route::match(['get', 'post'], '/auth/google/callback', [AuthController::class, 'googleCallback'])
    ->name('auth.google.callback.web');

// Developer & testing JSON API helpers for local environment
if (app()->environment('local', 'testing')) {
    Route::prefix('dev')->as('dev.')->group(function () {
        Route::get('/users', function () {
            return response()->json([
                'status' => 'success',
                'data' => User::select('id', 'name', 'email', 'user_role', 'status')->latest('id')->limit(50)->get(),
            ]);
        })->name('users');

        Route::post('/generate-token', function (Request $request) {
            $email = strtolower(trim((string) $request->input('email')));
            $user = User::where('email', $email)->first();

            $rawRole = (string) ($request->input('user_role') ?? $request->input('role') ?? 'admin');
            $roleEnum = UserRole::tryFrom(UserRole::normalize($rawRole) ?? 'admin') ?? UserRole::Admin;

            if (! $user) {
                if ($request->boolean('create_if_missing', true)) {
                    $user = User::create([
                        'name' => $request->input('name') ?: 'Dev '.ucfirst($roleEnum->value),
                        'email' => $email ?: 'dev.'.$roleEnum->value.'@mail.ugm.ac.id',
                        'user_role' => $roleEnum,
                        'status' => 'active',
                    ]);

                    if ($roleEnum === UserRole::Student) {
                        StudentProfile::create([
                            'user_id' => $user->id,
                            'nim' => $request->input('nim') ?: '21/'.rand(100000, 999999).'/SV/19000',
                            'is_bypass' => $request->boolean('is_bypass', false),
                        ]);
                    }
                } else {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Pengguna dengan email "'.$email.'" tidak ditemukan.',
                    ], 404);
                }
            } else {
                // If is_bypass explicitly passed for student, sync it
                if ($user->studentProfile && $request->has('is_bypass')) {
                    $user->studentProfile->is_bypass = $request->boolean('is_bypass');
                    $user->studentProfile->save();
                }
            }

            $token = $user->createToken('dev-testing-token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Token Sanctum berhasil dibuat untuk '.$user->email,
                'token' => $token,
                'user' => $user->load('studentProfile'),
            ]);
        })->name('generate-token');

        Route::post('/seed-sample-data', function () {
            DB::transaction(function () {
                (new RoleSeeder)->run();
                (new AppSettingSeeder)->run();

                $lecturer = User::updateOrCreate(
                    ['email' => 'dosen.pengampu@mail.ugm.ac.id'],
                    [
                        'name' => 'Dr. Ir. Budi Santoso, M.T.',
                        'user_role' => UserRole::Lecturer,
                        'status' => 'active',
                    ]
                );

                $assistant = User::updateOrCreate(
                    ['email' => 'asisten.lab@mail.ugm.ac.id'],
                    [
                        'name' => 'Dimas Asisten, S.Tr.Kom.',
                        'user_role' => UserRole::Assistant,
                        'status' => 'active',
                    ]
                );

                User::updateOrCreate(
                    ['email' => 'praktisi.industri@mail.ugm.ac.id'],
                    [
                        'name' => 'Andi Pratama (Praktisi)',
                        'user_role' => UserRole::Practitioner,
                        'status' => 'active',
                    ]
                );

                $roles = Role::all()->keyBy('code');

                $sampleStudents = [
                    ['email' => 'mhs.pm1@mail.ugm.ac.id', 'name' => 'Rizky Pratama (PM 1)', 'nim' => '21/471001/SV/19001', 'role' => 'PM', 'overridden' => false],
                    ['email' => 'mhs.pm2@mail.ugm.ac.id', 'name' => 'Nadia Putri (PM 2)', 'nim' => '21/471002/SV/19002', 'role' => 'PM', 'overridden' => true],
                    ['email' => 'mhs.uiux1@mail.ugm.ac.id', 'name' => 'Aulia Rahman (UIUX 1)', 'nim' => '21/471003/SV/19003', 'role' => 'UIUX', 'overridden' => false],
                    ['email' => 'mhs.uiux2@mail.ugm.ac.id', 'name' => 'Siti Aminah (UIUX 2)', 'nim' => '21/471004/SV/19004', 'role' => 'UIUX', 'overridden' => false],
                    ['email' => 'mhs.fe1@mail.ugm.ac.id', 'name' => 'Bagas Saputra (FE 1)', 'nim' => '21/471005/SV/19005', 'role' => 'FE', 'overridden' => false],
                    ['email' => 'mhs.fe2@mail.ugm.ac.id', 'name' => 'Dewi Lestari (FE 2)', 'nim' => '21/471006/SV/19006', 'role' => 'FE', 'overridden' => false],
                    ['email' => 'mhs.be1@mail.ugm.ac.id', 'name' => 'Fajar Nugroho (BE 1)', 'nim' => '21/471007/SV/19007', 'role' => 'BE', 'overridden' => false],
                    ['email' => 'mhs.be2@mail.ugm.ac.id', 'name' => 'Hendra Wijaya (BE 2)', 'nim' => '21/471008/SV/19008', 'role' => 'BE', 'overridden' => false],
                ];

                $createdStudents = [];
                foreach ($sampleStudents as $item) {
                    $roleModel = $roles[$item['role']] ?? $roles->first();
                    $student = User::updateOrCreate(
                        ['email' => $item['email']],
                        [
                            'name' => $item['name'],
                            'user_role' => UserRole::Student,
                            'status' => 'active',
                        ]
                    );

                    StudentProfile::updateOrCreate(
                        ['user_id' => $student->id],
                        [
                            'nim' => $item['nim'],
                            'is_bypass' => false,
                            'role_1_id' => $roleModel?->id,
                            'portfolio_link' => 'https://github.com/sample-student',
                        ]
                    );

                    StudentRoleEvaluation::updateOrCreate(
                        ['user_id' => $student->id],
                        [
                            'score_role_1' => 86.0,
                            'recommended_score' => 86.0,
                            'recommended_role_id' => $roleModel?->id,
                            'final_role_id' => $roleModel?->id,
                            'is_overridden' => $item['overridden'],
                            'is_locked' => true,
                            'updated_by' => $lecturer->id,
                        ]
                    );

                    $createdStudents[] = $student;
                }

                // Create 1 demo team with 2 demo students and 1 complaint ticket
                $demoTeam = Team::firstOrCreate(
                    ['team_type' => 'internal', 'supervisor' => $assistant->id],
                    ['is_locked' => false]
                );

                Project::updateOrCreate(
                    ['project_team' => $demoTeam->id],
                    [
                        'project_name' => 'Sistem Informasi Proyek Aplikasi Dasar (Demo)',
                        'project_owner' => $lecturer->id,
                        'project_associate' => 'Program Studi TRPL SV UGM',
                        'project_description' => 'Proyek simulasi untuk pengujian endpoint SIPAD.',
                    ]
                );

                if (count($createdStudents) >= 2) {
                    StudentProfile::whereIn('user_id', [$createdStudents[0]->id, $createdStudents[2]->id])
                        ->update(['team_id' => $demoTeam->id]);

                    Storage::disk('local')->put('complaints/sample_evidence.pdf', '%PDF-1.4 Simulation Evidence');

                    Complaint::updateOrCreate(
                        [
                            'reporter_id' => $createdStudents[0]->id,
                            'reported_id' => $createdStudents[2]->id,
                            'team_id' => $demoTeam->id,
                        ],
                        [
                            'description' => 'Anggota tim tidak menghadiri rapat sprint mingguan selama 2 pekan berturut-turut.',
                            'evidence_file_path' => 'complaints/sample_evidence.pdf',
                        ]
                    );
                }
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Data simulasi lengkap (Dosen, Asprak, Praktisi, 8 Mahasiswa terevaluasi, Tim Demo, & 1 Tiket Aduan) berhasil dibuat!',
            ]);
        })->name('seed-sample-data');
    });
}
