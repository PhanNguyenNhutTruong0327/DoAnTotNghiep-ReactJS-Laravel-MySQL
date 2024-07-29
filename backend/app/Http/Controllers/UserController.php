<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\StaffRoles;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    // ds tai khoan (admin hoac user) trang admin
    public function getAllUser($limit, $page){

        $qty = User::where('active','!=', 0)->count();

        $pages = 1;
        if($pages > $limit){
            $pages = ceil($qty / $limit);
        }
        $offset = ($page - 1) * $limit;

        $users = User::where('db_staffaccounts.active','!=',0)
        ->leftjoin('db_staffroles','db_staffroles.staff_id', '=','db_staffaccounts.id')
        ->leftjoin('db_roles','db_roles.id', '=','db_staffroles.role_id')
        ->select('db_staffaccounts.*','db_roles.role_name')
        ->offset($offset)->limit($limit)->get();

        $qty_trash = User::where('active','=', 0)->count();
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'users'=>$users,'qty_trash'=>$qty_trash,'qty'=>$qty,'page'=>$pages],200);
    }

    // chi tiet
    public function show($id){
        $user = User::where('db_staffaccounts.id','=',$id)
        ->leftjoin('db_staffroles','db_staffroles.staff_id', '=','db_staffaccounts.id')
        ->leftjoin('db_roles','db_roles.id', '=','db_staffroles.role_id')
        ->select('db_staffaccounts.*','db_roles.role_name','db_roles.privileges','db_roles.id as role_id')
        ->first();

        if ($user==null){
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'user' => null],404
            );
        }
         
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'user'=>$user],200);
    }
    

    // tao tai khoan
    public function store(Request $request){

        $hashedPassword = bcrypt($request->password);
        $user = new User();
        $user->name = $request->name; 
        $user->email = $request->email; 
        $user->phone_number = $request->phone; 
        $user->password = $hashedPassword; 
         $files = $request->image;
         if ($files != null) {
             $extension = $files->getClientOriginalExtension();
             if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                 $filename = $user->name . '.' . $extension;
                 $user->profile_img = $filename;
                 $files->move(public_path('images/user'), $filename);
             }
         }
        $user->created_at = date('Y-m-d H:i:s');
        $user->created_by = 1;
        $user->active = $request->active; 
        $user->save();

        $role = new StaffRoles();
        $role->staff_id = $user->id;
        $role->role_id = $request->role_id;
        $role->save();

        return response()->json(['success' => true, 'message' => 'Thêm dữ liệu thành công !', 'data' => $user],200); 
    }


    // cap nhat tai khoan 
    public function update(Request $request,$id){
        $hashedPassword = bcrypt($request->password);
        $user = User::find($id);
        $user->name = $request->name; 
        $user->email = $request->email; 
        $user->phone_number = $request->phone; 
        if($request->password !== ''){
            $user->password = $hashedPassword; 
        }
         $files = $request->image;
         if ($files != null) {
             $extension = $files->getClientOriginalExtension();
             if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                 $filename = $user->name . '.' . $extension;
                 $user->profile_img = $filename;
                 $files->move(public_path('images/user'), $filename);
             }
         }
        $user->updated_at = date('Y-m-d H:i:s');
        $user->updated_by = 1;
        $user->active = $request->active; 
        $user->save();

        $role = StaffRoles::where('staff_id',$id)->first();
        $role->role_id = $request->role_id;
        $role->save();
        return response()->json(['success' => true, 'message' => 'Cập nhật thành công !', 'user' => $user],200);
    }

    
    // xoa vinh vien
    public function destroy($id){
        $user = User::findOrFail($id);
        if ($user==null){
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'user' => null],404
            );
        }
        $user->delete();
        $role = StaffRoles::where('staff_id',$id)->first();
        $role->delete();
        return response()->json(['success' => true, 'message' => 'Xóa dữ liệu thành công', 'user' => null],200);
    }


    // /* them frontend */
    // public function register(Request $request){
    //     $user = new User();
    //     $user->name = $request->name; 
    //     $user->email = $request->email; 
    //     $user->phone = $request->phone; 
    //     // $user->username = $request->username; 
    //     $user->password = $request->password; 
    //     // $user->address = $request->address; 
    //     $user->roles = $request->roles;
    //     $user->created_at = date('Y-m-d H:i:s');
    //     $user->created_by = 1;
    //     $user->status = $request->status; 
    //     $user->save();
    //     return response()->json(['success' => true, 'message' => 'Đăng kí thành công', 'data' => $user],201); 
    // }

    // // ktra login
    // public function login(Request $request){
    //     $arg = [
    //         ['email','=',$request->email],
    //         ['password','=',$request->password],
    //         ['status','=',1]
    //     ];
    //     $user = User::where($arg) -> first();
    //     if($user == null){
    //         return response()->json(['success' => false,'message'=>'Email/Password không đúng !', 'data' => null]);
    //     }
    //     else{
    //         return response()->json(['success' => true,'message'=>'Đăng nhập thành công !', 'data' => $user],200);
    //     }
    // }


        // trash
        public function trash($id){
            $user = User::find($id);
            if($user == null){
                return response()->json(['success' => false, 'message' =>'Không tìm thấy dữ liệu !']);
            }
            $user->active = 0;
            $user->updated_at = date('Y-m-d H:i:s');
            $user->save();
            return response()->json(['success' => true, 'message' =>'Đã đưa vào thùng rác !', 'data' => $user]);
        }
        
        // phục hồi trash
        public function rescoverTrash($id){
            $user = User::find($id);
            if($user == null){
                return response()->json(['success' => false, 'message' =>'Không tìm thấy dữ liệu !']);
            }
            $user->active = 2;
            $user->updated_at = date('Y-m-d H:i:s');
            $user->save();
            return response()->json(['success' => true, 'message' =>'Phục hồi thành công !', 'data' => $user]);
        }
    
        // get trash
        public function getListTrash($limit, $page){

            $qty = User::where('active','=', 0)->count();
    
            $pages = 1;
            if($pages > $limit){
                $pages = ceil($qty / $limit);
            }
            $offset = ($page - 1) * $limit;
    
            $users = User::where('db_staffaccounts.active','=',0)
            ->leftjoin('db_staffroles','db_staffroles.staff_id', '=','db_staffaccounts.id')
            ->leftjoin('db_roles','db_roles.id', '=','db_staffroles.role_id')
            ->select('db_staffaccounts.*','db_roles.role_name')
            ->offset($offset)->limit($limit)->get();
    
            return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'users'=>$users,'qty'=>$qty,'page'=>$pages],200);
        }

    
    // login
    public function login_admin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)
                        ->where('active', 1)
                        ->first();

        if($user === null){
            return response()->json(['success' => false,'message'=>'Email không tồn tại hoặc tài khoản chưa được kích hoạt!', 'data' => null]);
        }
        else{
            if(password_verify($request->password, $user->password)){
                $token = $user->createToken('admin_token')->plainTextToken;
                $tokenLifetime = now()->addMinutes(config('sanctum.expiration'));
                return response()->json([
                    'success' => true,
                    'message' => 'Đăng nhập thành công!',
                    'data' => [
                        'user' => $user,
                        'token' => $token,
                        'token_expires_at' => $tokenLifetime->toISOString()
                    ]
                ], 200);
            }
            else{
                return response()->json(['success' => false,'message'=>'Mật khẩu không đúng!', 'data' => null]);
            }
        }
    }

    }
