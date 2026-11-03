<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// use App\Models\Team;
// use App\Models\Mahasiswa;

class DosenController extends Controller
{
    public function index()
    {
        return view('dosen.index');
    }
    public function control()
    {
        return view('dosen.control');
    }
    public function access()
    {
        return view('dosen.access');
    }
    public function bypass()
    {
        return view('dosen.bypass');
    }
}