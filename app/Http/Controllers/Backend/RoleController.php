<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoleRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Backend/Role/Index',[
            'role' => Role::get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Backend/Role/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleRequest $request)
    {
        $data = $request->validated();
        Role::create($data);
        return to_route('manage-role.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $role = Role::findById($id);
        return Inertia::render('Backend/Role/Edit',[
            'role' => $role
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleRequest $request, $role)
    {
        $data = $request->validated();
        $role = Role::findById($role);
        $role->update($data);
        return to_route('manage-role.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($role)
    {
        $role = Role::findById($role);
        $role->delete();
        return to_route('manage-role.index');
    }

    public function listUsers(Request $request)
    {
        // Tampilkan semua data user kecuali user yang login
        $user = User::where('id','!=',$request->user()->id)->with('roles')->get();
        return Inertia::render('Backend/User/Index',[
            'user' => $user
        ]);
    }

    public function setRole($id)
    {
        /**
         * Tampilkan semua data roler dan user yang akan diberikan role ke form
         * AssignRole
         */
        $user = User::findOrFail($id);
        $roles = Role::latest()->get();
        return Inertia::render('Backend/User/AssignRole',[
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    public function assignRole(Request $request,$id)
    {
        /**
         * lakukan proses assignRole menggunakan method syncRoles
         * Jika user belum memiliki role maka role tersebut akan ditambahkanke user tetsebut
         * Jika user sudah memiliki role maka role yang ada diganti dengan role yang baru.
         */
        $user = User::findOrFail($id);
        $user->syncRoles($request->input('roles'));
        return to_route('listUsers');
    }
}
