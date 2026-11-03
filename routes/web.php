<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Route for the master admin dashboard
Route::get('/master-admin', [App\Http\Controllers\MasterAdminController::class, 'dashboard'])->name('master-admin.dashboard');

// Routes for managing master admin actions
Route::delete('/master-admin/revoke', [App\Http\Controllers\MasterAdminController::class, 'revoke'])->name('master-admin.revoke');
Route::delete('/master-admin/store', [App\Http\Controllers\MasterAdminController::class, 'store'])->name('master-admin.store');

// Routes for managing lecturer (dosen) actions
Route::get('/dosen/control', [App\Http\Controllers\DosenController::class, 'control'])->name('dosen.control');
Route::get('/team/randomize', [App\Http\Controllers\TeamController::class, 'randomize'])->name('team.randomize');
Route::get('/schedule/update', [App\Http\Controllers\ScheduleController::class, 'updateSchedule'])->name('schedule.update');
Route::get('/dosen/access', [App\Http\Controllers\DosenController::class, 'access'])->name('dosen.access');
Route::get('/dosen/bypass', [App\Http\Controllers\DosenController::class, 'bypass'])->name('dosen.bypass');
Route::get('/special-team/lock', [App\Http\Controllers\SpecialTeamController::class, 'lockTeam'])->name('special-team.lock');