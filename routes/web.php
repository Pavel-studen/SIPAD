<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/master-admin', [App\Http\Controllers\MasterAdminController::class, 'dashboard'])->name('master-admin.dashboard');
Route::delete('/master-admin/revoke', [App\Http\Controllers\MasterAdminController::class, 'revoke'])->name('master-admin.revoke');
Route::delete('/master-admin/store', [App\Http\Controllers\MasterAdminController::class, 'store'])->name('master-admin.store');
Route::get('/dosen/control', [App\Http\Controllers\DosenController::class, 'control'])->name('dosen.control');
Route::get('/dosen/access', [App\Http\Controllers\DosenController::class, 'access'])->name('dosen.access');
Route::get('/dosen/bypass', [App\Http\Controllers\DosenController::class, 'bypass'])->name('dosen.bypass');