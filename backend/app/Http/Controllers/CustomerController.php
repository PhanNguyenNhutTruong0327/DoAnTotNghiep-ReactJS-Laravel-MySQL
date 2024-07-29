<?php

namespace App\Http\Controllers;

use App\Models\Customers;
use App\Models\CustomerAddress;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;


class CustomerController extends Controller
{
    // ds tai khoan (admin hoac user) trang admin
    public function getCustomerBE($limit, $page = 1)
    {
        $qty_users = Customers::count();
        $end_page = 1;

        if ($qty_users > $limit) {
            $end_page = ceil($qty_users / $limit);
        }
        $offset = ($page - 1) * $limit;

        $users = Customers::select('db_customers.*', 'db_customeraddress.address_1', 'db_customeraddress.address_2')
            ->leftJoin('db_customeraddress', 'db_customers.id', '=', 'db_customeraddress.customer_id')
            ->leftjoin('db_social','db_social.customer_id', '=', 'db_customers.id')
            ->select('db_customeraddress.address_1', 'db_customers.*', 'db_customeraddress.address_2','db_social.provider')
            ->orderBy('db_customers.created_at', 'desc')
            ->offset($offset)
            ->limit($limit)
            ->get();


        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'users' => $users, 'qty_user' => $qty_users, 'end_page' => $end_page], 200);
    }

    // chi tiet
    public function show($id)
    {
        $customer = Customers::where('db_customers.id', '=', $id)
            ->leftjoin('db_customeraddress', 'db_customeraddress.customer_id', '=', 'db_customers.id')
            ->select('db_customers.*', 'db_customeraddress.address_1', 'db_customeraddress.address_2')
            ->first();
        if ($customer == null) {
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'user' => null],
                404
            );
        }

        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'customer' => $customer], 200);
    }


    // tao tai khoan
    public function store(Request $request)
    {

        $hashedPassword = password_hash($request->password, PASSWORD_DEFAULT);

        $user = new Customers();
        $user->name = $request->name;
        $user->phone_number = $request->phone;
        $user->email = $request->email;
        $user->password_hash = $hashedPassword;
        $user->active = $request->active;
        $user->register_at = date('Y-m-d H:i:s');
        $user->created_at = date('Y-m-d H:i:s');
        $user->save();

        $id = $user->id;
        $address = new CustomerAddress();
        $address->customer_id = $id;
        $address->address_1 = $request->address_1;
        $address->address_1 = $request->address_1;
        $address->save();

        return response()->json(['success' => true, 'message' => 'Thêm tài khoản thành công !', 'data' => $user], 200);
    }


    // cap nhat tai khoan
    public function update_info(Request $request, $id)
    {


        $user = Customers::find($id);
        $user->name = $request->name;
        $user->phone_number = $request->phone;
        $user->email = $request->email;
        if ($request->password !== '' && $request->password !== null) {
            $hashedPassword = password_hash($request->password, PASSWORD_DEFAULT);
            $user->password_hash = $hashedPassword;
        }
        $user->active = $request->active;
        $user->register_at = date('Y-m-d H:i:s');
        $user->save();

        // $address =CustomerAddress::where('customer_id', '=',$id)->first();
        // $address->address_1 = $request->address_1;
        // $address->address_2 = $request->address_2;
        // $address->save();

        return response()->json(['success' => true, 'message' => 'Cập nhật tài khoảng thành công', 'user' => $user], 200);
    }


    // xoa vinh vien
    public function destroy($id)
    {
        $user = Customers::findOrFail($id);
        if ($user == null) {
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'user' => null],
                404
            );
        }
        $user->delete();
        return response()->json(['success' => true, 'message' => 'Xóa dữ liệu thành công !', 'user' => null], 200);
    }



    public function login(Request $request)
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

        $user = Customers::where('email', $request->email)
            ->where('active', 1)
            ->first();

        if ($user === null) {
            return response()->json(['success' => false, 'message' => 'Email không tồn tại hoặc tài khoản chưa được kích hoạt!', 'data' => null]);
        } else {
            if (password_verify($request->password, $user->password_hash)) {
                $token = $user->createToken('auth_token')->plainTextToken;
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
            } else {
                return response()->json(['success' => false, 'message' => 'Mật khẩu không đúng!', 'data' => null]);
            }
        }
    }

    // lay dl test
    public function getOneCustomer(Request $request)
    {
        $user = $request->user();

        // Đối với người dùng thông thường
        $address = CustomerAddress::where('customer_id', $user->id)->first();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'active' => $user->active,
                'register_at' => $user->register_at,
                'created_at' => $user->created_at,
            ],
            'address' => $address, // Địa chỉ của người dùng thông thường
        ]);
        
    }

    // trash
    public function trash($id)
    {
        $user = Customers::find($id);
    
        if ($user == null) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy dữ liệu !']);
        }
    
        $qty_order = Order::where('customer_id', '=', $id)
            ->whereIn('status', [2, 3, 4])
            ->count();
    
        if ($qty_order > 0) {
            return response()->json(['success' => false, 'message' => 'Tài khoản đang có đơn hàng chưa giao không thể xóa !']);
        }
    
        $user->active = 0;
        $user->save();
    
        return response()->json(['success' => true, 'message' => 'Đã khóa tài khoản !']);
    }
    
    // phục hồi trash
    public function rescoverTrash($id)
    {
        $user = Customers::find($id);
        if ($user == null) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy dữ liệu !']);
        }
        $user->active = 1;
        $user->save();
        return response()->json(['success' => true, 'message' => 'Mở khóa tài khoản thành công !']);
    }

    // get trash
    public function getListTrash($limit, $page = 1)
    {

        $qty = Customers::where('active', '=', 0)->count();

        $end_page = 1;

        if ($qty > $limit) {
            $end_page = ceil($qty / $limit);
        }
        $offset = ($page - 1) * $limit;

        $trash = Customers::where('active', '=', 0)->offset($offset)->limit($limit)->get();

        return response()->json(['success' => true, 'message' => 'tai thanh cong', 'trash' => $trash, 'qty' => $qty, 'page' => $end_page]);
    }

    // check email
    public function check_email(Request $request)
    {
        $users = DB::table('db_customers')->where([['email', '=', $request->email], ['active', '=', 1]])->get();
        if (count($users) > 0) {
            return response()->json(
                ['success' => true, 'message' => 'Đăng nhập thành công !', "customer" => $users],
                200
            );
        } else {
            return response()->json(
                ['success' => false, 'message' => 'Email này chưa từng được đăng ký !', "customer" => null],
                200
            );
        }
    }

    // Forgot Password
    public function forgotPassword(Request $request)
    {
        if ($request->email === null || $request->password === null) {
            return response()->json(
                ['success' => false, 'message' => 'Đổi mật khẩu không thành công !'],
                200
            );
        } else {
            $hashedPassword = password_hash($request->password, PASSWORD_DEFAULT);
            $reset_password = DB::table('db_customers')
                ->where('email', $request->email)
                ->update(['password_hash' => $hashedPassword]);
            return response()->json(
                ['success' => true, 'message' => 'Đổi mật khẩu thành công !', "reset_password" => $reset_password],
                200
            );
        }
    }

    // register
    public function register(Request $request)
    {
        $users = DB::table('db_customers')->where([['email', '=', $request->email]])->count();
        if ($users > 0) {
            return response()->json(
                ['success' => false, 'message' => 'Email này đã được đăng ký trước đây, vui lòng sử dụng email khác !', 'data' => null],
                200
            );
        }
        $hashedPassword = password_hash($request->password, PASSWORD_DEFAULT);

        $user = new Customers();
        $user->name = $request->name;
        $user->phone_number = $request->phone;
        $user->email = $request->email;
        $user->password_hash = $hashedPassword;
        $user->active = $request->active;
        $user->register_at = date('Y-m-d H:i:s');
        $user->created_at = date('Y-m-d H:i:s');
        $user->save();

        return response()->json(['success' => true, 'message' => 'Bạn đã đăng ký tài khoản thành công !', 'data' => $user], 200);
    }

    // update password
    public function update_password($id, Request $request)
    {
        $customer = Customers::find($id);
        if($customer === null){
            return response()->json(
                ['success' => false, 'message' => 'Không tìm thấy tài khoản !'],
                200
            );
        }
        if (password_verify($request->password, $customer->password_hash)) {
            $hashedPassword = password_hash($request->password_new, PASSWORD_DEFAULT);
            $customer->password_hash = $hashedPassword;
            $customer->save();
            return response()->json(['success' => true, 'message' => 'Đã thay đổi mật khẩu thành công!']);
        } else {
            return response()->json(['success' => false, 'message' => 'Mật khẩu cũ không đúng !. Hãy thử lại sau.']);
        }    
    }
}
