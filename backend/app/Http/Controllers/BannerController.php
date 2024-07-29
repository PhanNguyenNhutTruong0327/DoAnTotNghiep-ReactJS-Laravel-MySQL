<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class BannerController extends Controller
{
    /*lay danh sach trang admin*/
    public function getBannerBE()
    {
        $banners = Banner::where('status', '!=', 0)->orderBy('created_at', 'desc')->get();
        $count_banner = count($banners);
        $count_trash = Banner::where('status', '=', 0)->count();
        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'Banners' => $banners, 'count_banner' => $count_banner, 'count_trash' => $count_trash], 200);
    }

    // lay Banner trang ng.dung
    public function getBannerFE($position)
    {
        $agr = [
            ['position', '=', $position],
            ['status', '=', 1]
        ];
        $banners = Banner::where($agr)
            ->select('id', 'name', 'link', 'image')
            ->get();
        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'banners' => $banners], 200);
    }

    /*lay bang id -> chi tiet */
    public function show($id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'banner' => null],
                404
            );
        }
        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'banner' => $banner], 200);
    }

    /* them */
    public function store(Request $request)
    {
        $banner = new Banner();
        $banner->name = $request->name;
        $banner->link = $request->link;
        $banner->description = $request->description;
        $files = $request->image;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $banner->name . '.' . $extension;
                $banner->image = $filename;
                $files->move(public_path('images/Banner'), $filename);
            }
        }
        $banner->sort_order = $request->sort_order;
        $banner->position = $request->position;
        $banner->created_at = date('Y-m-d H:i:s');
        $banner->created_by = 1;
        $banner->status = $request->status;
        $banner->save();
        return response()->json(['success' => true, 'message' => 'Thêm dữ liệu thành công', 'data' => $banner], 200);
    }

    /*update*/
    public function update(Request $request, $id)
    {
        $banner = Banner::find($id);
        $banner->name = $request->name;
        $banner->link = $request->link;
        $banner->description = $request->description;
        $files = $request->image;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $banner->name . '.' . $extension;
                $banner->image = $filename;
                $files->move(public_path('images/Banner'), $filename);
            }
        }
        $banner->sort_order = $request->sort_order;
        $banner->position = $request->position;
        $banner->updated_at = date('Y-m-d H:i:s');
        $banner->updated_by = 1;
        $banner->status = $request->status;
        $banner->save();
        return response()->json(['success' => true, 'message' => 'Cập nhật dữ liệu thành công', 'banner' => $banner], 200);
    }

    // xoa vinh vien
    public function destroy($id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'banner' => null],
                404
            );
        }

        $banner->delete();
        return response()->json(['success' => true, 'message' => 'Xóa dữ liệu thành công', 'banner' => null], 200);
    }

    // trash
    public function trash($id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy dữ liệu !']);
        }
        $banner->status = 0;
        $banner->updated_at = date('Y-m-d H:i:s');
        $banner->save();
        return response()->json(['success' => true, 'message' => 'Đã đưa vào thùng rác !']);
    }

    // phục hồi trash
    public function rescoverTrash($id)
    {
        $banner = Banner::find($id);
        if ($banner == null) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy dữ liệu !']);
        }
        $banner->status = 2;
        $banner->updated_at = date('Y-m-d H:i:s');
        $banner->save();
        return response()->json(['success' => true, 'message' => 'Phục hồi thành công !']);
    }

    // get trash
    public function getListTrash()
    {
        $trash = Banner::where('status', '=', 0)->orderBy('updated_by', 'desc')->get();
        $count_trash = Banner::where('status', '=', 0)->count();
        return response()->json(['success' => true, 'message' => 'tai thanh cong', 'trash' => $trash, 'count_trash' => $count_trash]);
    }
}
