<?php

use App\Enums\UserRole;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\AssistantController;
use App\Http\Controllers\LecturerController;
use App\Http\Controllers\PractitionerController;
use App\Http\Controllers\MasterAdminController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SpecialTeamController;
use App\Http\Controllers\StudentController;
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
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('student.portal', ['initialSection' => 'pilih-peran']);
})->name('student.portal');

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
    $validSection = in_array($section, ['hasil-role', 'pengaduan'], true) ? $section : 'pilih-peran';

    return view('student.portal', ['initialSection' => $validSection]);
})->name('student.mahasiswa');

Route::get('/auth/sso-return', function () {
    return view('student.portal', ['initialSection' => 'pilih-peran']);
})->name('student.sso-return');

Route::get('/avatars/{filename}', [StudentProfilingController::class, 'showAvatar'])
    ->where('filename', '[A-Za-z0-9._-]+')
    ->name('avatars.show');

// Route for login page
Route::view('/login', 'auth.login')->name('login');

// Route for logout
Route::post('/logout', function(Request $request){
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/login');
})->name('logout');

// Route for the student dashboard
Route::middleware(['web'])->prefix('student')->name('student.')->group(function(){
    Route::get('/dashboard', [StudentController::class, 'dashboard'])->name('dashboard');
});

Route::middleware(['web'])->group(function(){
    // Route for the assistant dashboard
    Route::get('/assistant', [AssistantController::class, 'dashboard'])->name('assistant.dashboard');
    Route::get('/assistant/pengaduan/{id}', [AssistantController::class, 'detailPengaduan'])->name('assistant.pengaduan-detail');

    // Route for the master admin dashboard
    Route::get('/master-admin', [MasterAdminController::class, 'dashboard'])->name('master-admin.dashboard');
    Route::post('/master-admin/store', [MasterAdminController::class, 'store'])->name('master-admin.store');

    // Route for changing status admin to lecturer (using {id} parameter)
    Route::delete('/master-admin/lecturer/{id}', [MasterAdminController::class, 'destroy'])->name('master-admin.lecturer.destroy');
});

// Routes for managing lecturer actions
Route::middleware(['web'])->prefix('lecturer')->name('lecturer.')->group(function(){
    // Route for views
    Route::get('/control', [LecturerController::class, 'control'])->name('control');
    Route::get('/access', [LecturerController::class, 'access'])->name('access');
    Route::get('/bypass', [LecturerController::class, 'bypass'])->name('bypass');

    // Route for actions: Control page
    Route::post('/control/edit-tanggal', [LecturerController::class, 'editTanggal'])->name('editTanggal');
    Route::post('/control/kunci-mahasiswa', [LecturerController::class, 'kunciSemuaMahasiswa'])->name('kunciMahasiswa');
    Route::post('/control/acak-tim', [LecturerController::class, 'acakTimOtomatis'])->name('acakTim');

    // Route for actions: User page
    Route::post('/access/tambah-email', [LecturerController::class, 'tambahEmail'])->name('tambahEmail');
    Route::post('/access/import-csv', [LecturerController::class, 'importCSV'])->name('importCSV');
    Route::post('/access/hapus-email/{id}', [LecturerController::class, 'hapusEmail'])->name('hapusEmail');

    // Route for actions: Bypass page
    Route::post('/bypass/tambah-anggota', [LecturerController::class, 'tambahAnggota'])->name('tambahAnggota');
    Route::post('/bypass/kunci-tim/{id}', [LecturerController::class, 'kunciTim'])->name('kunciTim');
});

Route::middleware(['web'])->prefix('practitioner')->name('practitioner.')->group(function(){
    Route::get('/dashboard', [PractitionerController::class, 'dashboard'])->name('dashboard');
    Route::get('/complaint', [PractitionerController::class, 'complaint'])->name('complaint');
    Route::get('/input-project', [PractitionerController::class, 'inputProject'])->name('input-project');
    Route::post('/input-project/simpan-proyek', [PractitionerController::class, 'simpanProyek'])->name('simpanProyek');

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

                if (count($createdStudents) >= 7) {
                    StudentProfile::whereIn('user_id', [
                        $createdStudents[0]->id,
                        $createdStudents[2]->id,
                        $createdStudents[4]->id,
                        $createdStudents[6]->id,
                    ])->update(['team_id' => $demoTeam->id]);

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

                // Extra student accounts for testing UI branches (bypass & fresh profile)
                $bypassStudent = User::updateOrCreate(
                    ['email' => 'mhs.bypass@mail.ugm.ac.id'],
                    [
                        'name' => 'Raka Gemastik (Bypass)',
                        'user_role' => UserRole::Student,
                        'status' => 'active',
                    ]
                );

                StudentProfile::updateOrCreate(
                    ['user_id' => $bypassStudent->id],
                    [
                        'nim' => '21/471009/SV/19009',
                        'is_bypass' => true,
                        'role_1_id' => $roles['PM']?->id,
                        'role_2_id' => null,
                        'team_id' => null,
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
                'message' => 'Data simulasi lengkap (Dosen, Asprak, Praktisi, 8 Mahasiswa terevaluasi, Tim Demo, & 1 Tiket Aduan) berhasil dibuat!',
            ]);
        })->name('seed-sample-data');
    });
}
