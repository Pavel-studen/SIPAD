<?php

use App\Enums\UserRole;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\MasterAdminController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SpecialTeamController;
use App\Http\Controllers\TeamController;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
    });
}
