<?php

use App\Enums\UserRole;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentProfilingController;
use App\Http\Controllers\AssistantController;
use App\Http\Controllers\LecturerController;
use App\Http\Controllers\MasterAdminController;
use App\Http\Controllers\PractitionerController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SpecialTeamController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeamController;
use App\Models\AppSetting;
use App\Models\Complaint;
use App\Models\Project;
use App\Models\Role;
use App\Models\Skill;
use App\Models\StudentProfile;
use App\Models\StudentRoleEvaluation;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\AppSettingSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('student.portal', ['initialSection' => 'home']);
})->name('student.portal');

Route::get('/login', function () {
    return view('student.portal', ['initialSection' => 'landing']);
})->name('login');

Route::get('/landing', function () {
    return view('student.portal', ['initialSection' => 'landing']);
})->name('student.landing');

Route::get('/auth/access-blocked', function () {
    return view('student.portal', ['initialSection' => 'access-blocked']);
})->name('student.access-blocked');

Route::get('/dashboard', function () {
    return view('student.portal', ['initialSection' => 'dashboard']);
})->name('student.dashboard');

Route::get('/pilih-peran', function () {
    return view('student.portal', ['initialSection' => 'pilih-peran']);
})->name('student.pilih-peran');

Route::get('/profile', function () {
    return view('student.portal', ['initialSection' => 'pilih-peran']);
})->name('student.profile');

Route::get('/hasil-role', function () {
    return view('student.portal', ['initialSection' => 'hasil-role']);
})->name('student.hasil-role');

Route::get('/pengaduan', function () {
    return view('student.portal', ['initialSection' => 'pengaduan']);
})->name('student.pengaduan');

Route::get('/mahasiswa/{section?}', function (?string $section = null) {
    $validSection = in_array($section, ['dashboard', 'hasil-role', 'pengaduan'], true) ? $section : 'pilih-peran';

    return view('student.portal', ['initialSection' => $validSection]);
})->name('student.mahasiswa');

Route::get('/asisten', function () {
    return view('student.portal', ['initialSection' => 'asprak-dashboard']);
})->name('asprak.dashboard');

Route::get('/asprak', function () {
    return view('student.portal', ['initialSection' => 'asprak-dashboard']);
})->name('asprak.alias');

Route::get('/asisten/dashboard', function () {
    return view('student.portal', ['initialSection' => 'asprak-dashboard']);
})->name('asprak.dashboard.alias');

Route::get('/asisten/input-proyek', function () {
    return view('student.portal', ['initialSection' => 'asprak-project']);
})->name('asprak.project');

Route::get('/asprak/input-proyek', function () {
    return view('student.portal', ['initialSection' => 'asprak-project']);
})->name('asprak.project.alias');

Route::get('/asisten/pengaduan/{id}', function (int $id) {
    return view('student.portal', [
        'initialSection' => 'asprak-complaint',
        'initialComplaintId' => $id,
    ]);
})->whereNumber('id')->name('asprak.complaint');

Route::get('/404', function () {
    return response()->view('errors.404', [], 404);
})->name('error.404');

Route::get('/auth/sso-return', function () {
    return view('student.portal', ['initialSection' => 'pilih-peran']);
})->name('student.sso-return');

Route::get('/avatars/{filename}', [StudentProfilingController::class, 'showAvatar'])
    ->where('filename', '[A-Za-z0-9._-]+')
    ->name('avatars.show');

// Master Admin, Dosen Pengampu & Praktisi Industri SPA Portal Routes
Route::get('/master-admin', function () {
    return view('student.portal', ['initialSection' => 'master-admin']);
})->name('master-admin.dashboard');

Route::get('/dosen', function () {
    return view('student.portal', ['initialSection' => 'dosen-control']);
})->name('dosen.dashboard');

Route::get('/dosen/control', function () {
    return view('student.portal', ['initialSection' => 'dosen-control']);
})->name('dosen.control');

Route::get('/dosen/user', function () {
    return view('student.portal', ['initialSection' => 'dosen-user']);
})->name('dosen.user');

Route::get('/dosen/access', function () {
    return view('student.portal', ['initialSection' => 'dosen-user']);
})->name('dosen.access');

Route::get('/dosen/bypass', function () {
    return view('student.portal', ['initialSection' => 'dosen-bypass']);
})->name('dosen.bypass');

Route::get('/dosen/pengaduan', function () {
    return view('student.portal', ['initialSection' => 'dosen-complaints']);
})->name('dosen.complaints');

Route::get('/dosen/pengaduan/{id}', function (int $id) {
    return view('student.portal', [
        'initialSection' => 'dosen-complaint-detail',
        'initialComplaintId' => $id,
    ]);
})->whereNumber('id')->name('dosen.complaint.detail');

Route::get('/praktisi', function () {
    return view('student.portal', ['initialSection' => 'practitioner-students']);
})->name('praktisi.dashboard');

Route::get('/praktisi/mahasiswa', function () {
    return view('student.portal', ['initialSection' => 'practitioner-students']);
})->name('praktisi.students');

Route::get('/praktisi/pengaduan', function () {
    return view('student.portal', ['initialSection' => 'practitioner-complaints']);
})->name('praktisi.complaints');

Route::get('/praktisi/pengaduan/{id}', function (int $id) {
    return view('student.portal', [
        'initialSection' => 'practitioner-complaint-detail',
        'initialComplaintId' => $id,
    ]);
})->whereNumber('id')->name('praktisi.complaint.detail');

Route::get('/praktisi/input-proyek', function () {
    return view('student.portal', ['initialSection' => 'practitioner-project']);
})->name('praktisi.project');

// Route for logout
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/login');
})->name('logout');

// Route for the student dashboard
Route::middleware(['web'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('dashboard');
});

Route::middleware(['web'])->group(function () {
    // Route for the assistant dashboard
    Route::get('/assistant', [AssistantController::class, 'dashboard'])->name('assistant.dashboard');
    Route::get('/assistant/pengaduan/{id}', [AssistantController::class, 'detailPengaduan'])->name('assistant.pengaduan-detail');

    Route::post('/master-admin/store', [MasterAdminController::class, 'store'])->name('master-admin.store');

    // Route for changing status admin to lecturer (using {id} parameter)
    Route::delete('/master-admin/lecturer/{id}', [MasterAdminController::class, 'destroy'])->name('master-admin.lecturer.destroy');
});

// Routes for managing lecturer actions
Route::middleware(['web'])->prefix('lecturer')->name('lecturer.')->group(function () {
    // Route for SPA views (aliases)
    Route::get('/control', function () {
        return view('student.portal', ['initialSection' => 'dosen-control']);
    })->name('control');
    Route::get('/access', function () {
        return view('student.portal', ['initialSection' => 'dosen-user']);
    })->name('access');
    Route::get('/bypass', function () {
        return view('student.portal', ['initialSection' => 'dosen-bypass']);
    })->name('bypass');

    // Legacy POST handlers
    Route::post('/control/edit-tanggal', [LecturerController::class, 'editTanggal'])->name('editTanggal');
    Route::post('/control/kunci-mahasiswa', [LecturerController::class, 'kunciSemuaMahasiswa'])->name('kunciMahasiswa');
    Route::post('/control/acak-tim', [LecturerController::class, 'acakTimOtomatis'])->name('acakTim');

    Route::post('/access/tambah-email', [LecturerController::class, 'tambahEmail'])->name('tambahEmail');
    Route::post('/access/import-csv', [LecturerController::class, 'importCSV'])->name('importCSV');
    Route::post('/access/hapus-email/{id}', [LecturerController::class, 'hapusEmail'])->name('hapusEmail');

    Route::post('/bypass/tambah-anggota', [LecturerController::class, 'tambahAnggota'])->name('tambahAnggota');
    Route::post('/bypass/kunci-tim/{id}', [LecturerController::class, 'kunciTim'])->name('kunciTim');
});

Route::middleware(['web'])->prefix('practitioner')->name('practitioner.')->group(function () {
    Route::get('/dashboard', function () {
        return view('student.portal', ['initialSection' => 'practitioner-students']);
    })->name('dashboard');
    Route::get('/complaint', function () {
        return view('student.portal', ['initialSection' => 'practitioner-complaints']);
    })->name('complaint');

    Route::get('/student/{id}/detail', [PractitionerController::class, 'getStudentDetail'])->name('student.detail');

    Route::get('/api/pengaduan/{id}', [PractitionerController::class, 'show'])->name('api.pengaduan.show');
});

// Google OAuth callback endpoint (matches GOOGLE_REDIRECT_URI)
Route::match(['get', 'post'], '/auth/google/callback', [AuthController::class, 'googleCallback'])
    ->name('auth.google.callback.web');

// Developer & testing JSON API helpers for local environment
if (app()->environment('local', 'testing')) {
    Route::prefix('dev')->as('dev.')->group(function () {
        Route::get('/users', function () {
            return response()->json([
                'status' => 'success',
                'data' => User::select('id', 'name', 'nip', 'email', 'user_role', 'status')->latest('id')->limit(50)->get(),
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

                if (! AppSetting::getValue('registration_timeline')) {
                    AppSetting::setValue('registration_timeline', '1 Agustus 2026 - 28 Agustus 2026');
                }
                if (! AppSetting::getValue('team_release_date')) {
                    AppSetting::setValue('team_release_date', '6 September 2026');
                }

                $masterAdmin = User::updateOrCreate(
                    ['email' => 'master.admin@mail.ugm.ac.id'],
                    [
                        'name' => 'AdminPAD123',
                        'nip' => '198001012005011001',
                        'user_role' => UserRole::Admin,
                        'status' => 'active',
                    ]
                );

                $lecturer = User::updateOrCreate(
                    ['email' => 'dosen.pengampu@mail.ugm.ac.id'],
                    [
                        'name' => 'Dr. Ir. Budi Santoso, M.T.',
                        'nip' => '198504122010121002',
                        'user_role' => UserRole::Lecturer,
                        'status' => 'active',
                    ]
                );

                User::updateOrCreate(
                    ['email' => 'dinar.pratomo@mail.ugm.ac.id'],
                    [
                        'name' => 'Ir. Dinar Nugroho Pratomo, S.Kom., M.IM., M.Cs.',
                        'nip' => '198706152012121001',
                        'user_role' => UserRole::Lecturer,
                        'status' => 'active',
                    ]
                );

                $assistant = User::updateOrCreate(
                    ['email' => 'asisten.lab@mail.ugm.ac.id'],
                    [
                        'name' => 'Dimas Asisten, S.Tr.Kom.',
                        'nip' => '199808142022021003',
                        'user_role' => UserRole::Assistant,
                        'status' => 'active',
                    ]
                );

                $practitioner = User::updateOrCreate(
                    ['email' => 'praktisi.industri@mail.ugm.ac.id'],
                    [
                        'name' => 'Andi Pratama (Praktisi)',
                        'user_role' => UserRole::Practitioner,
                        'status' => 'active',
                    ]
                );

                $roles = Role::with('skills')->get()->keyBy('code');

                $sampleStudents = [
                    ['email' => 'mhs.pm1@mail.ugm.ac.id', 'name' => 'Rizky Pratama (PM 1)', 'nim' => '21/471001/SV/19001', 'role' => 'PM', 'role2' => 'UIUX', 'score1' => 86.0, 'score2' => 72.0, 'overridden' => false, 'locked' => true],
                    ['email' => 'mhs.pm2@mail.ugm.ac.id', 'name' => 'Nadia Putri (PM 2)', 'nim' => '21/471002/SV/19002', 'role' => 'PM', 'role2' => 'FE', 'score1' => 92.4, 'score2' => 78.0, 'overridden' => true, 'locked' => true],
                    ['email' => 'mhs.uiux1@mail.ugm.ac.id', 'name' => 'Aulia Rahman (UIUX 1)', 'nim' => '21/471003/SV/19003', 'role' => 'UIUX', 'role2' => 'FE', 'score1' => 88.0, 'score2' => 74.0, 'overridden' => false, 'locked' => true],
                    ['email' => 'mhs.uiux2@mail.ugm.ac.id', 'name' => 'Siti Aminah (UIUX 2)', 'nim' => '21/471004/SV/19004', 'role' => 'UIUX', 'role2' => 'PM', 'score1' => 89.5, 'score2' => 76.0, 'overridden' => false, 'locked' => true],
                    ['email' => 'mhs.fe1@mail.ugm.ac.id', 'name' => 'Bagas Saputra (FE 1)', 'nim' => '21/471005/SV/19005', 'role' => 'FE', 'role2' => 'BE', 'score1' => 85.0, 'score2' => 79.0, 'overridden' => false, 'locked' => true],
                    ['email' => 'mhs.fe2@mail.ugm.ac.id', 'name' => 'Dewi Lestari (FE 2)', 'nim' => '21/471006/SV/19006', 'role' => 'FE', 'role2' => 'UIUX', 'score1' => 91.2, 'score2' => 80.5, 'overridden' => false, 'locked' => true],
                    ['email' => 'mhs.be1@mail.ugm.ac.id', 'name' => 'Fajar Nugroho (BE 1)', 'nim' => '21/471007/SV/19007', 'role' => 'BE', 'role2' => 'FE', 'score1' => 90.0, 'score2' => 75.0, 'overridden' => false, 'locked' => true],
                    ['email' => 'mhs.be2@mail.ugm.ac.id', 'name' => 'Hendra Wijaya (BE 2)', 'nim' => '21/471008/SV/19008', 'role' => 'BE', 'role2' => 'PM', 'score1' => 84.5, 'score2' => 71.0, 'overridden' => false, 'locked' => true],
                    ['email' => 'mhs.eval1@mail.ugm.ac.id', 'name' => 'Budi Santoso', 'nim' => '22/220192/SV/19011', 'role' => 'UIUX', 'role2' => 'FE', 'score1' => 88.0, 'score2' => 76.0, 'overridden' => false, 'locked' => false],
                    ['email' => 'mhs.eval2@mail.ugm.ac.id', 'name' => 'Siti Rahmawati', 'nim' => '22/220193/SV/19012', 'role' => 'PM', 'role2' => 'UIUX', 'score1' => 92.0, 'score2' => 82.0, 'overridden' => false, 'locked' => false],
                ];

                $createdStudents = [];
                foreach ($sampleStudents as $item) {
                    $roleModel = $roles[$item['role']] ?? $roles->first();
                    $role2Model = $roles[$item['role2']] ?? null;
                    $student = User::updateOrCreate(
                        ['email' => $item['email']],
                        [
                            'name' => $item['name'],
                            'user_role' => UserRole::Student,
                            'status' => 'active',
                        ]
                    );

                    $profile = StudentProfile::updateOrCreate(
                        ['user_id' => $student->id],
                        [
                            'nim' => $item['nim'],
                            'is_bypass' => false,
                            'role_1_id' => $roleModel?->id,
                            'role_2_id' => $role2Model?->id,
                            'portfolio_link' => 'https://github.com/sample-student',
                        ]
                    );

                    $skillIds = collect()
                        ->merge($roleModel?->skills->take(3)->pluck('id') ?? [])
                        ->merge($role2Model?->skills->take(2)->pluck('id') ?? [])
                        ->unique()
                        ->values()
                        ->all();
                    if (count($skillIds) > 0) {
                        $profile->skills()->syncWithoutDetaching($skillIds);
                    }

                    StudentRoleEvaluation::updateOrCreate(
                        ['user_id' => $student->id],
                        [
                            'score_role_1' => $item['score1'],
                            'score_role_2' => $item['score2'],
                            'recommended_score' => $item['score1'],
                            'recommended_role_id' => $roleModel?->id,
                            'final_role_id' => $roleModel?->id,
                            'is_overridden' => $item['overridden'],
                            'is_locked' => $item['locked'],
                            'updated_by' => $lecturer->id,
                        ]
                    );

                    $createdStudents[] = $student;
                }

                // Create 2 demo teams supervised by Asprak (Team 1 with complaint, Team 2 without complaint)
                $existingTeams = Team::where('team_type', 'internal')
                    ->where('supervisor', $assistant->id)
                    ->orderBy('id')
                    ->get();

                $demoTeam = $existingTeams->get(0) ?? Team::create([
                    'team_type' => 'internal',
                    'supervisor' => $assistant->id,
                    'is_locked' => false,
                ]);

                $demoTeam2 = $existingTeams->get(1) ?? Team::create([
                    'team_type' => 'internal',
                    'supervisor' => $assistant->id,
                    'is_locked' => false,
                ]);

                $takenOwnerIds = Project::whereNotIn('project_team', [$demoTeam->id, $demoTeam2->id])
                    ->pluck('project_owner')
                    ->toArray();

                $ownerTeam1 = Project::where('project_team', $demoTeam->id)->value('project_owner')
                    ?? (! in_array($lecturer->id, $takenOwnerIds, true)
                        ? $lecturer->id
                        : User::whereNotIn('id', $takenOwnerIds)->value('id') ?? $lecturer->id);

                Project::updateOrCreate(
                    ['project_team' => $demoTeam->id],
                    [
                        'project_name' => 'Sistem Informasi Proyek Aplikasi Dasar (Demo)',
                        'project_owner' => $ownerTeam1,
                        'project_associate' => 'Program Studi TRPL SV UGM',
                        'project_description' => 'Proyek simulasi untuk pengujian endpoint SIPAD.',
                    ]
                );

                $takenOwnerIds2 = Project::where('project_team', '!=', $demoTeam2->id)
                    ->pluck('project_owner')
                    ->toArray();

                $ownerTeam2 = Project::where('project_team', $demoTeam2->id)->value('project_owner')
                    ?? (! in_array($practitioner->id, $takenOwnerIds2, true)
                        ? $practitioner->id
                        : User::whereNotIn('id', $takenOwnerIds2)->value('id') ?? $practitioner->id);

                Project::updateOrCreate(
                    ['project_team' => $demoTeam2->id],
                    [
                        'project_name' => 'Smart Campus Inventory Tracker (Demo)',
                        'project_owner' => $ownerTeam2,
                        'project_associate' => 'PT. Digital Solusindo',
                        'project_description' => "PO: Ir. Dinar Nugroho Pratomo, S.Kom., M.IM., M.Cs.\nAplikasi manajemen inventaris laboratorium.",
                    ]
                );

                if (count($createdStudents) >= 8) {
                    StudentProfile::whereIn('user_id', [
                        $createdStudents[0]->id,
                        $createdStudents[2]->id,
                        $createdStudents[4]->id,
                        $createdStudents[6]->id,
                    ])->update(['team_id' => $demoTeam->id]);

                    StudentProfile::whereIn('user_id', [
                        $createdStudents[1]->id,
                        $createdStudents[3]->id,
                        $createdStudents[5]->id,
                        $createdStudents[7]->id,
                    ])->update(['team_id' => $demoTeam2->id]);

                    Storage::disk('local')->put('complaints/sample_evidence.pdf', '%PDF-1.4 Simulation Evidence');

                    Complaint::updateOrCreate(
                        [
                            'reporter_id' => $createdStudents[0]->id,
                            'reported_id' => $createdStudents[2]->id,
                            'team_id' => $demoTeam->id,
                        ],
                        [
                            'description' => "Alasan: Suka ilang ilangan\n\nAnggota tim tidak menghadiri rapat sprint mingguan selama 2 pekan berturut-turut dan saat weekly report selalu tidak hadir.",
                            'evidence_file_path' => 'complaints/sample_evidence.pdf',
                        ]
                    );
                }

                // Extra student accounts for testing UI branches (bypass & fresh profile)
                $bypassStudent = User::updateOrCreate(
                    ['email' => 'mhs.bypass@mail.ugm.ac.id'],
                    [
                        'name' => 'Raka Gemastik (Bypass)',
                        'user_role' => UserRole::Student,
                        'status' => 'active',
                    ]
                );

                $exclusiveTeam = Team::where('team_type', 'external')->orderBy('id')->first() ?? Team::create([
                    'team_type' => 'external',
                    'is_locked' => true,
                    'supervisor' => null,
                ]);

                $takenOwnerIds3 = Project::where('project_team', '!=', $exclusiveTeam->id)
                    ->pluck('project_owner')
                    ->toArray();
                $ownerExclusive = Project::where('project_team', $exclusiveTeam->id)->value('project_owner')
                    ?? (! in_array($bypassStudent->id, $takenOwnerIds3, true)
                        ? $bypassStudent->id
                        : User::whereNotIn('id', $takenOwnerIds3)->value('id') ?? $masterAdmin->id);

                Project::updateOrCreate(
                    ['project_team' => $exclusiveTeam->id],
                    [
                        'project_name' => 'Tim Software Gemastik A',
                        'project_owner' => $ownerExclusive,
                        'project_associate' => 'GEMASTIK - Software Development',
                        'project_description' => 'Tim Jalur Eksklusif GEMASTIK / LIDM',
                    ]
                );

                StudentProfile::updateOrCreate(
                    ['user_id' => $bypassStudent->id],
                    [
                        'nim' => '21/471009/SV/19009',
                        'is_bypass' => true,
                        'role_1_id' => $roles['PM']?->id,
                        'role_2_id' => null,
                        'team_id' => $exclusiveTeam->id,
                        'portfolio_link' => 'https://github.com/raka-gemastik',
                    ]
                );

                StudentRoleEvaluation::where('user_id', $bypassStudent->id)->update(['is_locked' => false]);

                $freshStudent = User::updateOrCreate(
                    ['email' => 'mhs.baru@mail.ugm.ac.id'],
                    [
                        'name' => 'Misbahul Huda',
                        'user_role' => UserRole::Student,
                        'status' => 'active',
                    ]
                );

                StudentProfile::updateOrCreate(
                    ['user_id' => $freshStudent->id],
                    [
                        'nim' => '21/471010/SV/19010',
                        'is_bypass' => false,
                        'role_1_id' => null,
                        'role_2_id' => null,
                        'team_id' => null,
                        'portfolio_link' => null,
                    ]
                );

                StudentRoleEvaluation::where('user_id', $freshStudent->id)->delete();
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Data simulasi lengkap (Master Admin, Dosen, Asprak, Praktisi, Mahasiswa, Tim Demo/Bypass, & Tiket Aduan) berhasil dibuat!',
            ]);
        })->name('seed-sample-data');
    });
}
