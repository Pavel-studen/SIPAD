<?php

namespace App\Http\Controllers;
// use App\Models\Team;
// use App\Models\Student;

class TeamController extends Controller
{
    public function randomize(Request $request)
    {
        // 1. Logika pengacakan tim PAD otomatis diletakkan di sini.
        // Contoh langkah:
        // - Ambil daftar mahasiswa yang belum memiliki tim atau timnya belum di-lock
        // - Lakukan algoritma grouping/pengacakan
        // - Simpan perubahan ke database
        
        // Simulasikan delay atau proses eksekusi (bisa dihapus)
        // sleep(1);

        // 2. Redirect kembali ke halaman dengan pesan sukses
        return redirect()->back()->with('success', 'Pengacakan tim otomatis berhasil dijalankan.');
    }
}