<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TagController extends Controller
{

    // tao tag 
    public function store(Request $request){
        $tag = new Tag();
        $tag->tag_name = $request->tag_name;
        $tag->icon = $request->icon;
        $tag->created_at = date('Y-m-d H:i:s');
        $tag->created_by = $request->created_by;
        $tag->updated_by = $request->updated_by;
        $tag->save();
        return response()->json(['sucess'=> true, 'message'=>'Thêm dữ liệu thành công ! ']);
    }

    // lay tat ca
    public function getAll(){
        $tag = tag::get();
        return response()->json(['sucess'=> true, 'message'=>'Tải dữ liệu thành công !', 'data'=>$tag]);
    }
        
    

}