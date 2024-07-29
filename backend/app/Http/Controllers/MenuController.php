<?php

// namespace App\Http\Controllers\Api;
// use App\Models\Menu;
// use App\Models\Brand;
// use App\Models\Category;
// use App\Models\Topic;
// use App\Models\Post;
// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;

// class MenuController extends Controller
// {
//     public function index(){
//         $menus = Menu::where('status','!=',0)->orderBy('created_at','desc')->get();
//         $count_menu = count($menus);
//         $count_trash = Menu::where('status','=',0)->count();

//         $brands = Brand::where('status','!=',0)->orderBy('created_at','desc')->get();
//         $categories = Category::where('status','!=',0)->orderBy('created_at','desc')->get();
//         $topics = Topic::where('status','!=',0)->orderBy('created_at','desc')->get();
//         $agr =[
//             ['status','!=',0],
//             ['type','=','page']
//         ];
//         $pages = Post::where($agr)->orderBy('created_at','desc')->get();

//         return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'menus'=>$menus,'count_menu'=>$count_menu,'count_trash'=>$count_trash,
//             'brands'=>$brands,'categories'=>$categories,'topics'=>$topics,'pages'=>$pages],200);
//     }
    
//     /*lay bang id -> chi tiet */
//     public function show($id){
//         $menu = Menu::find($id);
//         if ($menu==null){
//             return response()->json(
//                 ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'menu' => null],404
//             );
//         }
//         return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'menu'=>$menu],200);
//     }
    
//     // add
//     public function store(Request $request){
//         $menu = new Menu();
//         $menu->name = $request->name; 
//         $menu->link = $request->link; 
//         $menu->position = $request->position;
//         $menu->level = $request->level; 
//         $menu->table_id = $request->table_id; 
//         $menu->type = $request->type; 
//         $menu->sort_order = $request->sort_order; 
//         $menu->parent_id = $request->parent_id; 
//         $menu->created_at = date('Y-m-d H:i:s');
//         $menu->created_by = 1;
//         $menu->status = $request->status; 
//         $menu->save();
//         return response()->json(['success' => true, 'message' => 'Thêm thành công', 'menu' => $menu],201); 
//     }
    
//     /*update*/

//     public function update(Request $request,$id){
//         $menu = Menu::find($id);
//         $menu->name = $request->name; 
//         $menu->link = $request->link; 
//         $menu->position = $request->position;
//         $menu->level = $request->level; 
//         $menu->table_id = $request->table_id; 
//         $menu->type = $request->type; 
//         $menu->sort_order = $request->sort_order; 
//         $menu->parent_id = $request->parent_id; 
//         $menu->updated_at = date('Y-m-d H:i:s');
//         $menu->created_by = 1;
//         $menu->status = $request->status; 
//         $menu->save(); 
//         return response()->json(['success' => true, 'message' => 'Cập nhật thành công', 'menu' => $menu],200);
//     }
    
//     //  delete
//     public function destroy($id){
//         $menu = Menu::find($id);
//         $menu->delete();
//         return response()->json(['success' => true, 'message' => 'Xóa thành công', 'menu' => null],200);
//     }

//     // get menu by parent_id
//     public function getByParentId($position, $parent_id = 0){
//         $args = [
//             ['position','=',$position],
//             ['parent_id','=',$parent_id],
//             ['status','=',1]
//         ];
//         $menus=Menu::where($args)->orderBy('sort_order','ASC')->get();
//         if(count($menus)>0){
//             return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'menus'=>$menus],200);
//         }
//         else{
//             return response()->json(['success'=>true,'message'=>"Không tải được dữ liệu",'menus'=> null],200);
//         }
//     }

//     // menu footer
//     public function getCS_Footer($type,$position){
//         $arg = [
//             ['type','=',$type],
//             ['position','=',$position],
//             ['status','=', 1]
//         ];
//         $CS = Menu::where($arg) -> get();
//         return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'cs'=>$CS],200);
//     }

//     // trash
//     public function trash($id){
//         $menu = Menu::find($id);
//         if($menu == null){
//             return response()->json(['success' => false, 'message' =>'Không tìm thấy dữ liệu !']);
//         }
//         $menu->status = 0;
//         $menu->updated_at = date('Y-m-d H:i:s');
//         $menu->save();
//         return response()->json(['success' => true, 'message' =>'Đã đưa thương hiệu vào thùng rác !']);
//     }
    
//     // phục hồi trash
//     public function RescoverTrash($id){
//         $menu = Menu::find($id);
//         if($menu == null){
//             return response()->json(['success' => false, 'message' =>'Không tìm thấy dữ liệu !']);
//         }
//         $menu->status = 2;
//         $menu->updated_at = date('Y-m-d H:i:s');
//         $menu->save();
//         return response()->json(['success' => true, 'message' =>'Phục hồi thành công !']);
//     }

//     // get trash
//     public function getTrashAll(){
//         $trash = Menu::where('status','=',0)->orderBy('updated_by', 'desc')->get();
//         $count_trash = Menu::where('status','=',0)->count();
//         return response()->json(['success' => true,'message' =>'tai thanh cong','trash'=>$trash,'count_trash'=>$count_trash]);
//     }

// }
