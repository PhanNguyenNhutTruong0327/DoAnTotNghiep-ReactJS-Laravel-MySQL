<?php

namespace App\Http\Controllers\Api;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductStore;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str; 


class ProductStoreController extends Controller
{
     /*lay danh sach thuong hieu*/
     public function index(){
        $products = Product::where('db_product.status','!=',0)
        ->join('db_category','db_category.id','=','db_product.category_id')
        ->join('db_brand','db_brand.id','=','db_product.brand_id')
        ->join('db_productstore','db_productstore.product_id','=','db_product.id')
        ->where('db_productstore.status', '!=', 0)
        ->select('db_productstore.id','db_product.slug','db_product.name','db_product.status','db_product.image',
        'db_category.name as namecat','db_brand.name as namebrand','db_productstore.qty as quantity','db_productstore.price as pricestore')
        ->orderBy('db_product.created_at')
        ->get();
        // $list_product = MyCart::getContent('list_products');
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'proStore'=>$products],200);
    }

    public function addImportPro(Request $request){
        $pro = new ProductStore();
        $pro->product_id = $request->id;
        $pro->price = $request->price;
        $pro->qty = $request->qty;
        $pro->created_at = date('Y-m-d H:i:s');
        $pro->created_by = 1;
        $pro->status = 1; 
        $pro->save(); 
        return response()->json(['success' => true, 'message' => 'Thêm thành công'],200); 

    }

    public function Trash($id){
        $pro = ProductStore::find($id);
        $pro->status = 0;
        $pro->updated_at = date('Y-m-d H:i:s');
        $pro->save();
        return response()->json(['success' => true, 'message' => 'Đã đưa vào thùng rác'],200); 

    }
        
    

}
