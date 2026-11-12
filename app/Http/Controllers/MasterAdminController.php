<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Http\Request;

class MasterAdminController extends Controller
{
    public function destroyDosen($id)
    {
        // Find user data based ID
        $dosen = User::findOrFail($id);

        // Validate that the user has lecturer (Dosen) role
        if ($dosen->role !== UserRole::DOSEN){
            return redirect()->back()->with('error', 'Data yang dipilih bukan merupakan akun Dosen.');
        }

        // Erase lecturer (dosen) data
        $dosen->delete();
        return redirect()->back()->with('success', 'Data dosen berhasil dihapus.');
    }
}
