<?php

namespace App\Http\Controllers\Api;
use App\Models\Brand;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str; 


class RatingController extends Controller
{
     public function store(Request $request){
        $rating = new Rating();
        $rating -> user_id = $request-> user_id;
        $rating -> product_id = $request-> product_id;
        $rating -> number_rating = $request-> number_rating;
        $rating -> comment = $request-> comment;
        $rating ->save();
        return response()->json(['success' => true, 'message' => 'Thêm thành công', 'rating' => $rating],200); 
     }

     public function getRating($product_id,$user_id){
        // $product_id = $request->input('product_id');
        // $user_id = $request->input('user_id');
        $agr = [
            ['product_id','=',$product_id],
            ['user_id','=', $user_id],
        ];
        $rating = Rating::where($agr)->first();
        $number_stars = $rating ? $rating->number_rating : 0;
        return response()->json(['success' => true, 'message' => 'Lấy dữ liệu thành công', 'number_starts' => $number_stars],200); 
     }


}
