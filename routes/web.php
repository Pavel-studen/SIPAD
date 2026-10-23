<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/master-admin', [App\Http\Controllers\MasterAdminController::class, 'index'])->name('master-admin.index');
Route::get('/dosen', [App\Http\Controllers\DosenController::class, 'index'])->name('dosen.index');
Route::get('/dosen/control', [App\Http\Controllers\DosenController::class, 'control'])->name('dosen.control');
Route::get('/dosen/access', [App\Http\Controllers\DosenController::class, 'access'])->name('dosen.access');
Route::get('/dosen/bypass', [App\Http\Controllers\DosenController::class, 'bypass'])->name('dosen.bypass');