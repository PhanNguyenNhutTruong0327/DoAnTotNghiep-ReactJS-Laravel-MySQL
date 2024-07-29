<?php

namespace App\Http\Controllers;
use App\Models\Product;
use App\Models\Orderdetail;
use App\Models\ProductSale;
use App\Models\Sells;
use App\Models\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str; 
use Carbon\Carbon;

class ProductSaleController extends Controller
{


    /*lay bang id -> chi tiet */
    public function show($id){

        $product = ProductSale::where("db_productsale.product_id",'=',$id)
        ->join("db_product","db_product.id",'=','db_productsale.product_id')
        ->join('db_category',"db_category.id",'=',"db_product.category_id")
        ->join('db_brand',"db_brand.id",'=',"db_product.brand_id")
        ->join('db_sells','db_sells.id','=','db_productsale.sale_id')
        ->selectRaw("db_productsale.*, (db_product.price - (db_product.price * db_sells.percent_sale / 100)) as price_sale, db_category.name as category_name,
        db_brand.name as brand_name, db_sells.title, db_sells.percent_sale, db_product.name as product_name, db_product.price , db_product.image")
        ->first();

        if ($product==null){
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'product' => null],404
            );
        }
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'product'=>$product],200);
    }
    

    /* them */
    public function store(Request $request){

            $pro = new ProductSale();
            $pro->product_id = $request->product_id;
            $pro->sale_id = $request->sale_id;
            $pro->qty = $request->qty;
            $pro->qty_sold = 0;
            $pro->start_time = $request->start_time;
            $pro->end_time = $request->end_time;
            $pro->created_at = date('Y-m-d H:i:s');
            $pro->created_by = 1;
            $pro->updated_by = 0;
            $pro->status = $request->status;
            $pro->save();
            return response()->json(['success' => true, 'message' => 'Thêm dữ liệu thành công !','data' => $pro],200); 
    }

    /*update*/
    public function update(Request $request,$id){

        $pro = ProductSale::find($id);

        $pro->sale_id = $request->sale_id;
        $pro->qty = $request->qty;
        $pro->qty_sold = 0;
        $pro->start_time = $request->start_time;
        $pro->end_time = $request->end_time;
        $pro->updated_at = date('Y-m-d H:i:s');
        $pro->updated_by = 1;
        $pro->status = $request->status;
        $pro->save();
        return response()->json(['success' => true, 'message' => 'Cập nhật thành công', 'data' => $pro],200);
    }

    /* xoa */
    public function destroy($id){
        $product = ProductSale::find($id);
        if ($product==null){
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'product' => null],404
            );
        }

        $product->delete();
        return response()->json(['success' => true, 'message' => 'Xóa thành công', 'product' => null],200);
    }





    // lay sp sale cho trang ng.dung
    public function getProductSaleFE($limit) {
        $date = Carbon::now();
        $dateTime = $date->format('Y-m-d H:i:s');
        $products = ProductSale::where('db_productsale.start_time', '<=', $dateTime)
            ->where('db_productsale.end_time', '>=', $dateTime)
            ->where('db_productsale.status', '=', 1)
            ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
            ->where('db_productsale.qty', '>', 0)
            ->where('db_productsale.qty_sold', '>=', 0) 
            ->join("db_product", "db_product.id", '=', 'db_productsale.product_id')
            ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
            ->selectRaw("db_product.name, db_product.price, db_product.image, db_product.slug, db_sells.percent_sale,
                db_productsale.qty as qty_sale, db_product.id, db_productsale.qty_sold,
                ROUND((db_product.price - (db_product.price * db_sells.percent_sale / 100)), 2) as price_sale")
            ->limit($limit)
            ->get();
        if (count($products) > 0) {
            return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'products' => $products], 200);
        } else {
            return response()->json(['success' => false, 'message' => "Tải dữ liệu không thành công", 'products' => []], 200);
        }
    }
    

    // sp sale trang admin co phan trang

    public function getProductSaleBE($limit, $page = 1) {
        $products = ProductSale::where("db_productsale.status", '!=', 0)
            ->join("db_product", "db_product.id", '=', 'db_productsale.product_id')
            ->join("db_sells", "db_sells.id", '=', 'db_productsale.sale_id')
            ->selectRaw("db_product.name, db_product.price, db_product.image, db_productsale.start_time,
            db_productsale.end_time, db_sells.title, db_productsale.qty as qty_sale, db_productsale.qty_sold, db_product.id,
            (db_product.price - (db_product.price * db_sells.percent_sale / 100)) as price_sale, db_productsale.id as id_sale")
            ->orderBy('db_productsale.created_at', 'DESC')
            ->limit($limit)
            ->offset(($page - 1) * $limit)
            ->get();
    
        $qty_trash = ProductSale::where('status', '=', 0)->count();
        $end_page = 1;
        $count_pro = ProductSale::where('status', '!=', 0)->count();
        if ($count_pro > $limit) {
            $end_page = ceil($count_pro / $limit);
        }
    
        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'products' => $products, 'qty_pro' => $count_pro, 'qty_trash' => $qty_trash, 'page'=>$end_page], 200);
    }

    // trash
    public function trash($id){
        $product = ProductSale::find($id);
        if($product == null){
            return response()->json(['success' => false, 'message' =>'Không tìm thấy sản phẩm !']);
        }

        $product->status = 0;
        $product->updated_at = date('Y-m-d H:i:s');
        $product->save();
        return response()->json(['success' => true, 'message' =>'Đã đưa sản phẩm vào thùng rác !']);
    }
    
    // phuc hoi trash
    public function recoverTrash($id){
        $product = ProductSale::find($id);
        if($product == null){
            return response()->json(['success' => false, 'message' =>'Không tìm thấy sản phẩm !']);
        }
        $product->status = 2;
        $product->updated_at = date('Y-m-d H:i:s');
        $product->save();
        return response()->json(['success' => true, 'message' =>'Đã phục hồi sản phẩm !']);
    }

    // get trash 
    public function getTrashProSale($limit, $page){

        $qty_trash = ProductSale::where('status', '=', 0)->count();

        $end_page = 1;
        if ($qty_trash > $limit) {
            $end_page = ceil($qty_trash / $limit);
        }

        $products = ProductSale::where("db_productsale.status", '=', 0)
            ->join("db_product", "db_product.id", '=', 'db_productsale.product_id')
            ->join("db_sells", "db_sells.id", '=', 'db_productsale.sale_id')
            ->selectRaw("db_product.name, db_product.price, db_product.image, db_productsale.start_time,
            db_productsale.end_time, db_sells.title, db_productsale.qty as qty_sale, db_productsale.qty_sold,db_product.id,
            (db_product.price - (db_product.price * db_sells.percent_sale / 100)) as price_sale")
            ->orderBy('db_productsale.created_at', 'DESC')
            ->limit($limit)
            ->offset(($page - 1) * $limit)
            ->get();
    
    
        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'products' => $products, 'qty_trash' => $qty_trash, 'page'=>$end_page], 200);
    }


    // lay ds sap chua sale
    public function getProductNotSale($limit, $page) {
        $list_pro_sale = ProductSale::pluck('product_id')->toArray();
        $qty_pro = Product::whereNotIn('id', $list_pro_sale)->where('status',1)->count();

        $offset = ($page - 1) * $limit;
        $products = Product::whereNotIn('id', $list_pro_sale)
            ->where('status',1)
            ->skip($offset)
            ->take($limit)
            ->get();
    
        $end_page = ceil($qty_pro / $limit);
    
        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'products' => $products, 'qty' => $qty_pro, 'page' => $end_page], 200);
    }


    public function showProSale($id){

        $product = ProductSale::where("db_productsale.id",'=',$id)
        ->join("db_product","db_product.id",'=','db_productsale.product_id')
        ->join('db_category',"db_category.id",'=',"db_product.category_id")
        ->join('db_brand',"db_brand.id",'=',"db_product.brand_id")
        ->join('db_sells','db_sells.id','=','db_productsale.sale_id')
        ->selectRaw("db_productsale.*, (db_product.price - (db_product.price * db_sells.percent_sale / 100)) as price_sale, db_category.name as category_name,
        db_brand.name as brand_name, db_sells.title, db_sells.percent_sale, db_product.name as product_name, db_product.price , db_product.image, db_product.qty as qty_pro, db_product.qty_sold as qty_pro_sold")
        ->first();

        if ($product==null){
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'product' => null],404
            );
        }
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'product'=>$product],200);
    }

   

}
