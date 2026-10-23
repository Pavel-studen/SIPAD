<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MasterAdminController extends Controller
{
    public function index()
    {
        return view('master-admin.index');
    }
}