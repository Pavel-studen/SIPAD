<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class MasterAdminController extends Controller
{
    public function dashboard()
    {
        $lecturer = User::where('user_role', UserRole::Admin)->get();
        return view('master-admin.dashboard', compact('lecturer'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'user_role' => UserRole::Admin,
        ]);

        return redirect()->route('master-admin.dashboard')->with('success', 'Data admin berhasil ditambahkan.');
    }
    
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->update([
            'user_role' => UserRole::Lecturer,
        ]);
        return redirect()->route('master-admin.dashboard')->with('success', 'Hak akses admin berhasil dicabut, status kembali menjadi dosen biasa.');
    }
}
