<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssistantController extends Controller
{
    public function dashboard()
    {
        // $user = Auth::user();

        // if(!$user){
        //     return redirect('/login');
        // }

        // $teams = Team::with(['project_owner'])
        //     ->where('supervisor', $user->id)
        //     ->get();

        // return view('assistant.dashboard', compact('user', 'teams'));
        return view('assistant.dashboard');
    }

    public function detailPengaduan($id)
    {
        return view('assistant.pengaduan-detail');
    }
}
