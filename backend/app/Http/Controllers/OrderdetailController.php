<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Orderdetail;

class OrderdetailController extends Controller
{
    public function createDetail(array $request){
        $orderdetail = new Orderdetail();
        $orderdetail->order_id = $request['order_id']; 
        $orderdetail->product_id = $request['product_id']; 
        $orderdetail->price = $request['price']; 
        $orderdetail->qty = $request['qty']; 
        $orderdetail->discount = $request['discount']; 
        $orderdetail->amount = $request['amount']; 
        // $orderdetail->order_id = $request->order_id; 
        // $orderdetail->product_id = $request->product_id; 
        // $orderdetail->price = $request->price; 
        // $orderdetail->qty = $request->qty; 
        // $orderdetail->discount = $request->discount; 
        // $orderdetail->amount = $request->amount; 

        $orderdetail->save(); 
    }
}
