<?php

namespace App\Http\Controllers;
use App\Models\ProductCategory;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    //lay danh sach 
    public function getProductCategory(){
        $data = ProductCategory::All();
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'data'=>$data],200);
    }



}
