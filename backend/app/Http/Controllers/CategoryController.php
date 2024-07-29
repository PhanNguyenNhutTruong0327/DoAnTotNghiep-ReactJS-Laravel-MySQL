<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    /*lay danh sach thuong hieu admin*/
    public function getListCategoryBE()
    {
        $categories = Category::select('db_category.*', 'c.name as parent_name')
        ->leftJoin('db_category as c', 'db_category.parent_id', '=', 'c.id')
        ->where('db_category.status', '!=', 0)
        ->orderBy('db_category.created_at', 'desc')
        ->get();        
        $count_cat = count($categories);
        $count_trash = Category::where('status', '=', 0)->count();
        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'categories' => $categories, 'count_cat' => $count_cat, 'count_trash' => $count_trash], 200);
    }

    // ds danh muc frontend (menu 2 cap)
    public function getByParentId($parent_id)
    {
        $args = [
            ['parent_id', '=', $parent_id],
            ['status', '=', 1]
        ];
    
        $categoriesQuery = Category::where($args)
            ->select('id', 'name', 'slug', 'parent_id')
            ->orderBy('sort_order', 'ASC');
    
        if ($categoriesQuery->exists()) {
            $categories = $categoriesQuery->get();
            return response()->json([
                'success' => true,
                'message' => "Tải dữ liệu thành công",
                'data' => $categories
            ]);
        }
    
        return response()->json([
            'success' => false,
            'message' => "Không có dữ liệu",
            'data' => []
        ]);
    }
    

    // chi tiet
    public function show($id)
    {
        $category = Category::select('db_category.*', 'c.name as parent_name')
        ->leftJoin('db_category as c', 'db_category.parent_id', '=', 'c.id')
        ->where(function ($query) use ($id) {
            $query->where('db_category.id', $id)
                ->orWhere('db_category.slug', $id);
        })
        ->first();

        if ($category == null) {
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'category' => null],
                404
            );
        }
        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'category' => $category], 200);
    }

    // add
    public function store(Request $request)
    {
        $name_cat = Category::where('name', '=', $request->name)->count();
        if($name_cat > 0){
            return response()->json(['success' => false, 'message' => 'Tên danh mục đã tồn tại. Hãy thử tên khác.']);
        }
        $category = new Category();
        $category->name = $request->name;
        $category->slug = Str::of($request->name)->slug('-');
        $category->parent_id = $request->parent_id;
        $category->sort_order = $request->sort_order;
        $category->description = $request->description;
        $category->created_at = date('Y-m-d H:i:s');
        $category->created_by = 1;
        $category->status = $request->status;
        $category->save();
        return response()->json(['success' => true, 'message' => 'Thêm dữ liệu thành công', 'categorys' => $category], 201);
    }

    // update

    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        $category->name = $request->name;
        $category->slug = Str::of($request->name)->slug('-');
        $category->parent_id = $request->parent_id;
        $category->sort_order = $request->sort_order;
        $category->description = $request->description;
        $category->updated_at = date('Y-m-d H:i:s');
        $category->updated_by = 1;
        $category->status = $request->status;
        $category->save();
        return response()->json(['success' => true, 'message' => 'Cập nhật dữ liệu thành công', 'category' => $category], 200);
    }

    // xoa vinh vien  
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        if ($category == null) {
            return response()->json(['success' => false, 'message' => "Không tìm thấy dữ liệu"]);
        } else {
            $category->delete();
            return response()->json(['success' => true, 'message' => "Xóa dữ liệu thành công"]);
        }
    }

    // lay cat 
    // public function category_list($parent_id = 0,$limit){
    //     $args = [
    //         ['parent_id','=',$parent_id],
    //         ['status','=',1]
    //     ];
    //     $categories = Category::where($args)->orderBy('sort_order','ASC')->limit($limit)->get();
    //     return response()->json( ['success' => true,'message' => 'Tải dữ liệu thành công', 'categories' => $categories],200);
    // }


    // trash 
    public function trash($id)
    {
        $category = Category::find($id);
        if ($category == null) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy danh mục !']);
        }
        $count_product = Product::where('category_id', '=', $id)->count();
        if ($count_product > 0) {
            return response()->json(['success' => false, 'message' => 'Danh mục đã có sản phẩm không thể xóa !']);
        }
        $category->status = 0;
        $category->updated_at = date('Y-m-d H:i:s');
        $category->save();
        return response()->json(['success' => true, 'message' => 'Đã đưa vào thùng rác !']);
    }

    // phục hồi trash
    public function rescoverTrash($id)
    {
        $category = Category::find($id);
        if ($category == null) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy danh mục !']);
        }
        $category->status = 2;
        $category->updated_at = date('Y-m-d H:i:s');
        $category->save();
        return response()->json(['success' => true, 'message' => 'Phục hồi thành công !']);
    }

    // get trash
    public function getListTrash()
    {
        $trash = Category::where('status', '=', 0)->orderBy('updated_by', 'desc')->get();
        $count_trash = count($trash);
        return response()->json(['success' => true, 'message' => 'tai thanh cong', 'trash' => $trash, 'count_trash' => $count_trash]);
    }
}
