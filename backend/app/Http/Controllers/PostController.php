<?php

namespace App\Http\Controllers;
use App\Models\Post;
use App\Models\Topic;
use Illuminate\Support\Str; 
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PostController extends Controller
{

    // ds bai viet, trang don trang admin
    public function getListPostBE($limit, $page = 1){

        $qty = Post::where([["db_post.status",'!=',0],["db_post.type",'=','news']])->count();

        $end_page = 1;
        if ($qty > $limit) {
            $end_page = ceil($qty / $limit);
        }        
        $offset = ($page - 1) * $limit;


        $posts = Post::where([["db_post.status",'!=',0],["db_post.type",'=','news']])
        ->join('db_topic',"db_topic.id",'=',"db_post.topic_id")
        ->select("db_post.*","db_topic.name as topicname")
        ->orderBy("db_post.created_at","desc")
        ->offset($offset)->limit($limit)
        ->get();
        $arg = [
            ['type','=','news'],
            ['status','=',0]
        ];
        $qty_trash = Post::where($arg)->count();
        return response()->json(['success' => true, 'message' => 'Tải dữ liệu thành công','posts' => $posts, 'qty_post'=>$qty, 'qty_trash'=>$qty_trash, 'page'=>$end_page],200);
    }


    // ds bai viet trang ng.dung
    public function getPostFE($limit,$page = 1){
        $agr = [
            ['status','=',1],
            ['type','=','news']
        ];
        $count_posts = Post::where($agr)->get();
        $end_page = 1;
        if (count($count_posts) > $limit) {
            $end_page = ceil(count($count_posts) / $limit);
        }        
        $offset = ($page - 1) * $limit;
        $posts = Post::where($agr)->orderBy('created_at','DESC')->offset($offset)->limit($limit)->get();
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'posts'=>   $posts,'end_page'=>$end_page],200);
    }  


    /*lay bang id -> chi tiet */
    public function show($id){
        if(is_numeric($id)){
            $post = Post::where("db_post.id",'=',$id)
            ->leftjoin('db_topic',"db_topic.id",'=',"db_post.topic_id")
            ->select("db_post.*","db_topic.name as topicname")
            ->first();
            }
        else{
            $post = Post::where('slug','=',$id)->first();
        }
            if ($post==null){
                return response()->json(
                    ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'post' => null],404
                );
            }
            return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'post'=>$post],200);
        }
            
    
        // tao bai viet, trang don
    public function store(Request $request){
        $post = new Post();
        $post->topic_id = $request->topic_id; 
        $post->title = $request->title; 
        $post->short_description = $request->short_description; 
        $post->slug = Str::of($request->title)->slug('-');
        $post->description_1 = $request->description_1; 
        $post->description_2 = $request->description_2; 
        $post->description_3 = $request->description_3; 

        $files = $request->image;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $post->slug . '-1.' . $extension;
                $post->image_1 = $filename;
                $files->move(public_path('images/post'), $filename);
            }
        }

        $files = $request->image_related_1;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $post->slug . '-2.' . $extension;
                $post->image_2 = $filename;
                $files->move(public_path('images/post'), $filename);
            }
        }

        $files = $request->image_related_2;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $post->slug . '-3.' . $extension;
                $post->image_3 = $filename;
                $files->move(public_path('images/post'), $filename);
            }
        }


        $post->type = $request->type; 
        $post->created_at = date('Y-m-d H:i:s');
        $post->created_by = 1;
        $post->status = $request->status; 
        $post->save(); 
        return response()->json(['success' => true, 'message' => 'Thêm dữ liệu thành công', 'data' =>  $post],200); 
    }
      
    
    // cap nhat bai viet, trang don
    public function update(Request $request,$id){

        $post = Post::find($id);
        $post->topic_id = $request->topic_id; 
        $post->title = $request->title; 
        $post->short_description = $request->short_description; 
        $post->slug = Str::of($request->title)->slug('-');
        $post->description_1 = $request->description_1; 
        $post->description_2 = $request->description_2; 
        $post->description_3 = $request->description_3; 

        $files = $request->image;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $post->slug . '-1.' . $extension;
                $post->image_1 = $filename;
                $files->move(public_path('images/post'), $filename);
            }
        }

        $files = $request->image_related_1;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $post->slug . '-2.' . $extension;
                $post->image_2 = $filename;
                $files->move(public_path('images/post'), $filename);
            }
        }

        $files = $request->image_related_2;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $post->slug . '-3.' . $extension;
                $post->image_3 = $filename;
                $files->move(public_path('images/post'), $filename);
            }
        }


        $post->type = $request->type; 
        $post->updated_at = date('Y-m-d H:i:s');
        $post->updated_by = 1;
        $post->status = $request->status; 
        $post->save(); 
        return response()->json(['success' => true, 'message' => 'Cập nhật dữ liệu thành công', 'post' => $post],200);
    }
            
    // xoa vinh vien
    public function destroy($id){
        $post = Post::find($id);
        if ($post==null){
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'post' => null],404
            );
        }
        $post->delete();
        return response()->json(['success' => true, 'message' => 'Xóa dữ liệu thành công', 'post' => null],200);
    }
    
    // trang don
    public function getPage(){
        $posts = Post::where('type','=','page')->get();
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'posts'=>   $posts],200);
    }

    // post detail + lien quan
    public function getDetailPostAndPostOther($slug, $limit){
        $post = Post::where(
            [
                ['db_post.slug','=',$slug],
                ['db_post.status','=',1],
                ['db_post.type','=','news']
            ])
        ->leftjoin('db_topic','db_topic.id','=','db_post.topic_id')
        ->select('db_topic.slug as slug_topic','db_post.*')
        ->first();
        if($post == null){
            return response()->json(['success' => false,'message' => 'Không tìm thấy dữ liệu','post' => null],404);
        }
        $listid = array();
        array_push($listid,$post->topic_id + 0);
        $args_top1=[
            ['parent_id','=',$post->topic_id + 0],
            ['status','=',1]
        ];
        $list_topic1=Topic::where($args_top1)->get();
        if(count($list_topic1)>0){
            foreach($list_topic1 as $row1){
                array_push($listid,$row1->id);
                $args_top2=[
                    ['parent_id', '=', $row1->id],
                    ['status', '=', 1]
                ];
                $list_topic2 = Topic::where($args_top2)->get();
                if (count($list_topic2) > 0) {
                    foreach ($list_topic2 as $row2) {
                        array_push($listid, $row2->id);
                    }
                }    
            }
        }
        $posts_other = Post::where(
            [
                ['id','!=',$post->id],
                ['status','=',1],
                ['type','=','news']
            ])
            ->whereIn('topic_id',$listid)
            ->limit($limit)
            ->get();

        return response()->json(['success' => true,'message' => 'Tải dữ liệu thành công','post' => $post,'post_other'=>$posts_other],200);
    }

    // post by topic
    public function getPostBySlugTopic($slug, $limit,$page = 1)
    {
        $topic = Topic::where('slug',$slug)->first();

        $listid = array();
        array_push($listid, $topic->id + 0);
        $args_top1 = [
            ['parent_id', '=', $topic->id + 0],
            ['status', '=', 1]
        ];
        $list_topic1 = Topic::where($args_top1)->get();
        if (count($list_topic1) > 0) {
            foreach ($list_topic1 as $row1){
                array_push($listid, $row1->id);
                $args_top2 = [
                    ['parent_id', '=', $row1->id],
                    ['status', '=', 1]
                ];
                $list_topic2 = Topic::where($args_top2)->get();
                if (count($list_topic2) > 0) {
                    foreach ($list_topic2 as $row2){
                        array_push($listid, $row2->id);
                    }
                }
            }
        }
        $qty_posts = Post::where(
            [
                ['status', '=',1],
                ['type','=','news']
            ])
            ->whereIn('topic_id', $listid)
            ->count();

        $qty_page = 1;
        if ($qty_posts > $limit) {
            $qty_page = ceil($qty_posts / $limit);
        }    
        $offset = ($page - 1) * $limit;
        $posts = Post::where(
            [
                ['status', '=',1],
                ['type','=','news']
            ]
        )->whereIn('topic_id', $listid)
        ->orderBy('created_at', 'DESC')
        ->offset($offset)->limit($limit)->get();
        return response()->json(['success' => true, 'message' => 'Tải dữ liệu thành công','posts' => $posts,'qty_page'=>$qty_page, 'topic'=>$topic],200);
    }

    // tin tuc moi nhat
    public function getPostNew($limit, $page){
        $agr = [
            ['type' ,'=','news'],
            ['status' ,'=',1]
        ];
        $posts = Post::where($agr)
        ->select('title','slug','short_description', 'image_1')
        ->orderBy('created_at','DESC')
        ->offset(($page - 1) * $limit)
        ->limit($limit)
        ->get();
        return response()->json(['success' => true, 'message' => 'Tải dữ liệu thành công','posts' => $posts],200);
    }

    // trash
    public function trash($id){
        $post = Post::find($id);
        if($post == null){
            return response()->json(['success' => false, 'message' =>'Không tìm thấy dữ liệu !']);
        }
        $post->status = 0;
        $post->updated_at = date('Y-m-d H:i:s');
        $post->save();
        return response()->json(['success' => true, 'message' =>'Đã đưa vào thùng rác !']);
    }
    
    // phục hồi trash
    public function rescoverTrash($id){
        $post = Post::find($id);
        if($post == null){
            return response()->json(['success' => false, 'message' =>'Không tìm thấy dữ liệu !']);
        }
        $post->status = 2;
        $post->updated_at = date('Y-m-d H:i:s');
        $post->save();
        return response()->json(['success' => true, 'message' =>'Phục hồi thành công !']);
    }

    // get trash
    public function getListTrash($type, $limit, $page = 1){
        $agr = [
            ['db_post.type','=',$type],
            ['db_post.status','=',0]
        ];
        $qty = Post::where($agr)->count();

        $end_page = 1;
        if ($qty > $limit) {
            $end_page = ceil($qty / $limit);
        }    
        $offset = ($page - 1) * $limit;

        $trash = Post::where($agr)
        ->join("db_topic","db_topic.id",'=',"db_post.topic_id")
        ->select("db_post.*","db_topic.name as topicname")
        ->orderBy('updated_by', 'desc')->offset($offset)->limit($limit)->get();

        return response()->json(['success' => true,'message' =>'tai thanh cong','trash'=>$trash,'qty_trash'=>$qty, 'page'=>$end_page]);
    }


    // get page 
    public function getListPageBE(){
        $agr = [
            ['status','!=',0],
            ['type','=','page']
        ];
        $page = Post::where($agr)->orderBy('created_at','desc')->get();
        $count_page = count($page);
        $agr1 = [
            ['status','=',0],
            ['type','=','page']
        ];
        $count_trash = Post::where($agr1)->count();
        return response()->json(['success' => true,'message' =>'tai thanh cong','page'=>$page,'count_trash'=>$count_trash,'count_page'=>$count_page]);
    }

    // get page by id 
    public function getPageById($id){
        $page = Post::where('id','=',$id)->first();
        return response()->json(['success' => true,'message' =>'tai thanh cong','page'=>$page]);
    }

    public function getTrashPageAll(){
        $agr = [
            ['type','=','page'],
            ['status','=',0]
        ];
        $trash = Post::where($agr)->orderBy('updated_by', 'desc')->get();
        $count_trash = count($trash);
        return response()->json(['success' => true,'message' =>'tai thanh cong','trash'=>$trash,'count_trash'=>$count_trash]);
    }

    // get page frontend
    public function getPageFE($slug){
        $agr = [
            ['status','=',1],
            ['type','=','page'],
            ['slug','=',$slug]
        ];
        $page = Post::where($agr)->first();
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'page'=>$page],200);

    }
}
