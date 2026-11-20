<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Setting;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DosenController extends Controller
{
    public function control()
    {
        return view('dosen.control');
    }

    public function access()
    {
        $stakeholders = User::whereIn('user_role', ['praktisi', 'asisten', 'mahasiswa', 'project_owner'])
                            ->orderBy('created_at', 'desc')
                            ->paginate(5);
        return view('dosen.access', compact('stakeholders'));
    }

    public function bypass()
    {
        $teams = Team::with('members')->orderBy('created_at', 'desc')->get();
        return view('dosen.bypass', compact('teams'));
    }

    public function monitoring()
    {
        $studentTotal = User::where('user_role', 'student')->count();
        $createdTeam = Team::count();
        $schedule = Setting::where('key', 'deadline_date')->first();

        return view('dosen.monitoring', compact('studentTotal', 'createdTeam', 'schedule'));
    }

    public function editTanggal(Request $request)
    {
        $request->validate(['deadline_date' => 'required|date']);

        Setting::updateOrCreate(
            ['key' => 'deadline_date'],
            ['value' => $request->deadline_date]
        );

        return redirect()->back()->with('success', 'Tanggal batas akhir berhasil diperbarui.');
    }

    public function kunciSemuaMahasiswa()
    {
        User::where('user_role', UserRole::Student)->update(['is_locked' => true]);

        return redirect()->back()->with('success', 'Semua data mahasiswa berhasil dikunci.');
    }

    public function acakTimOtomatis(Request $request)
    {
        $memberCount = $request->input('member_count', 3);

        $student = User::where('user_role', UserRole::Student)
                         ->whereNull('team_id')
                         ->inRandomOrder()
                         ->get();
        
        $chunks = $student->chunk($memberCount);
        foreach($chunks as $index => $chunk){
            $team = Team::create([
                'name' => 'Tim PAD ' . Str::random(5),
                'is_locked' => false
            ]);
            foreach($chunk as $std){
                $std->update(['team_id' => $team->id]);
            }
        }
        return redirect()->back()->with('success', 'Pengacakan tim berhasil dilakukan.');
    }

    public function tambahEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
            'role'  => 'required'
        ]);

        User::create([
            'email' => $request->email,
            'role'  => $request->role
        ]);

        return back()->with('success', 'Email berhasil ditambahkan.');
    }

    public function hapusEmail($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return back()->with('success', 'Data berhasil dihapus.');
    }

    public function simpanProyek(Request $request)
    {
        $request->validate([
            'nama_proyek'   => 'required',
            'project_owner' => 'required',
            'mitra_proyek'  => 'required'
        ]);

        return back()->with('success', 'Detail proyek berhasil disimpan.');
    }

    public function kunciTim(Request $request)
    {
        $request->validate([
            'team_name' => 'required|string|max:255',
            'project_associate' => 'required|string',
            'members' => 'required|array|min:1',
        ]);

        $team = Team::create([
            'team_name' => $request->team_name,
            'project_associate' => $request->project_associate,
            'is_locked' => true,
        ]);

        User::whereIn('id', $request->members)->update(['team_id' => $team->id]);
        return redirect()->route('dosen.bypass')->with('success', 'Tim berhasil dikunci.');
    }
}