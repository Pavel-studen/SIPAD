<?php

namespace App\Http\Controllers;

// use App\Models\Mahasiswa;
// use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;

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