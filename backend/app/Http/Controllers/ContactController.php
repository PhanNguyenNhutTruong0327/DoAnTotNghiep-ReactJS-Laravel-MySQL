<?php

namespace App\Http\Controllers\Api;
use App\Models\Contact;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    // ds lien he trang admin
     public function getListContactBE($limit, $page =1){
        $agr = [
            ['status','!=',0],
            ['replay_id','=',0]
        ];
        $qty_contact = Contact::where($agr)->count();
        $qty_page = 1;
        if($qty_contact > $limit){
            $qty_page = ceil($qty_contact / $limit);
        }
        $contacts = Contact::where($agr)
            ->orderBy('created_at', 'DESC')
            ->offset($offset)
            ->limit($limit)
            ->get();

        $qty_trash = Contact::where('status','=',0)->count();
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'contacts'=>$contacts,'qty_contact'=>$qty_contact,'qty_trash'=>$qty_trash],200);
    }

    /*lay bang id -> chi tiet */
    public function show($id){
        $contact = Contact::where('db_contact.user_id',$id)
        ->join('db_customers','db_customers.id','=','db_contact.user_id')
        ->select('db_contact.*','db_customers.name as name_user')
        ->get();
        if ($contact==null){
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'contact' => null],404
            );
        }
        return response()->json(['success'=>true,'message'=>"Tải dữ liệu thành công",'contact'=>$contact],200);
    }

    /* them */
    public function store(Request $request){
        $contact = new Contact();
        $contact->user_id = $request->user_id;
        $contact->name = $request->name; 
        $contact->email = $request->email; 
        $contact->phone = $request->phone; 
        $contact->title = $request->title; 
        $contact->content = $request->content; 
        $contact->replay_id = $request->replay_id; 
        $contact->created_at = date('Y-m-d H:i:s');
        $contact->created_by = 1;
        $contact->status = $request->status; 
        $contact->save(); 
        return response()->json(['success' => true, 'message' => 'Thêm dữ liệu thành công', 'data' => $contact],200); 
    }



    /*update*/

    public function update(Request $request,$id){
        $contact = Contact::find($id);
        $contact->user_id = $contact->user_id;
        $contact->name = $request->name; 
        $contact->email = $request->email; 
        $contact->phone = $request->phone; 
        $contact->title = $request->title; 
        $contact->content = $request->content; 
        $contact->replay_id = $request->replay_id; 
        $contact->created_at = date('Y-m-d H:i:s');
        $contact->created_by = 1;
        $contact->status = $request->status; 
        $contact->save(); 
        return response()->json(['success' => true, 'message' => 'Cập nhật dữ liệu thành công', 'data' => $contact],200);
    }

    /* delete */

    public function destroy($id){
        $contact = Contact::find($id);
        if ($contact==null){
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'contact' => null],404
            );
        }

        $contact->delete();
        return response()->json(['success' => true, 'message' => 'Xóa dữ liệu thành công', 'contact' => null],200);
    }

    // trash
    public function trash($id){
        $contact = Contact::find($id);
        if($contact == null){
            return response()->json(['success' => false, 'message' =>'Không tìm thấy dữ liệu !']);
        }
        $contact->status = 0;
        $contact->updated_at = date('Y-m-d H:i:s');
        $contact->save();
        return response()->json(['success' => true, 'message' =>'Đã đưa vào thùng rác !']);
    }
    
    // phục hồi trash
    public function rescoverTrash($id){
        $contact = Contact::find($id);
        if($contact == null){
            return response()->json(['success' => false, 'message' =>'Không tìm thấy dữ liệu !']);
        }
        $contact->status = 2;
        $contact->updated_at = date('Y-m-d H:i:s');
        $contact->save();
        return response()->json(['success' => true, 'message' =>'Phục hồi dữ liệu thành công !']);
    }

    // get trash
    public function getListTrash(){
        $trash = Contact::where('status','=',0)->orderBy('updated_by', 'desc')->get();
        $count_trash = Contact::where('status','=',0)->count();
        return response()->json(['success' => true,'message' =>'tai thanh cong','trash'=>$trash,'count_trash'=>$count_trash]);
    }
}
