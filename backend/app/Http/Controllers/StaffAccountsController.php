<?php

namespace App\Http\Controllers;

use App\Models\StaffAccounts;
use App\Models\StaffRoles;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class StaffAccountsController extends Controller
{
    // them 
    public function create(Request $request){
        $staff = new StaffAccounts();
        
        $staff->first_name = $request->first_name;
        $staff->last_name = $request->last_name;
        $staff->phone_number = $request->phone_number;
        $staff->email = $request->email;
        $staff->password = $request->password;
        $staff->active = $request->active;
        $staff->profile_img = $request->image;
        $staff->registered_at = date('Y-m-d H:i:s');
        $staff->save();

        $id_staff = $staff->id;
        $staff_roles = new StaffRoles();
        $staff_roles->staff_id = $id_staff;
        $staff_roles->role_id = $request->role_id;
        $staff_roles->save();

        return response()->json(['sucess'=> true, 'message'=>'Thêm dữ liệu thành công ! ']);

    }
}