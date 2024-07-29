<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use App\Models\Post;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;


class TopicController extends Controller
{
    // ds chu de trang admin
    public function getTopicBE()
    {
        $topics = Topic::where('status', '!=', 0)->get();
        $count = count($topics);
        $count_trash = Topic::where('status', '=', 0)->count();
        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'topics' => $topics, 'count' => $count, 'count_trash' => $count_trash], 200);
    }


        // ds chu de status = 1
        public function getListTopic()
        {
            $topics = Topic::where('status', '=', 1)->select('id','name','slug')->get();
            return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'topics' => $topics], 200);
        }

    /*lay thuong hieu bang id -> chi tiet */
    public function show($id)
    {
        if (is_numeric($id)) {
            $topic = Topic::find($id);
        } else {
            $topic = Topic::where('slug', '=', $id)->first();
        }
        if ($topic == null) {
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'topic' => null],
                404
            );
        }
        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'topic' => $topic], 200);
    }

    // tao chu de
    public function store(Request $request)
    {
        $name_topic = Topic::where('name', '=', $request->name)->count();
        if($name_topic > 0){
            return response()->json(['success'=>false,'message'=>"Tên chủ đề đã tồn tại. Hãy thử tên khác !"],200);
        }

        $topic = new Topic();
        $topic->name = $request->name;
        $topic->slug = Str::of($request->name)->slug('-');
        $topic->parent_id = 0;
        $topic->sort_order = $request->sort_order;
        $topic->created_at = date('Y-m-d H:i:s');
        $topic->created_by = 1;
        $topic->status = $request->status;
        $topic->save();
        return response()->json(['success' => true, 'message' => 'Thêm dữ liệu thành công', 'data' => $topic], 200);
    }

    // cap nhat chu de

    public function update(Request $request, $id)
    {
        $topic = Topic::find($id);
        $topic->name = $request->name;
        $topic->slug = Str::of($request->name)->slug('-');
        $topic->parent_id = 0;
        $topic->sort_order = $request->sort_order;
        $topic->updated_at = date('Y-m-d H:i:s');
        $topic->updated_by = 1;
        $topic->status = $request->status;
        $topic->save();
        return response()->json(['success' => true, 'message' => 'Cập nhật dữ liệu thành công', 'topic' => $topic], 200);
    }

    // xoa vinh vien
    public function destroy($id)
    {
        $topic = Topic::find($id);
        if ($topic == null) {
            return response()->json(['success' => false, 'message' => 'Tải dữ liệu không thành công', 'topic' => null], 404);
        }

        $topic->delete();
        return response()->json(['success' => true, 'message' => 'Xóa thành công', 'topic' => null], 200);
    }

    // list topic
    public function getTopicByParent($parent_id)
    {
        $arg = [
            ['parent_id', '=', $parent_id],
            ['status', '=', 1]
        ];
        $topics = Topic::where($arg)->get();
        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'topics' => $topics], 200);
    }

    // trash
    public function trash($id)
    {
        $topic = Topic::find($id);
        if ($topic == null) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy thương hiệu !']);
        }
        $count_post = Post::where('topic_id', '=', $id)->count();
        if ($count_post > 0) {
            return response()->json(['success' => false, 'message' => 'Chủ đề đã có bài viết không thể xóa !']);
        }
        $topic->status = 0;
        $topic->updated_at = date('Y-m-d H:i:s');
        $topic->save();
        return response()->json(['success' => true, 'message' => 'Đã đưa vào thùng rác !']);
    }

    // phục hồi trash
    public function rescoverTrash($id)
    {
        $topic = Topic::find($id);
        if ($topic == null) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy thương hiệu !']);
        }
        $topic->status = 2;
        $topic->updated_at = date('Y-m-d H:i:s');
        $topic->save();
        return response()->json(['success' => true, 'message' => 'Phục hồi thành công !']);
    }

    // get trash
    public function getListTrash()
    {
        $trash = Topic::where('status', '=', 0)->orderBy('updated_by', 'desc')->get();
        $count_trash = Topic::where('status', '=', 0)->count();
        return response()->json(['success' => true, 'message' => 'tai thanh cong', 'trash' => $trash, 'count_trash' => $count_trash]);
    }
}
