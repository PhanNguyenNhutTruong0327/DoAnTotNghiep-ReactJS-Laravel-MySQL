<?php

namespace App\Http\Controllers;

use App\Models\ProductReview;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProductReviewController extends Controller
{
    public function store(Request $request)
    {
        $images = [];
        $data = new ProductReview();
        $data->product_id = $request->product_id;
        $data->customer_id = $request->customer_id;
        $data->content = $request->content;
        $data->qty_star = $request->qty_star;
    
        $files = $request->file('image_1');
        if ($files) {
            $filename = $this->generateUniqueFileName($files);
            $images[] = $filename;
            $files->move(public_path('images/review'), $filename);
        }
    
        $files = $request->file('image_2');
        if ($files) {
            $filename = $this->generateUniqueFileName($files);
            $images[] = $filename;
            $files->move(public_path('images/review'), $filename);
        }
    
        $files = $request->file('image_3');
        if ($files) {
            $filename = $this->generateUniqueFileName($files);
            $images[] = $filename;
            $files->move(public_path('images/review'), $filename);
        }
    
        if (count($images) > 0) {
            $data->image_review = implode(';', $images);
        }
        $data->status = $request->status;
        $data->created_at = now();
        $data->save();
    
        return response()->json(['success' => true, 'message' => 'Thêm dữ liệu thành công', 'data' => $data], 200);
    }
    
    private function generateUniqueFileName($file)
    {
        $extension = $file->getClientOriginalExtension();
        $fileName = time() . '_' . uniqid() . '.' . $extension;
        return $fileName;
    }    

    // ds danh gia 
    public function getListReview($limit, $page = 1)
    {
        try {
            $qty = ProductReview::where('status','!=',0)->count();

            $end_page = 1;
            if ($qty > $limit) {
                $end_page = ceil($qty / $limit);
            }
            $offset = ($page - 1) * $limit;
    
            $reviews = ProductReview::with('product') 
                ->orderBy('created_at', 'desc') 
                ->offset($offset)->limit($limit)->get();
    
            return response()->json(['success' => true, 'data' => $reviews, 'qty_page'=>$end_page, 'qty_review'=>$qty], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Đã xảy ra lỗi khi lấy danh sách đánh giá']);
        }
    }
    // duyet danh gia + xoa vao thung rac
    public function changeStatus($id, Request $request)
    {
        try {
            $data = ProductReview::findOrFail($id);
            $data->update(['status' => $request->status]);
    
            return response()->json(['success' => true, 'message' => 'Cập nhật thành công'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy dữ liệu'], 200);
        }    
    }

    // xem chi tiet danh gia
    public function show($id)
    {
        try {
            $data = ProductReview::where('db_productreview.id', $id)
                ->leftJoin('db_products', 'db_products.id', '=', 'db_productreview.product_id')
                ->select('db_productreview.*', 'db_products.name', 'db_products.image as image_product')
                ->first();
    
            if (!$data) {
                return response()->json(['success' => false, 'message' => 'Không tìm thấy dữ liệu']);
            }
    
            return response()->json(['success' => true, 'message' => 'Tải dữ liệu thành công', 'data' => $data], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Đã xảy ra lỗi khi tải dữ liệu'], 500);
        }
    }
    
    // xoa vinh vien
    public function destroy($id)
    {
        try {
            $data = ProductReview::findOrFail($id);
            $data->delete();
    
            return response()->json(['success' => true, 'message' => 'Xóa thành công'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy dữ liệu hoặc đã xảy ra lỗi']);
        }
    }
        
}
