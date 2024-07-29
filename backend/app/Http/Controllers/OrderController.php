<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductSale;
use App\Models\Orderdetail;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\OrderdetailController;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

use App\Mail\MailOrder;
use Mail;
use App\Mail\SetUpMail;
use Illuminate\Support\Facades\Mail as FacadesMail;

class OrderController extends Controller
{

    // ds don hang trang admin co phan trang
    public function getAllOderBE($limit, $page = 1)
    {
        $qty_order = Order::count();
        $qty_page = 1;
        if ($qty_order > $limit) {
            $qty_page = ceil($qty_order / $limit);
        }

        $offset = ($page - 1) * $limit;

        $orders = Order::join("db_customers", "db_customers.id", '=', "db_order.customer_id")
            ->select("db_order.*", "db_customers.name as name_customer")
            ->orderBy("db_order.created_at",'desc')
            ->offset($offset)
            ->limit($limit)
            ->get();

        $qty_cancel = Order::where('status', '=', 0)->count();
        $end_page = ceil($qty_order / $limit); // Tính toán số trang cuối cùng

        return response()->json([
            'success' => true,
            'message' => "Tải dữ liệu thành công",
            'orders' => $orders,
            'qty_order' => $qty_order,
            'qty_cancel' => $qty_cancel,
            'page_end' => $end_page // Trả về số trang cuối cùng
        ], 200);
    }


    // chi tiet don hang
    public function show($id)
    {

        $order = Order::where("db_order.id", '=', $id)
            ->join("db_customers", "db_customers.id", '=', "db_order.customer_id")
            ->select('db_customers.name as nametk', 'db_order.*')
            ->first();

        $order_detail = Orderdetail::where("db_orderdetail.order_id", '=', $id)
            ->join('db_product', 'db_product.id', '=', "db_orderdetail.product_id")
            ->select('db_product.name', 'db_product.image', 'db_orderdetail.*')
            ->get();

        $total = 0;
        foreach ($order_detail as $r) {
            $total += ($r->price * $r->qty - $r->discount);
        }

        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'order' => $order, 'order_detail' => $order_detail, 'total' => $total], 200);
    }

    // tao don hang
    public function store(Request $request)
    {
        $date = Carbon::now();
        $date_time = $date->format('Y-m-d H:i:s');

        foreach ($request->order_detail as $_detail) {
            if ($_detail["sale_id"] !== 0) {
                $product_sale = DB::table('db_productsale')
                    ->where('db_productsale.status', 1)
                    ->where('db_productsale.start_time', '<=', $date_time)
                    ->where('db_productsale.end_time', '>=', $date_time)
                    ->where('db_productsale.product_id', '=', $_detail['id']);

                $qty_product = Product::where('db_product.id', $_detail['id']);

                if ($product_sale->count() > 0) {
                    if (($product_sale->first()->qty - $product_sale->first()->qty_sold) < 0 || ($product_sale->first()->qty - $product_sale->first()->qty_sold) < $_detail["quantity"]) {
                        return response()->json(
                            ['success' => false, 'message' => 'Thanh toán không thành công, số lượng sản phẩm còn lại không đủ.'],
                            200
                        );
                    }
                } else {
                    return response()->json(
                        ['success' => false, 'message' => 'Sản phẩm đã hết trong chương trình giảm giá. Hãy đặt lại sản phẩm trong giỏ hàng.'],
                        200
                    );
                }
            } else {
                $product = Product::where('db_product.id', $_detail['id']);

                if (($product->first()->qty - $product->first()->qty_sold) < 0 || ($product->first()->qty - $product->first()->qty_sold) < $_detail["quantity"]) {
                    return response()->json(
                        ['success' => false, 'message' => 'Thanh toán không thành công, số lượng sản phẩm còn lại không đủ.'],
                        200
                    );
                }
            }
        }

        $order = DB::table('db_order')->insertGetId([
            "customer_id" => $request->customer_id,
            "coupon_id" => 0,
            "name" => $request->name,
            "phone" => $request->phone,
            "email" => $request->email,
            "address" => $request->address,
            "note" => $request->note,
            "shipping_methods" => $request->shipping_methods,
            "payment_methods" => $request->payment_methods,
            "status" => $request->status,
            "created_at" => date('Y-m-d H:i:s')
        ]);

        foreach ($request->order_detail as $_detail) {
            if ($_detail["sale_id"] !== 0) {
                $product_sale = DB::table('db_productsale')
                    ->where('db_productsale.status', 1)
                    ->where('db_productsale.start_time', '<=', $date_time)
                    ->where('db_productsale.end_time', '>=', $date_time)
                    ->where('db_productsale.product_id', '=', $_detail['id'])
                    ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold');

                $qty_product = Product::where('db_product.id', $_detail['id']);

                if ($product_sale->count() > 0) {
                    if (($product_sale->first()->qty - $product_sale->first()->qty_sold) < 0 || ($product_sale->first()->qty - $product_sale->first()->qty_sold) < $_detail["quantity"]) {
                        return response()->json(
                            ['success' => false, 'message' => 'Thanh toán không thành công, số lượng sản phẩm còn lại không đủ.'],
                            200
                        );
                    }

                    $product_sale->update([
                        "qty_sold" => $product_sale->first()->qty_sold + $_detail["quantity"]
                    ]);
                    $qty_product->update([
                        "qty_sold" => $qty_product->first()->qty_sold + $_detail["quantity"]
                    ]);
                }
            } else {
                $product = Product::where('db_product.id', $_detail['id']);

                if (($product->first()->qty - $product->first()->qty_sold) < 0 || ($product->first()->qty - $product->first()->qty_sold) < $_detail["quantity"]) {
                    return response()->json(
                        ['success' => false, 'message' => 'Thanh toán không thành công, số lượng sản phẩm còn lại không đủ.'],
                        200
                    );
                }

                $product->update([
                    "qty_sold" => $product->first()->qty_sold + $_detail["quantity"]
                ]);
            }


            $order_detail = DB::table('db_orderdetail')->insert([
                "order_id" => $order,
                "product_id" => $_detail["id"],
                "price" => $_detail["price"],
                "qty" => $_detail["quantity"]
            ]);
        }
        try {
            $newRequest = new Request([
                'to_email' => $request->email
            ]);
            $this->send_mail_order($newRequest);
            return response()->json([
                'success' => true,
                'message' => 'Đã đặt hàng thành công !',
                'data' => $order
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi đặt hàng: ' . $e->getMessage()
            ], 500);
        }
    }

    /*update*/
    public function update( $id, Request $request)
    {
        $order = Order::find($id);
        if ($request->status === 0) {
            $order_detail = Orderdetail::where('order_id', '=', $id)->get();
            foreach ($order_detail as $order_item) {
                $data_product = Product::where('id',$order_item->product_id);

                $product_sale = DB::table('db_productsale')->where('db_productsale.product_id', $order_item->product_id);
                if($product_sale->count() > 0){
                    $product_sale->update([
                        "qty_sold" => $product_sale->first()->qty_sold - $order_item->qty
                    ]);    
                }
                $data_product->update([
                    "qty_sold" => $data_product->first()->qty_sold - $order_item->qty
                ]);
            }
        }
        $order->status = $request->status;
        $order->save();
        if($order->payment_methods !== 'COD'){
            return response()->json(['success' => true, 'message' => 'Đã hủy đơn thành công.', 'payment' => 'onl'], 200);
        }
        return response()->json(['success' => true, 'message' => 'Cập nhật thành công', 'payment' => 'COD'], 200);
    }


    // cap nhat trang thai don hang
    public function updateStatus($id, $status)
    {
        $order = Order::find($id);
        if ($order == null) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy dữ liệu !', 'data' => null]);
        }
        $order->status = $status;
        $order->updated_at = date('Y-m-d H:i:s');
        $order->save();
        return response()->json(['success' => true, 'message' => 'Cập nhật trạng thái thành công !', 'data' => $order]);
    }


    // ds don hang bi huy
    public function getListCancel($page = 1)
    {
        $limit = 8;
        $countAll = Order::where('status', '=', 0)->count();
        $end_page = 1;
        if ($countAll > $limit) {
            $end_page = ceil($countAll / $limit);
        }
        $offset = ($page - 1) * $limit;

        $orders = Order::where('db_order.status', '=', 0)
            ->join("db_user", "db_user.id", '=', "db_order.user_id")
            ->select("db_order.*", "db_user.name as nametk")
            ->orderBy("db_order.created_at")->offset($offset)->limit($limit)
            ->get();
        $count_trash = Order::where('status', '=', 0)->count();
        return response()->json(['success' => true, 'message' => 'tai thanh cong', 'data' => $orders, 'qty_cancel' => $count_trash, 'end_page' => $end_page]);
    }

    // ds don hang ngdung da dat gan day
    public function getRecentOrders($customer_id, $limit, $page = 1)
    {
        $qty_order = DB::table('db_order as o')
            ->join('db_customers as c', 'c.id', '=', 'o.customer_id')
            ->where('o.customer_id', $customer_id)
            ->where('c.active', '=', 1)
            ->count();

        $qty_page = 1;
        if ($qty_order > $limit) {
            $qty_page = ceil($qty_order / $limit);
        }
        $offset = ($page - 1) * $limit;

        $orders = DB::table('db_order as o')
            ->join('db_customers as c', 'c.id', '=', 'o.customer_id')
            ->where('o.customer_id', $customer_id)
            ->where('c.active', '=', 1)
            ->select(
                'o.id as order_id',
                'o.name',
                'o.phone',
                'o.email',
                'o.address',
                'o.note',
                'o.status as order_status',
                'o.created_at as order_date',
                'o.payment_methods'
            )
            ->orderByDesc('o.created_at')
            ->offset($offset)->limit($limit)
            ->get();

        $data = [];
        foreach ($orders as $order) {
            $products = DB::table('db_orderdetail as od')
                ->join('db_product as p', 'p.id', '=', 'od.product_id')
                ->where('od.order_id', $order->order_id)
                ->select(
                    'p.id',
                    'p.name',
                    'p.image',
                    'od.price',
                    'od.qty',
                    'p.slug'
                )
                ->get();

            $total_order_amount = 0;
            foreach ($products as $product) {
                $total_order_amount += $product->price * $product->qty;
            }

            $data[] = (object)[
                'id' => $order->order_id,
                'name' => $order->name,
                'products' => $products,
                'status' => $order->order_status,
                'created_at' => $order->order_date,
                'phone' => $order->phone,
                'email' => $order->email,
                'address' => $order->address,
                'note' => $order->note,
                'total_order_amount' => $total_order_amount,
                'payment_method' => $order->payment_methods,
            ];
        }

        return response()->json([
            'success' => true, 'message' => 'tai thanh cong',
            'data' => $data,
            'qty_page' => $qty_page
        ], 200);
    }


    // so luong don hang + don hang gan day
    public function getQtyOrderAndOrder($customer_id)
    {
        $qty_are_delivery = DB::table('db_order as o')
            ->join('db_customers', 'db_customers.id', '=', 'o.customer_id')
            ->whereIn('o.status', [1, 2, 3])
            ->where('db_customers.id', $customer_id)
            ->count();

        $qty_delivered = DB::table('db_order as o')
            ->join('db_customers', 'db_customers.id', '=', 'o.customer_id')
            ->where('o.status', 4)
            ->where('db_customers.id', $customer_id)
            ->count();

        $qty_order = DB::table('db_order as o')
            ->join('db_customers as c', 'c.id', '=', 'o.customer_id')
            ->where('o.customer_id', $customer_id)
            ->where('c.active', '=', 1)
            ->count();

        return [
            'qty' => $qty_order,
            'qty_are_delivery' => $qty_are_delivery,
            'qty_delivered' => $qty_delivered
        ];
    }

    // mail xac nhan don hang
    protected function send_mail_order(Request $request)
    {
        if ($request->to_email) {
            $mailData = [
                'title' => 'Xác nhận đơn hàng',
                'email' => $request->to_email
            ];
            $mail_dt = FacadesMail::to($request->to_email)->send(new MailOrder($mailData));
            return response()->json(
                ['kiemtra' => true, 'message' => 'Đơn hàng đã xác thực qua gmail !', "mail_dt" => $mail_dt],
                200
            );
        } else {
            return response()->json(
                ['kiemtra' => false, 'message' => 'Không thành công !', "mail_dt" => null],
                200
            );
        }
    }

    // vnpay
    public function vnpay_payment(Request $request)
    {
        $amount = $request->amount;
        $code_order = $request->order_id;
        // $code_order = random_int(00, 9999);
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:3000/payment";
        $vnp_TmnCode = "AA5ZP9Z5"; //Mã website tại VNPAY
        $vnp_HashSecret = "I4N0FX57OAB5LGQHYUT4TG3G8I7JSQM5"; //Chuỗi bí mật

        // $vnp_TxnRef = $_POST['order_id']; //Mã đơn hàng. Trong thực tế Merchant cần insert đơn hàng vào DB và gửi mã này sang VNPAY
        $vnp_TxnRef = $code_order; //Mã đơn hàng. Trong thực tế Merchant cần insert đơn hàng vào DB và gửi mã này sang VNPAY
        // $vnp_OrderInfo = $_POST['order_desc'];
        $vnp_OrderInfo = 'Thanh toán đơn hàng';
        // $vnp_OrderType = $_POST['order_type'];
        $vnp_OrderType = 'billpayment';
        // $vnp_Amount = $_POST['amount'] * 100;
        $vnp_Amount = $amount * 100;
        $vnp_Locale = 'vn';
        $vnp_BankCode = 'NCB';
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
        //Add Params of 2.0.1 Version
        // $vnp_ExpireDate = $_POST['txtexpire'];
        //Billing
        // $vnp_Bill_Mobile = $_POST['txt_billing_mobile'];
        // $vnp_Bill_Email = $_POST['txt_billing_email'];
        // $fullName = trim($_POST['txt_billing_fullname']);
        // if (isset($fullName) && trim($fullName) != '') {
        //     $name = explode(' ', $fullName);
        //     $vnp_Bill_FirstName = array_shift($name);
        //     $vnp_Bill_LastName = array_pop($name);
        // }
        // $vnp_Bill_Address=$_POST['txt_inv_addr1'];
        // $vnp_Bill_City=$_POST['txt_bill_city'];
        // $vnp_Bill_Country=$_POST['txt_bill_country'];
        // $vnp_Bill_State=$_POST['txt_bill_state'];
        // // Invoice
        // $vnp_Inv_Phone=$_POST['txt_inv_mobile'];
        // $vnp_Inv_Email=$_POST['txt_inv_email'];
        // $vnp_Inv_Customer=$_POST['txt_inv_customer'];
        // $vnp_Inv_Address=$_POST['txt_inv_addr1'];
        // $vnp_Inv_Company=$_POST['txt_inv_company'];
        // $vnp_Inv_Taxcode=$_POST['txt_inv_taxcode'];
        // $vnp_Inv_Type=$_POST['cbo_inv_type'];
        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef
            // "vnp_ExpireDate"=>$vnp_ExpireDate
            // "vnp_Bill_Mobile"=>$vnp_Bill_Mobile,
            // "vnp_Bill_Email"=>$vnp_Bill_Email,
            // "vnp_Bill_FirstName"=>$vnp_Bill_FirstName,
            // "vnp_Bill_LastName"=>$vnp_Bill_LastName,
            // "vnp_Bill_Address"=>$vnp_Bill_Address,
            // "vnp_Bill_City"=>$vnp_Bill_City,
            // "vnp_Bill_Country"=>$vnp_Bill_Country,
            // "vnp_Inv_Phone"=>$vnp_Inv_Phone,
            // "vnp_Inv_Email"=>$vnp_Inv_Email,
            // "vnp_Inv_Customer"=>$vnp_Inv_Customer,
            // "vnp_Inv_Address"=>$vnp_Inv_Address,
            // "vnp_Inv_Company"=>$vnp_Inv_Company,
            // "vnp_Inv_Taxcode"=>$vnp_Inv_Taxcode,
            // "vnp_Inv_Type"=>$vnp_Inv_Type
        );

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }

        //var_dump($inputData);
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret); //
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }
        $returnData = array(
            'code' => '00', 'message' => 'success', 'data' => $vnp_Url
        );
        if (isset($_POST['redirect'])) {
            header('Location: ' . $vnp_Url);
            die();
        } else {
            echo json_encode($returnData);
        }
        // vui lòng tham khảo thêm tại code demo
    }

    // thong ke danh thu
    public function getRevenueData()
    {
        $revenueData = Order::select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(price * qty) as revenue'))
                            ->join('db_orderdetail', 'db_order.id', '=', 'db_orderdetail.order_id')
                            ->groupBy('date')
                            ->orderBy('date', 'asc')
                            ->get();

        return response()->json([
            'success' => true, 'message' => 'tai thanh cong',
            'data' => $revenueData
        ], 200);
    }
}
