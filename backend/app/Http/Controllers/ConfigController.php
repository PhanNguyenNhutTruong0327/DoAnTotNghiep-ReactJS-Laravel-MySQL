<?php

namespace App\Http\Controllers;
use App\Models\Config;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str; 


class ConfigController extends Controller
{
     /*lay danh sach thuong hieu*/

     public function getConfig(){
        $config = Config::first();
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'config'=>$config],200);
    }

    // lấy theo id or slug
    public function show($id){
        if(is_numeric($id)){
            $config = Config::find($id);
        }
        else{
            $config = Config::where('slug','=',$id)->first();
        }
        if ($config==null){
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'config' => null],404
            );
        }
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'config'=>$config],200);
    }

    // thêm 
    public function updateConfig($id, Request $request){

        $config = Config::find($id);
        $config->author = $request->author; 
        $config->email = $request->email; 
        $config->phone = $request->phone; 
        $files = $request->image;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = 'logo.' . $extension;
                $config->logo = $filename;
                $files->move(public_path('images/logo'), $filename);
            }
        }

        $config->zalo = $request->zalo; 
        $config->facebook = $request->facebook; 
        $config->address = $request->address; 
        $config->youtube = $request->youtube; 
        $config->updated_at = date('Y-m-d H:i:s');
        $config->updated_by = 1;
        $config->status = 1; 
        $config->save(); 
        return response()->json(['success' => true, 'message' => 'Cập nhật dữ liệu thành công', 'config' => $config],200); 
    }


    // tao config
    public function create(Request $request){

        $config = new Config();
        $config->author = $request->author; 
        $config->email = $request->email; 
        $config->phone = $request->phone; 
        $files = $request->image;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = 'logo.' . $extension;
                $config->logo = $filename;
                $files->move(public_path('images/logo'), $filename);
            }
        }

        $config->zalo = $request->zalo; 
        $config->facebook = $request->facebook; 
        $config->address = $request->address; 
        $config->youtube = $request->youtube; 
        $config->created_at = date('Y-m-d H:i:s');
        $config->created_by = 1;
        $config->status = 1; 
        $config->save(); 
        return response()->json(['success' => true, 'message' => 'Cập nhật dữ liệu thành công', 'config' => $config],200); 
    }


}
