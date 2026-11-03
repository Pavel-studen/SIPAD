<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function updateSchedule(Request $request)
    {
        // Received date input validation
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        // Save the updated schedule logics into the database
        // $jadwal = Jadwal::find(1);
        // $jadwal->update([...]);

        return redirect()->back()->with('success', 'Jadwal berhasil diubah.');
    }
}