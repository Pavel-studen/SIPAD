<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MasterAdminController extends Controller
{
    public function dashboard()
    {
        return view('master-admin.dashboard');
    }

    public function revoke(Request $request)
    {
        $request->validate([
            'nip' => 'required|string',
        ]);
        $nip = $request->input('nip');
        return redirect()->back()->with('success', "Hak akses untuk NIP $nip berhasil dicabut.");
    }
}
