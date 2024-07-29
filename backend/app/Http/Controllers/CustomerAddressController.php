<?php

namespace App\Http\Controllers;
use App\Models\CustomerAddress;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CustomerAddressController extends Controller
{
    
    // tao dia chi dau tien 
    public function store(Request $request){

        $data = new CustomerAddress();
        $data->customer_id = $request->customer_id;
        $data->address_1 = $request->address_1;
        $data->save();

        return response()->json(['success' => true, 'message' => 'Thêm thành công', 'data' => $data],200); 
    }


        // them dia chi thu 2
        public function add(Request $request, $customer_id){

            $data = CustomerAddress::where('customer_id','=',$customer_id)->first();
            $data->address_2 = $request->address_2;
            $data->save();
    
            return response()->json(['success' => true, 'message' => 'Thêm thành công', 'data' => $data],200); 
        }

    // cap nhat dia chi 
    public function updateAddress(Request $request,$customer_id){

        $data = CustomerAddress::where('customer_id','=',$customer_id)->first();

        if($request->address_code === 1){
            $data->address_1 = $request->address;
            $data->save();
        }else{
            $data->address_2 = $request->address;
            $data->save();
        }
        return response()->json(['success' => true, 'message' => 'Cập nhật thành công', 'data' => $data],200);
    }

    
}
