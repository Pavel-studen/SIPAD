<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Complaint;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PractitionerController extends Controller
{
    public function dashboard(Request $request) 
    {
        $search = $request->input('search');

        $teams = Team::with(['members.user'])
            ->when($search, function ($query, $search){
                $query->where('name', 'like', "%{$search}%")
                      ->orWhereHas('members.user', function ($q) use ($search){
                        $q->where('name', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(6)
            ->withQueryString();
        
        $teamTotal = Team::count();
        $studentTotal = User::where('user_role', UserRole::Student)->count();
        
        return view('practitioner.dashboard', compact('teams', 'teamTotal', 'studentTotal', 'search'));
    }

    public function complaint()
    {
        $complaintList = Complaint::with('reporter')->latest()->paginate(10);
        return view('practitioner.complaint', compact('complaintList'));
    }

    public function getStudentDetail($id)
    {
        $student = User::with(['studentProfile.team'])
            ->where('user_role', UserRole::Student)
            ->findOrFail($id);
        
        $profile = $student->studentProfile;

        return response()->json([
            'status' => 'success',
            'data'   => [
                'id'            => $student->id,
                'name'          => $student->name,
                'email'         => $student->email,
                'nim'           => $profile->nim ?? '-',
                'prodi'         => $profile->prodi ?? 'Teknologi Rekayasa Perangkat Lunak',
                'angkatan'      => $profile->angkatan ?? '2023',
                'role_1'        => $profile->primary_role ?? 'Backend Developer',
                'role_2'        => $profile->secondary_role ?? 'UI/UX Designer',
                'skills'        => $profile->skills ?? ['Laravel', 'Tailwind CSS', 'MySQL'],
                'github_url'    => $profile->github_url ?? '-',
                'portfolio_url' => $profile->portfolio_url ?? '-',
                'team_name'     => $profile->team->name ?? 'Belum tergabung tim',
            ]
        ]);
    }
}