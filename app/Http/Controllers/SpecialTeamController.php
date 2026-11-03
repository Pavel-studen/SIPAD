<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Team;

class SpecialTeamController extends Controller
{
    public function lockTeam(Request $request)
    {
        // Input validation
        $request->validate([
            'team_id' => 'required|exists:teams,id',
        ]);

        // Find the team and update its status to locked
        $team = Team::findOrFail($request->team_id);
        $team->update([
            'is_locked' => true,
            'locked_at' => now(),
        ]);

        // Redirect back with a success message
        return redirect()->back()->with('success', 'Tim berhasil dikunci dan disimpan.');
    }
}