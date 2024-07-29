<?php

namespace App\Http\Controllers;

use App\Models\Roles;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RolesController extends Controller
{

    // tao roles 
    public function store(Request $request){
        $roles = new Roles();
        $roles->role_name = $request->role_name;
        $roles->privileges = $request->privileges;
        $roles->created_at = date('Y-m-d H:i:s');
        $roles->save();
        return response()->json(['sucess'=> true, 'message'=>'Thêm dữ liệu thành công ! ']);
    }

        // cap nhat roles 
    public function update(Request $request, $id){
        $roles = Roles::find($id);
        $roles->role_name = $request->role_name;
        $roles->privileges = $request->privileges;
        $roles->updated_at = date('Y-m-d H:i:s');
        $roles->save();
        return response()->json(['sucess'=> true, 'message'=>'Cập nhật dữ liệu thành công ! ']);
    }
    
    // lay tat ca
    public function getAll(){
        $roles = Roles::get();
        return response()->json(['sucess'=> true, 'message'=>'Tải dữ liệu thành công !', 'data'=>$roles]);
    }
        
    

}