<?php

namespace App\Http\Controllers;
use App\Models\Sells;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\ProductSale;
use Carbon\Carbon;

class SellsController extends Controller
{
    /*lay danh sach trang admin*/
    public function getListSale(){
        $sells = Sells::where('status','=',1)->orderBy('created_at','desc')->get();
        $qty_sells = count($sells);
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'sells'=>$sells,'qty_sells'=>$qty_sells],200);
    }


    // ds sale admin
    public function getListSaleBE(){
        $sells = Sells::where('status','!=',0)->orderBy('created_at','desc')->get();
        $qty_trash = Sells::where('status','=',0)->count();
        $qty_sells = count($sells);
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'sells'=>$sells,'qty_sells'=>$qty_sells, 'qty_trash'=>$qty_trash],200);
    }

    /*lay bang id -> chi tiet */
    public function show($id){
    $sale = Sells::find($id);
    if ($sale==null){
        return response()->json(
            ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'sale' => null],404
        );
    }
    return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'sale'=>$sale],200);
}


  /* them */
    public function create(Request $request){
        $name_sell = Sells::where('title', '=', $request->title)->count();
        if($name_sell > 0){
            return response()->json(['success'=>false,'message'=>"Chủ đề đã tồn tại. Hãy thử chủ đề khác"],200);       
        }
        $data = new Sells();
        $data->title = $request->title;
        $data->slug = Str::of($request->title)->slug('-');
        $data->percent_sale = $request->percent_sale;
        $data->created_at = date('Y-m-d H:i:s');
        $data->created_by = 1;
        $data->status = $request->status; 
        $data->save(); 
        return response()->json(['success' => true, 'message' => 'Thêm dữ liệu thành công', 'data' =>$data],200); 
        }

  /* cap nhat */
  public function update(Request $request, $id){
    $data = Sells::find($id);
    $data->title = $request->title;
    $data->slug = Str::of($request->title)->slug('-');
    $data->percent_sale = $request->percent_sale;
    $data->updated_at = date('Y-m-d H:i:s');
    $data->updated_by = 1;
    $data->status = $request->status; 
    $data->save(); 
    return response()->json(['success' => true, 'message' => 'Cập nhật dữ liệu thành công', 'data' =>$data],200); 
    }

    // trash
    public function trash($id){
        $data = Sells::find($id);
        if($data == null){
            return response()->json(['success' => false, 'message' =>'Không tìm thấy dữ liệu !']);
        }

        
        $qty_pro = ProductSale::where('sale_id',$id)->count();
        if($qty_pro > 0){
            return response()->json(['success' => false, 'message' =>'Chủ đề đang có sản phẩm giảm giá không thể xóa !']); 
        }
        $data->status = 0;
        $data->updated_at = date('Y-m-d H:i:s');
        $data->save();
        return response()->json(['success' => true, 'message' =>'Đã đưa vào thùng rác !', 'data'=>$data]);
    }
    
    // phục hồi trash
    public function rescoverTrash($id){
        $data = Sells::find($id);
        if($data == null){
            return response()->json(['success' => false, 'message' =>'Không tìm thấy dữ liệu !']);
        }
        $data->status = 2;
        $data->updated_at = date('Y-m-d H:i:s');
        $data->save();
        return response()->json(['success' => true, 'message' =>'Phục hồi thành công !','data'=>$data]);
    }

    // get trash
    public function getListTrash(){
        $trash = Sells::where('status','=',0)->orderBy('updated_by', 'desc')->get();
        $count_trash = count($trash);
        return response()->json(['success' => true,'message' =>'tai thanh cong','trash'=>$trash,'qty_trash'=>$count_trash]);
    }

    // xoa vinh vien
    public function destroy($id){
        $data = Sells::find($id);
        if ($data==null){
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'data' => null],404
            );
        }
    
        $data->delete();
        return response()->json(['success' => true, 'message' => 'Xóa dữ liệu thành công', 'data' => $data],200);
    }   

//     // lay slider trang ng.dung
//     public function getSliderFE($position){
//         $agr = [
//             ['position','=',$position],
//             ['status','=',1]
//         ];
//         $sliders = Slider::where($agr)->get();
//         return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'sliders'=>$sliders],200);
//     }


    

    
//     /*update*/
//     public function update(Request $request,$id){
//         $slider = Slider::find($id);
//         $slider->name = $request->name; 
//         $slider->link = $request->link; 
//         $slider->description = $request->description; 
//         $files = $request->image;
//         if ($files != null) {
//             $extension = $files->getClientOriginalExtension();
//             if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
//                 $filename = $slider->name . '.' . $extension;
//                 $slider->image = $filename;
//                 $files->move(public_path('images/slider'), $filename);
//             }
//         }
//         $slider->sort_order = $request->sort_order; 
//         $slider->position = $request->position; 
//         $slider->created_at = date('Y-m-d H:i:s');
//         $slider->created_by = 1;
//         $slider->status = $request->status; 
//         $slider->save();
//         return response()->json(['success' => true, 'message' => 'Cập nhật dữ liệu thành công', 'slider' =>$slider],200);
//     }
    





}
