<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\ProductAttributes;
use App\Models\Description;
use App\Models\ProductSale;
use App\Models\ProductCategory;
use App\Models\Order;
use App\Models\Attributes;
use App\Models\ProductReview;
use App\Models\Orderdetail;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    // ds sp trang admin
    public function getListProBE($limit, $page = 1)
    {
        $qty = Product::where('status', '!=', 0)->count();
        $qty_trash = Product::where('status', '=', 0)->count();

        $end_page = 1;
        if ($qty > $limit) {
            $end_page = ceil($qty / $limit);
        }
        $offset = ($page - 1) * $limit;

        $products = Product::where('db_product.status', '!=', 0)
            ->join('db_category', "db_category.id", '=', "db_product.category_id")
            ->join('db_brand', "db_brand.id", '=', "db_product.brand_id")
            ->select("db_product.qty", "db_product.qty_sold","db_product.id", "db_product.name", "db_product.image", "db_product.slug", "db_product.status", "db_product.price", "db_category.name as categoryname", "db_brand.name as brandname")->orderBy("db_product.created_at", 'DESC')
            ->offset($offset)->limit($limit)->get();

        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'products' => $products, 'qty' => $qty, 'qty_trash' => $qty_trash, 'page' => $end_page], 200);
    }

    // chi tiet
    public function show($id)
    {
        $product = Product::where('db_product.id', '=', $id)
            ->join('db_category', "db_category.id", '=', "db_product.category_id")
            ->join('db_brand', "db_brand.id", '=', "db_product.brand_id")
            ->join('db_description', "db_description.product_id", '=', "db_product.id")
            ->select(
                "db_product.*",
                "db_category.name as categoryname",
                "db_brand.name as brandname",
                'db_description.chip',
                'db_description.screen',
                'db_description.rear_camera',
                'db_description.front_camera',
                'db_description.operating_system',
                'db_description.ram',
                'db_description.rom',
                'db_description.pin',
                'db_description.size',
                'db_description.connect'
            )->first();


        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'products' => $product], 200);
    }


    // them sp
    public function store(Request $request)
    {
        $name_pro = Product::where('name', '=', $request->name)->count();
        if($name_pro > 0)
        {
            return response()->json(['success' => false, 'message' => 'Tên sản phẩm đã tồn tại !. Hãy thử tên khác.'], 200);
        }
        $images = [];
        $product = new Product();
        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;
        $product->name = $request->name;
        $product->slug = Str::of($request->name)->slug('-');
        $product->price = $request->price;

        $files = $request->image;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $product->slug . '.' . $extension;
                // $product->image = $filename;
                $images[] = $filename;
                $files->move(public_path('images/product'), $filename);
            }
        }

        $files_detail = $request->image_detail;
        if ($files_detail != null) {
            $extension = $files_detail->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $product->slug . '-detail.' . $extension;
                $product->image_detail = $filename;
                $files_detail->move(public_path('images/product'), $filename);
            }
        }

        $files_1 = $request->image_related_1;
        if ($files_1 != null) {
            $extension = $files_1->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $product->slug . '-1.' . $extension;
                // $product->image_detail = $filename;
                $images[] = $filename;
                $files_1->move(public_path('images/product'), $filename);
            }
        }


        $files_2 = $request->image_related_2;
        if ($files_2 != null) {
            $extension = $files_2->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $product->slug . '-2.' . $extension;
                // $product->image_detail = $filename;
                $images[] = $filename;
                $files_2->move(public_path('images/product'), $filename);
            }
        }

        if (count($images) > 1) {
            $product->image = implode(';', $images);
        }
        else{
            $product->image = $images[0];
        }
        $product->qty = $request->qty;
        $product->description_1 = $request->description_1;
        $product->description_2 = $request->description_2;
        $product->created_at = date('Y-m-d H:i:s');
        $product->created_by = 1;
        $product->status = $request->status;
        $product->save();

        $pro_id = $product->id;

        $description = new Description();
        $description->product_id = $pro_id;
        $description->chip = $request->chip;
        $description->screen = $request->screen;
        $description->rear_camera = $request->rear_camera;
        $description->front_camera = $request->front_camera;
        $description->operating_system = $request->operating_system;
        $description->ram = $request->ram;
        $description->rom = $request->rom;
        $description->pin = $request->pin;
        $description->size = $request->size;
        $description->connect = $request->connect;
        $description->save();

        // $image_related = new Image();
        // $image_related->product_id = $pro_id;

        // $files = $request->image_related_1;
        // if ($files != null) {
        //     $extension = $files->getClientOriginalExtension();
        //     if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
        //         $filename = $product->slug . '-1.' . $extension;
        //         $image_related->image = $filename;
        //         $files->move(public_path('images/product'), $filename);
        //     }
        // }
        // $image_related->save();

        // $files = $request->image_related_2;
        // if($files != null){
        //     $image_related = new Image();
        //     $image_related->product_id = $pro_id;
        //     if ($files != null) {
        //         $extension = $files->getClientOriginalExtension();
        //         if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
        //             $filename = $product->slug . '-2.' . $extension;
        //             $image_related->image = $filename;
        //             $files->move(public_path('images/product'), $filename);
        //         }
        //     }
        //     $image_related->save();
        // }


        return response()->json(['success' => true, 'message' => 'Thêm dữ liệu thành công', 'data' => $product], 200);
    }


    // cap nhat sp
    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        $product->category_id = $request->category_id;
        $product->brand_id = $request->brand_id;
        $product->name = $request->name;
        $product->slug = Str::of($request->name)->slug('-');
        $product->price = $request->price;

        $images = explode(';', $product->image);

        $files = $request->image;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $product->slug . '.' . $extension;
                // $product->image = $filename;
                $images[0] = $filename;
                $files->move(public_path('images/product'), $filename);
            }
        }

        $files = $request->image_detail;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $product->slug . '-detail.' . $extension;
                $product->image_detail = $filename;
                $files->move(public_path('images/product'), $filename);
            }
        }

        $files = $request->image_related_1;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $product->slug . '-1.' . $extension;
                // $product->image_detail = $filename;
                $images[1] = $filename;
                $files->move(public_path('images/product'), $filename);
            }
        }


        $files = $request->image_related_2;
        if ($files != null) {
            $extension = $files->getClientOriginalExtension();
            if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
                $filename = $product->slug . '-2.' . $extension;
                // $product->image_detail = $filename;
                $images[2] = $filename;
                $files->move(public_path('images/product'), $filename);
            }
        }

        $product->image = implode(';', $images);


        $product->qty = $request->qty;
        $product->description_1 = $request->description_1;
        $product->description_2 = $request->description_2;
        $product->updated_at = date('Y-m-d H:i:s');
        $product->updated_by = 1;
        $product->status = $request->status;
        $product->save();

        $description = Description::where('product_id', $id)->first();
        $description->chip = $request->chip;
        $description->screen = $request->screen;
        $description->rear_camera = $request->rear_camera;
        $description->front_camera = $request->front_camera;
        $description->operating_system = $request->operating_system;
        $description->ram = $request->ram;
        $description->rom = $request->rom;
        $description->pin = $request->pin;
        $description->size = $request->size;
        $description->connect = $request->connect;
        $description->save();


        // $image_related = Image::where('product_id', $id)->get();

        // $files = $request->image_related_1;
        // if ($files != null) {
        //     $extension = $files->getClientOriginalExtension();
        //     if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
        //         $filename = $product->slug . '-1.' . $extension;
        //         $image_related[0]->image = $filename;
        //         $files->move(public_path('images/product'), $filename);
        //         $image_related[0]->save();
        //     }
        // }

        // $files = $request->image_related_2;
        // if ($files != null) {
        //     $extension = $files->getClientOriginalExtension();
        //     if (in_array($extension, ['jpg', 'png', 'gif', 'webp', 'jpeg'])) {
        //         $filename = $product->slug . '-2.' . $extension;
        //         $image_related[1]->image = $filename;
        //         $files->move(public_path('images/product'), $filename);
        //         $image_related[1]->save();
        //     }
        // }

        return response()->json(['success' => true, 'message' => 'Cập nhật thành công', 'data' => $product], 200);
    }

    // trash
    public function trash($id)
    {
        $product = Product::find($id);
        if ($product == null) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy sản phẩm !']);
        }
        // $qty_order = Order::where([['db_order.status', '!=', 0], ['db_order.status', '!=', 3]])
        //     ->join('db_orderdetail', 'db_orderdetail.order_id', '=', 'db_order.id')
        //     ->where('db_orderdetail.product_id', '=', $id)
        //     ->count();
        $qty_pro = Orderdetail::where('product_id', '=', $id)->count();
        if ($qty_pro > 0) {
            return response()->json(['success' => false, 'message' => 'Sản phẩm đã được bán không thể xóa !']);
        }

        $date = Carbon::now();
        $dateTime = $date->format('Y-m-d H:i:s');


        $agr = [
            ['db_productsale.start_time', '<=', $dateTime],
            ['db_productsale.end_time', '>=', $dateTime],
            ['db_productsale.status', '=', 1],
            ['db_productsale.product_id', '=', $id],
            ['db_productsale.qty', '>', 'db_productsale.qty_sold']
        ];

        $qty_sale = ProductSale::where($agr)->count();
        if ($qty_sale > 0) {
            return response()->json(['success' => false, 'message' => 'Sản phẩm đang trong chương trình giảm giá không thể xóa !']);
        }

        $product->status = 0;
        $product->updated_at = date('Y-m-d H:i:s');
        $product->save();
        return response()->json(['success' => true, 'message' => 'Đã đưa sản phẩm vào thùng rác !']);
    }

    // phuc hoi trash
    public function recoverTrash($id)
    {
        $product = Product::find($id);
        if ($product == null) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy sản phẩm !']);
        }
        $product->status = 2;
        $product->updated_at = date('Y-m-d H:i:s');
        $product->save();
        return response()->json(['success' => true, 'message' => 'Đã phục hồi sản phẩm !']);
    }

    // get trash
    public function getListTrash($limit, $page = 1)
    {
        $qty_trash = Product::where('status', '=', 0)->count();

        $end_page = 1;
        if ($qty_trash > $limit) {
            $end_page = ceil($qty_trash / $limit);
        }
        $offset = ($page - 1) * $limit;

        $products = Product::where('db_product.status', '=', 0)
            ->join('db_category', "db_category.id", '=', "db_product.category_id")
            ->join('db_brand', "db_brand.id", '=', "db_product.brand_id")
            ->select("db_product.id", "db_product.name", "db_product.image", "db_product.slug", "db_product.status", "db_product.price", "db_category.name as categoryname", "db_brand.name as brandname")->orderBy("db_product.updated_at", 'DESC')
            ->offset($offset)->limit($limit)->get();
        // $trash = Product::where('status','=',0)->orderBy('updated_by', 'desc')->get();
        return response()->json(['success' => true, 'message' => 'tai thanh cong', 'trash' => $products, 'qty_trash' => $qty_trash, 'end_page' => $end_page]);
    }



    // xoa vinh vien
    public function destroy($id)
    {
        $product = Product::find($id);
        if ($product == null) {
            return response()->json(
                ['success' => false, 'message' => 'Tải dữ liệu không thành công', 'product' => null],
                404
            );
        }

        $product->delete();
        return response()->json(['success' => true, 'message' => 'Xóa dữ liệu thành công', 'product' => null], 200);
    }


    // all sp fe
    public function getProductAll($limit, $page = 1, $filter = 0, Request $request)
    {

        $priceMin = $request->input('pricemin', null);
        if ($request->input('pricemax') === 'max') {
            $priceMax = PHP_INT_MAX;
        } else {
            $priceMax = $request->input('pricemax');
        }
        $brand = (int) $request->input('brand', null);

        $date = Carbon::now();
        $date_time = $date->format('Y-m-d H:i:s');


        if ($priceMin != null && $priceMax != null) {
            if ($filter == 0) // loc sp theo khoang gia, khong sap xep
            {
                $query = DB::table('db_productsale')
                    ->where('db_productsale.status', 1)
                    ->where('db_productsale.start_time', '<=', $date_time)
                    ->where('db_productsale.end_time', '>=', $date_time)
                    ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                    ->where('db_productsale.qty', '>', 0)
                    ->where('db_productsale.qty_sold', '>=', 0)
                    ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                    ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id');

                if ($brand != 0) {
                    $query->whereIn('db_product.brand_id', [$brand]);
                }

                $product_sale = $query->select(
                    'db_product.name',
                    'db_product.price',
                    'db_product.image',
                    'db_productsale.product_id as id',
                    'db_product.slug',
                    'db_product.brand_id',
                    DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price_sale')
                )
                    ->whereRaw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) BETWEEN ? AND ?', [$priceMin, $priceMax]);

                $product_ids = $product_sale->pluck('id')->toArray();

                $qty_products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids)
                    ->whereBetween('p.price', [$priceMin, $priceMax]);


                if ($brand != 0) {
                    $qty_products->whereIn('p.brand_id', [$brand]);
                }

                $qty_products = $qty_products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                    ->whereBetween('p.price', [$priceMin, $priceMax])
                    ->unionAll($product_sale)
                    ->count();

                $qty_page = 1;
                if ($qty_products > $limit) {
                    $qty_page = ceil($qty_products / $limit);
                }
                $offset = ($page - 1) * $limit;

                $products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids);

                if ($brand != 0) {
                    $products->whereIn('p.brand_id', [$brand]);
                }

                $products = $products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                    ->whereBetween('p.price', [$priceMin, $priceMax])
                    ->unionAll($product_sale)
                    ->offset($offset)->limit($limit)->get();
            } else {
                if ($filter == 1) // loc sp theo danh muc, sap xep giam dan theo gia
                {
                    $query = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id');

                    if ($brand != 0) {
                        $query->whereIn('db_product.brand_id', [$brand]);
                    }

                    $product_sale = $query->select(
                        'db_product.name',
                        'db_product.price',
                        'db_product.image',
                        'db_productsale.product_id as id',
                        'db_product.slug',
                        'db_product.brand_id',
                        DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price_sale')
                    )
                        ->whereRaw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) BETWEEN ? AND ?', [$priceMin, $priceMax]);

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->whereBetween('p.price', [$priceMin, $priceMax]);


                    if ($brand != 0) {
                        $qty_products->whereIn('p.brand_id', [$brand]);
                    }

                    $qty_products = $qty_products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids);

                    if ($brand != 0) {
                        $products->whereIn('p.brand_id', [$brand]);
                    }

                    $products = $products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) DESC, price_sale DESC")
                        ->offset($offset)->limit($limit)->get();
                } else // loc sp theo danh muc va khoang gia, sap xep tang dan theo gia
                {
                    $query = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id');

                    if ($brand != 0) {
                        $query->whereIn('db_product.brand_id', [$brand]);
                    }

                    $product_sale = $query->select(
                        'db_product.name',
                        'db_product.price',
                        'db_product.image',
                        'db_productsale.product_id as id',
                        'db_product.slug',
                        'db_product.brand_id',
                        DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price_sale')
                    )
                        ->whereRaw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) BETWEEN ? AND ?', [$priceMin, $priceMax]);

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->whereBetween('p.price', [$priceMin, $priceMax]);


                    if ($brand != 0) {
                        $qty_products->whereIn('p.brand_id', [$brand]);
                    }

                    $qty_products = $qty_products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids);

                    if ($brand != 0) {
                        $products->whereIn('p.brand_id', [$brand]);
                    }

                    $products = $products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) ASC, price_sale ASC")
                        ->offset($offset)->limit($limit)->get();
                }
            }
        } else {
            if ($filter == 0) // loc sp theo danh muc, k sap xep
            {
                $query = DB::table('db_productsale')
                    ->where('db_productsale.status', 1)
                    ->where('db_productsale.start_time', '<=', $date_time)
                    ->where('db_productsale.end_time', '>=', $date_time)
                    ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                    ->where('db_productsale.qty', '>', 0)
                    ->where('db_productsale.qty_sold', '>=', 0)
                    ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                    ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id');

                if ($brand != 0) {
                    $query->whereIn('db_product.brand_id', [$brand]);
                }

                $product_sale = $query->select(
                    'db_product.name',
                    'db_product.price',
                    'db_product.image',
                    'db_productsale.product_id as id',
                    'db_product.slug',
                    'db_product.brand_id',
                    DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
                );

                $product_ids = $product_sale->pluck('id')->toArray();

                $qty_products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids);

                if ($brand != 0) {
                    $qty_products->whereIn('p.brand_id', [$brand]);
                }

                $qty_products = $qty_products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                    ->unionAll($product_sale)
                    ->count();

                $qty_page = 1;
                if ($qty_products > $limit) {
                    $qty_page = ceil($qty_products / $limit);
                }
                $offset = ($page - 1) * $limit;

                $products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids);

                if ($brand != 0) {
                    $products->whereIn('p.brand_id', [$brand]);
                }

                $products = $products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                    ->unionAll($product_sale)
                    ->offset($offset)->limit($limit)->get();
            } else {
                if ($filter == 1) // loc sp theo danh muc, sap xep giam dan theo gia
                {
                    $query = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id');

                    if ($brand != 0) {
                        $query->whereIn('db_product.brand_id', [$brand]);
                    }

                    $product_sale = $query->select(
                        'db_product.name',
                        'db_product.price',
                        'db_product.image',
                        'db_productsale.product_id as id',
                        'db_product.slug',
                        'db_product.brand_id',
                        DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price_sale')
                    );

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids);

                    if ($brand != 0) {
                        $qty_products->whereIn('p.brand_id', [$brand]);
                    }

                    $qty_products = $qty_products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids);

                    if ($brand != 0) {
                        $products->whereIn('p.brand_id', [$brand]);
                    }

                    $products = $products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) DESC, price_sale DESC")
                        ->offset($offset)->limit($limit)->get();
                } else // loc sp theo danh muc, sap xep tang dan theo gia
                {
                    $query = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id');

                    if ($brand != 0) {
                        $query->whereIn('db_product.brand_id', [$brand]);
                    }

                    $product_sale = $query->select(
                        'db_product.name',
                        'db_product.price',
                        'db_product.image',
                        'db_productsale.product_id as id',
                        'db_product.slug',
                        'db_product.brand_id',
                        DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price_sale')
                    );

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids);

                    if ($brand != 0) {
                        $qty_products->whereIn('p.brand_id', [$brand]);
                    }

                    $qty_products = $qty_products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids);

                    if ($brand != 0) {
                        $products->whereIn('p.brand_id', [$brand]);
                    }

                    $products = $products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) ASC, price_sale ASC")
                        ->offset($offset)->limit($limit)->get();
                }
            }
        }
        return response()->json([
            'success' => true, 'message' => 'Tải dữ liệu thành công',
            'products' => $products,
            'qty_page' => $qty_page,
            'qty' => $qty_products,
            'brand' => $brand
        ], 200);
    }

    // sp moi
    public function getProductNew($limit)
    {
        $date = Carbon::now();
        $date_time = $date->format('Y-m-d H:i:s');

        $product_sale = DB::table('db_productsale')
            ->where('db_productsale.status', 1)
            ->where('db_productsale.start_time', '<=', $date_time)
            ->where('db_productsale.end_time', '>=', $date_time)
            ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
            ->where('db_productsale.qty', '>', 0)
            ->where('db_productsale.qty_sold', '>=', 0)
            ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
            ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
            ->select(
                'db_productsale.product_id as id',
                'db_product.price',
                'db_product.image',
                'db_product.slug',
                'db_product.name',
                'db_product.created_at',
                DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price_sale')
            );

        $product_ids = $product_sale->pluck('id')->toArray();

        $products = DB::table('db_product as p')
            ->where('p.status', 1)
            ->whereColumn('p.qty', '>', 'p.qty_sold')
            ->where('p.qty', '>', 0)
            ->where('p.qty_sold', '>=', 0)
            ->whereNotIn('p.id', $product_ids)
            ->select('p.id', 'p.price', 'p.image', 'p.slug', 'p.name', 'p.created_at', DB::raw('NULL as price_sale'))
            ->orderBy('p.created_at', 'DESC')
            ->unionAll($product_sale)
            ->orderBy('created_at', 'DESC') // Sắp xếp theo created_at
            ->limit($limit)
            ->get();

        return response()->json(['success' => true, 'message' => "Tải dữ liệu thành công", 'products' => $products], 200);
    }



    // chi tiet + sp lien quan
    public function getProductDetailAndProOther($slug)
    {
        $product = Product::where('db_product.slug', $slug)
            ->join('db_category', 'db_category.id', '=', 'db_product.category_id')
            ->join('db_brand', 'db_brand.id', '=', 'db_product.brand_id')
            ->join('db_productsale', 'db_productsale.product_id', '=', 'db_product.id')
            ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
            ->where('db_productsale.status','=',1)
            ->selectRaw('db_category.name as name_cat')
            ->selectRaw('db_category.slug as slug_cat')
            ->selectRaw('db_brand.name as name_brand')
            ->select(
                'db_product.id',
                'db_product.name',
                'db_product.slug',
                'db_product.price as price_initial',
                'db_product.image',
                'db_product.image_detail',
                'db_product.qty',
                'db_product.description_1',
                'db_product.description_2',
                'db_product.status',
                'db_product.category_id',
                'db_product.brand_id',
                'db_productsale.id as sale_id',
                'db_brand.name as brand_name',
            )
            ->selectRaw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100)) as price')
            ->first();

        if ($product === null) {
            $product = Product::where('db_product.slug', $slug)
                ->join('db_category', 'db_category.id', '=', 'db_product.category_id')
                ->join('db_brand', 'db_brand.id', '=', 'db_product.brand_id')
                ->where('db_product.status','=',1)
                ->selectRaw('db_category.name as name_cat')
                ->selectRaw('db_category.slug as slug_cat')
                ->selectRaw('db_brand.name as name_brand')
                ->select('db_product.*', 'db_brand.name as brand_name')
                ->first();
        }

        $product_attribute = Description::where('product_id', '=', $product->id)->first();

        $product_review = ProductReview::where([['db_productreview.product_id', '=', $product->id],['db_productreview.status','=',1]])
            ->leftjoin('db_customers', 'db_customers.id', '=', 'db_productreview.customer_id')
            ->where('db_customers.active', '=', 1)
            ->select('db_customers.name', 'db_productreview.content', 'db_productreview.qty_star', 'db_productreview.image_review')
            ->orderBy('db_productreview.created_at', 'desc')
            ->get();

        // $images = Image::where('product_id','=',$product->id)->get();

        $listid = array();
        array_push($listid, $product->category_id + 0);
        $args_cat1 = [
            ['parent_id', '=', $product->category_id + 0],
            ['status', '=', 1]
        ];
        $list_category1 = Category::where($args_cat1)->get();
        if (count($list_category1) > 0) {
            foreach ($list_category1 as $row1) {
                array_push($listid, $row1->id);
                $args_cat2 = [
                    ['parent_id', '=', $row1->id],
                    ['status', '=', 1]
                ];
                $list_category2 = Category::where($args_cat2)->get();
                if (count($list_category2) > 0) {
                    foreach ($list_category2 as $row2) {
                        array_push($listid, $row2->id);
                    }
                }
            }
        }

        $date = Carbon::now();
        $date_time = $date->format('Y-m-d H:i:s');

        $product_sale = DB::table('db_productsale')
            ->where('db_productsale.status', 1)
            ->where('db_productsale.start_time', '<=', $date_time)
            ->where('db_productsale.end_time', '>=', $date_time)
            ->whereIn('db_product.category_id', $listid)
            ->whereNotIn('db_productsale.product_id', [$product->id])
            ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
            ->where('db_productsale.qty', '>', 0)
            ->where('db_productsale.qty_sold', '>=', 0)
            ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
            ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
            ->select(
                'db_product.name',
                'db_product.price',
                'db_product.image',
                'db_productsale.product_id as id',
                'db_product.slug',
                DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
            );
        $product_ids = $product_sale->pluck('id')->toArray();

        $product_other = DB::table('db_product as p')
            ->where('p.status', 1)
            ->whereNotIn('p.id', $product_ids)
            ->whereNotIn('p.id', [$product->id])
            ->whereColumn('p.qty', '>', 'p.qty_sold')
            ->where('p.qty', '>', 0)
            ->where('p.qty_sold', '>=', 0)
            ->whereIn('p.category_id', $listid)
            ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
            ->unionAll($product_sale)
            ->get();

        // $product_other = Product::where([['id', '!=', $product->id], ['status', '=', 1]])->whereIn('category_id', $listid)->orderBy('created_at', 'DESC')->limit(10)->get();

        return response()->json([
            'success' => true, 'message' => 'Tải dữ liệu thành công',
            'product' => $product,
            'attributes' => $product_attribute,
            'product_other' => $product_other,
            'product_review' => $product_review,
        ], 200);
    }


    // lay sp theo loai phan trang
    public function getProductBySlugCategory($slug, $limit, $page = 1, $filter = 0, Request $request)
    {
        $category = Category::where(
            [
                ['slug', '=', $slug],
                ['status', '=', 1]
            ]
        )->first();

        if ($category == null) {
            return response()->json(['success' => true, 'message' => 'Không tìm thấy danh mục !', 'products' => null], 200);
        }

        $priceMin = $request->input('pricemin', null);
        if ($request->input('pricemax') === 'max') {
            $priceMax = PHP_INT_MAX;
        } else {
            $priceMax = $request->input('pricemax');
        }
        $brand = (int) $request->input('brand', null);



        $listid = array();
        array_push($listid, $category->id + 0); // luôn là một số nguyên.
        $args_cat1 = [
            ['parent_id', '=', $category->id + 0], // luôn là một số nguyên.
            ['status', '=', 1]
        ];
        $list_category1 = Category::where($args_cat1)->get();
        if (count($list_category1) > 0) {
            foreach ($list_category1 as $row1) {
                array_push($listid, $row1->id);
                $args_cat2 = [
                    ['parent_id', '=', $row1->id],
                    ['status', '=', 1]
                ];
                $list_category2 = Category::where($args_cat2)->get();
                if (count($list_category2) > 0) {
                    foreach ($list_category2 as $row2) {
                        array_push($listid, $row2->id);
                    }
                }
            }
        }

        $date = Carbon::now();
        $date_time = $date->format('Y-m-d H:i:s');


        if ($priceMin != null && $priceMax != null) {
            if ($filter == 0) // loc sp theo danh muc va khoang gia, khong sap xep
            {
                $query = DB::table('db_productsale')
                    ->where('db_productsale.status', 1)
                    ->where('db_productsale.start_time', '<=', $date_time)
                    ->where('db_productsale.end_time', '>=', $date_time)
                    ->whereIn('db_product.category_id', $listid)
                    ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                    ->where('db_productsale.qty', '>', 0)
                    ->where('db_productsale.qty_sold', '>=', 0)
                    ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                    ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id');

                if ($brand != 0) {
                    $query->whereIn('db_product.brand_id', [$brand]);
                }

                $product_sale = $query->select(
                    'db_product.name',
                    'db_product.price',
                    'db_product.image',
                    'db_productsale.product_id as id',
                    'db_product.slug',
                    'db_product.brand_id',
                    DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price_sale')
                )
                    ->whereRaw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) BETWEEN ? AND ?', [$priceMin, $priceMax]);

                $product_ids = $product_sale->pluck('id')->toArray();

                $qty_products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids)
                    ->whereIn('p.category_id', $listid)
                    ->whereBetween('p.price', [$priceMin, $priceMax]);


                if ($brand != 0) {
                    $qty_products->whereIn('p.brand_id', [$brand]);
                }

                $qty_products = $qty_products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                    ->whereBetween('p.price', [$priceMin, $priceMax])
                    ->unionAll($product_sale)
                    ->count();

                $qty_page = 1;
                if ($qty_products > $limit) {
                    $qty_page = ceil($qty_products / $limit);
                }
                $offset = ($page - 1) * $limit;

                $products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids)
                    ->whereIn('p.category_id', $listid);

                if ($brand != 0) {
                    $products->whereIn('p.brand_id', [$brand]);
                }

                $products = $products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                    ->whereBetween('p.price', [$priceMin, $priceMax])
                    ->unionAll($product_sale)
                    ->offset($offset)->limit($limit)->get();
            } else {
                if ($filter == 1) // loc sp theo danh muc, sap xep giam dan theo gia
                {
                    $query = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereIn('db_product.category_id', $listid)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id');

                    if ($brand != 0) {
                        $query->whereIn('db_product.brand_id', [$brand]);
                    }

                    $product_sale = $query->select(
                        'db_product.name',
                        'db_product.price',
                        'db_product.image',
                        'db_productsale.product_id as id',
                        'db_product.slug',
                        'db_product.brand_id',
                        DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price_sale')
                    )
                        ->whereRaw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) BETWEEN ? AND ?', [$priceMin, $priceMax]);

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->whereIn('p.category_id', $listid)
                        ->whereBetween('p.price', [$priceMin, $priceMax]);


                    if ($brand != 0) {
                        $qty_products->whereIn('p.brand_id', [$brand]);
                    }

                    $qty_products = $qty_products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->whereIn('p.category_id', $listid);

                    if ($brand != 0) {
                        $products->whereIn('p.brand_id', [$brand]);
                    }

                    $products = $products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) DESC, price_sale DESC")
                        ->offset($offset)->limit($limit)->get();
                } else // loc sp theo danh muc va khoang gia, sap xep tang dan theo gia
                {
                    $query = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereIn('db_product.category_id', $listid)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id');

                    if ($brand != 0) {
                        $query->whereIn('db_product.brand_id', [$brand]);
                    }

                    $product_sale = $query->select(
                        'db_product.name',
                        'db_product.price',
                        'db_product.image',
                        'db_productsale.product_id as id',
                        'db_product.slug',
                        'db_product.brand_id',
                        DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price_sale')
                    )
                        ->whereRaw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) BETWEEN ? AND ?', [$priceMin, $priceMax]);

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->whereIn('p.category_id', $listid)
                        ->whereBetween('p.price', [$priceMin, $priceMax]);


                    if ($brand != 0) {
                        $qty_products->whereIn('p.brand_id', [$brand]);
                    }

                    $qty_products = $qty_products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->whereIn('p.category_id', $listid);

                    if ($brand != 0) {
                        $products->whereIn('p.brand_id', [$brand]);
                    }

                    $products = $products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) ASC, price_sale ASC")
                        ->offset($offset)->limit($limit)->get();
                }
            }
        } else {
            if ($filter == 0) // loc sp theo danh muc, k sap xep
            {
                $query = DB::table('db_productsale')
                    ->where('db_productsale.status', 1)
                    ->where('db_productsale.start_time', '<=', $date_time)
                    ->where('db_productsale.end_time', '>=', $date_time)
                    ->whereIn('db_product.category_id', $listid)
                    ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                    ->where('db_productsale.qty', '>', 0)
                    ->where('db_productsale.qty_sold', '>=', 0)
                    ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                    ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id');

                if ($brand != 0) {
                    $query->whereIn('db_product.brand_id', [$brand]);
                }

                $product_sale = $query->select(
                    'db_product.name',
                    'db_product.price',
                    'db_product.image',
                    'db_productsale.product_id as id',
                    'db_product.slug',
                    'db_product.brand_id',
                    DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
                );

                $product_ids = $product_sale->pluck('id')->toArray();

                $qty_products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids)
                    ->whereIn('p.category_id', $listid);

                if ($brand != 0) {
                    $qty_products->whereIn('p.brand_id', [$brand]);
                }

                $qty_products = $qty_products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                    ->unionAll($product_sale)
                    ->count();

                $qty_page = 1;
                if ($qty_products > $limit) {
                    $qty_page = ceil($qty_products / $limit);
                }
                $offset = ($page - 1) * $limit;

                $products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids)
                    ->whereIn('p.category_id', $listid);

                if ($brand != 0) {
                    $products->whereIn('p.brand_id', [$brand]);
                }

                $products = $products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                    ->unionAll($product_sale)
                    ->offset($offset)->limit($limit)->get();
            } else {
                if ($filter == 1) // loc sp theo danh muc, sap xep giam dan theo gia
                {
                    $query = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereIn('db_product.category_id', $listid)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id');

                    if ($brand != 0) {
                        $query->whereIn('db_product.brand_id', [$brand]);
                    }

                    $product_sale = $query->select(
                        'db_product.name',
                        'db_product.price',
                        'db_product.image',
                        'db_productsale.product_id as id',
                        'db_product.slug',
                        'db_product.brand_id',
                        DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price_sale')
                    );

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->whereIn('p.category_id', $listid);

                    if ($brand != 0) {
                        $qty_products->whereIn('p.brand_id', [$brand]);
                    }

                    $qty_products = $qty_products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->whereIn('p.category_id', $listid);

                    if ($brand != 0) {
                        $products->whereIn('p.brand_id', [$brand]);
                    }

                    $products = $products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) DESC, price_sale DESC")
                        ->offset($offset)->limit($limit)->get();
                } else // loc sp theo danh muc, sap xep tang dan theo gia
                {
                    $query = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereIn('db_product.category_id', $listid)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id');

                    if ($brand != 0) {
                        $query->whereIn('db_product.brand_id', [$brand]);
                    }

                    $product_sale = $query->select(
                        'db_product.name',
                        'db_product.price',
                        'db_product.image',
                        'db_productsale.product_id as id',
                        'db_product.slug',
                        'db_product.brand_id',
                        DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price_sale')
                    );

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->whereIn('p.category_id', $listid);

                    if ($brand != 0) {
                        $qty_products->whereIn('p.brand_id', [$brand]);
                    }

                    $qty_products = $qty_products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->whereIn('p.category_id', $listid);

                    if ($brand != 0) {
                        $products->whereIn('p.brand_id', [$brand]);
                    }

                    $products = $products->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', 'p.brand_id', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) ASC, price_sale ASC")
                        ->offset($offset)->limit($limit)->get();
                }
            }
        }
        return response()->json([
            'success' => true, 'message' => 'Tải dữ liệu thành công',
            'products' => $products,
            'qty_page' => $qty_page,
            'qty' => $qty_products,
            'brand' => $brand
        ], 200);
    }

    // sp theo thuong hieu
    public function getProductBySlugBrand($slug, $limit, $page = 1, $filter = 0, Request $request)
    {
        // $priceMin = $request->input('pricemin', 0);
        // $priceMax = $request->input('pricemax', PHP_INT_MAX);
        $priceMin = $request->input('pricemin', null);
        if ($request->input('pricemax') === 'max') {
            $priceMax = PHP_INT_MAX;
        } else {
            $priceMax = $request->input('pricemax');
        }

        $brand = Brand::where([['slug', '=', $slug]])->first();
        if ($brand === null) {
            return response()->json(['success' => true, 'message' => 'Không tìm thấy thương hiệu !', 'products' => null], 200);
        }

        $date = Carbon::now();
        $date_time = $date->format('Y-m-d H:i:s');

        $a = 1;
        if ($priceMin != null && $priceMax != null) {
            if ($filter == 0) //loc sp theo khoang gia, k sap xep
            {
                $a = 2;
                $product_sale = DB::table('db_productsale')
                    ->where('db_productsale.status', 1)
                    ->where('db_productsale.start_time', '<=', $date_time)
                    ->where('db_productsale.end_time', '>=', $date_time)
                    ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                    ->where('db_productsale.qty', '>', 0)
                    ->where('db_productsale.qty_sold', '>=', 0)
                    ->where('db_product.brand_id', '=', $brand->id)
                    ->whereRaw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) BETWEEN ? AND ?', [$priceMin, $priceMax])
                    ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                    ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
                    ->select(
                        'db_product.name',
                        'db_product.price',
                        'db_product.image',
                        'db_productsale.product_id as id',
                        'db_product.slug',
                        DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
                    );

                $product_ids = $product_sale->pluck('id')->toArray();

                $qty_products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids)
                    ->where('p.brand_id', '=', $brand->id)
                    ->whereBetween('p.price', [$priceMin, $priceMax])
                    ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                    ->unionAll($product_sale)
                    ->count();

                $qty_page = 1;
                if ($qty_products > $limit) {
                    $qty_page = ceil($qty_products / $limit);
                }
                $offset = ($page - 1) * $limit;

                $products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids)
                    ->where('p.brand_id', '=', $brand->id)
                    ->whereBetween('p.price', [$priceMin, $priceMax])
                    ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                    ->unionAll($product_sale)
                    ->offset($offset)->limit($limit)->get();
            } else {
                if ($filter == 1) // loc sp theo khoang gia, sap xep giam dan
                {
                    $product_sale = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->where('db_product.brand_id', '=', $brand->id)
                        ->whereRaw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) BETWEEN ? AND ?', [$priceMin, $priceMax])
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
                        ->select(
                            'db_product.name',
                            'db_product.price',
                            'db_product.image',
                            'db_productsale.product_id as id',
                            'db_product.slug',
                            DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
                        );

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->where('p.brand_id', '=', $brand->id)
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->where('p.brand_id', '=', $brand->id)
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) DESC, price_sale DESC")
                        ->offset($offset)->limit($limit)->get();
                } else {
                    $product_sale = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->where('db_product.brand_id', '=', $brand->id)
                        ->whereRaw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) BETWEEN ? AND ?', [$priceMin, $priceMax])
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
                        ->select(
                            'db_product.name',
                            'db_product.price',
                            'db_product.image',
                            'db_productsale.product_id as id',
                            'db_product.slug',
                            DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
                        );

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->where('p.brand_id', '=', $brand->id)
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->where('p.brand_id', '=', $brand->id)
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) ASC, price_sale ASC")
                        ->offset($offset)->limit($limit)->get();
                }
            }
        } else {
            if ($filter == 0) // k sap xep
            {
                $product_sale = DB::table('db_productsale')
                    ->where('db_productsale.status', 1)
                    ->where('db_productsale.start_time', '<=', $date_time)
                    ->where('db_productsale.end_time', '>=', $date_time)
                    ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                    ->where('db_productsale.qty', '>', 0)
                    ->where('db_productsale.qty_sold', '>=', 0)
                    ->where('db_product.brand_id', '=', $brand->id)
                    ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                    ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
                    ->select(
                        'db_product.name',
                        'db_product.price',
                        'db_product.image',
                        'db_productsale.product_id as id',
                        'db_product.slug',
                        DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
                    );

                $product_ids = $product_sale->pluck('id')->toArray();

                $qty_products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids)
                    ->where('p.brand_id', '=', $brand->id)
                    ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                    ->unionAll($product_sale)
                    ->count();

                $qty_page = 1;
                if ($qty_products > $limit) {
                    $qty_page = ceil($qty_products / $limit);
                }
                $offset = ($page - 1) * $limit;

                $products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids)
                    ->where('p.brand_id', '=', $brand->id)
                    ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                    ->unionAll($product_sale)
                    ->offset($offset)->limit($limit)->get();
            } else {
                if ($filter == 1) {
                    $product_sale = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->where('db_product.brand_id', '=', $brand->id)
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
                        ->select(
                            'db_product.name',
                            'db_product.price',
                            'db_product.image',
                            'db_productsale.product_id as id',
                            'db_product.slug',
                            DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
                        );

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->where('p.brand_id', '=', $brand->id)
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->where('p.brand_id', '=', $brand->id)
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) DESC, price_sale DESC")
                        ->offset($offset)->limit($limit)->get();
                } else {
                    $product_sale = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->where('db_product.brand_id', '=', $brand->id)
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
                        ->select(
                            'db_product.name',
                            'db_product.price',
                            'db_product.image',
                            'db_productsale.product_id as id',
                            'db_product.slug',
                            DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
                        );

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->where('p.brand_id', '=', $brand->id)
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->whereNotIn('p.id', $product_ids)
                        ->where('p.brand_id', '=', $brand->id)
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) ASC, price_sale ASC")
                        ->offset($offset)->limit($limit)->get();
                }
            }
        }
        return response()->json(['success' => true, 'message' => 'Tải dữ liệu thành công', 'products' => $products, 'qty_page' => $qty_page, 'qty' => $qty_products], 200);
    }


    // tim kiem sp
    public function getSearchProduct($keyword, $limit, $page = 1, $filter = 0, Request $request)
    {
        $priceMin = $request->input('pricemin', null);
        if ($request->input('pricemax') === 'max') {
            $priceMax = PHP_INT_MAX;
        } else {
            $priceMax = $request->input('pricemax');
        }

        $products = Product::where('name', 'like', '%' . $keyword . '%')->where('status', '=', 1)->get();
        if ($products === null) {
            return response()->json(['success' => true, 'message' => 'Không tìm thấy !', 'products' => null], 200);
        }
        $brand = (int) $request->input('brand', null);

        $date = Carbon::now();
        $date_time = $date->format('Y-m-d H:i:s');

        if ($priceMin != null && $priceMax != null) {
            if ($filter == 0) //loc sp theo khoang gia, k sap xep
            {
                $product_sale = DB::table('db_productsale')
                    ->where('db_productsale.status', 1)
                    ->where('db_productsale.start_time', '<=', $date_time)
                    ->where('db_productsale.end_time', '>=', $date_time)
                    ->where('db_product.name', 'like', '%' . $keyword . '%')
                    ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                    ->where('db_productsale.qty', '>', 0)
                    ->where('db_productsale.qty_sold', '>=', 0)
                    ->whereRaw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) BETWEEN ? AND ?', [$priceMin, $priceMax])
                    ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                    ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
                    ->select(
                        'db_product.name',
                        'db_product.price',
                        'db_product.image',
                        'db_productsale.product_id as id',
                        'db_product.slug',
                        DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
                    );

                $product_ids = $product_sale->pluck('id')->toArray();

                $qty_products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereNotIn('p.id', $product_ids)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereBetween('p.price', [$priceMin, $priceMax])
                    ->where('p.name', 'like', '%' . $keyword . '%')
                    ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                    ->unionAll($product_sale)
                    ->count();

                $qty_page = 1;
                if ($qty_products > $limit) {
                    $qty_page = ceil($qty_products / $limit);
                }
                $offset = ($page - 1) * $limit;

                $products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids)
                    ->whereBetween('p.price', [$priceMin, $priceMax])
                    ->where('p.name', 'like', '%' . $keyword . '%')
                    ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                    ->unionAll($product_sale)
                    ->offset($offset)->limit($limit)->get();
            } else {
                if ($filter == 1) // loc sp theo khoang gia, sap xep giam dan
                {
                    $product_sale = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->where('db_product.name', 'like', '%' . $keyword . '%')
                        ->whereRaw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) BETWEEN ? AND ?', [$priceMin, $priceMax])
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
                        ->select(
                            'db_product.name',
                            'db_product.price',
                            'db_product.image',
                            'db_productsale.product_id as id',
                            'db_product.slug',
                            DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
                        );

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereNotIn('p.id', $product_ids)
                        ->where('p.name', 'like', '%' . $keyword . '%')
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->where('p.name', 'like', '%' . $keyword . '%')
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) DESC, price_sale DESC")
                        ->offset($offset)->limit($limit)->get();
                } else {
                    $product_sale = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->where('db_product.name', 'like', '%' . $keyword . '%')
                        ->whereRaw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) BETWEEN ? AND ?', [$priceMin, $priceMax])
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
                        ->select(
                            'db_product.name',
                            'db_product.price',
                            'db_product.image',
                            'db_productsale.product_id as id',
                            'db_product.slug',
                            DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
                        );

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereNotIn('p.id', $product_ids)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->where('p.name', 'like', '%' . $keyword . '%')
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereNotIn('p.id', $product_ids)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->where('p.name', 'like', '%' . $keyword . '%')
                        ->whereBetween('p.price', [$priceMin, $priceMax])
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) ASC, price_sale ASC")
                        ->offset($offset)->limit($limit)->get();
                }
            }
        } else {
            if ($filter == 0) // k sap xep
            {
                $product_sale = DB::table('db_productsale')
                    ->where('db_productsale.status', 1)
                    ->where('db_productsale.start_time', '<=', $date_time)
                    ->where('db_productsale.end_time', '>=', $date_time)
                    ->where('db_product.name', 'like', '%' . $keyword . '%')
                    ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                    ->where('db_productsale.qty', '>', 0)
                    ->where('db_productsale.qty_sold', '>=', 0)
                    ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                    ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
                    ->select(
                        'db_product.name',
                        'db_product.price',
                        'db_product.image',
                        'db_productsale.product_id as id',
                        'db_product.slug',
                        DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
                    );

                $product_ids = $product_sale->pluck('id')->toArray();

                $qty_products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids)
                    ->where('p.name', 'like', '%' . $keyword . '%')
                    ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                    ->unionAll($product_sale)
                    ->count();

                $qty_page = 1;
                if ($qty_products > $limit) {
                    $qty_page = ceil($qty_products / $limit);
                }
                $offset = ($page - 1) * $limit;

                $products = DB::table('db_product as p')
                    ->where('p.status', 1)
                    ->whereColumn('p.qty', '>', 'p.qty_sold')
                    ->where('p.qty', '>', 0)
                    ->where('p.qty_sold', '>=', 0)
                    ->whereNotIn('p.id', $product_ids)
                    ->where('p.name', 'like', '%' . $keyword . '%')
                    ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                    ->unionAll($product_sale)
                    ->offset($offset)->limit($limit)->get();
            } else {
                if ($filter == 1) {
                    $product_sale = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->where('db_product.name', 'like', '%' . $keyword . '%')
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
                        ->select(
                            'db_product.name',
                            'db_product.price',
                            'db_product.image',
                            'db_productsale.product_id as id',
                            'db_product.slug',
                            DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
                        );

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->where('p.name', 'like', '%' . $keyword . '%')
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->where('p.name', 'like', '%' . $keyword . '%')
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) DESC, price_sale DESC")
                        ->offset($offset)->limit($limit)->get();
                } else {
                    $product_sale = DB::table('db_productsale')
                        ->where('db_productsale.status', 1)
                        ->where('db_productsale.start_time', '<=', $date_time)
                        ->where('db_productsale.end_time', '>=', $date_time)
                        ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
                        ->where('db_productsale.qty', '>', 0)
                        ->where('db_productsale.qty_sold', '>=', 0)
                        ->where('db_product.name', 'like', '%' . $keyword . '%')
                        ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
                        ->join('db_sells', 'db_sells.id', '=', 'db_productsale.sale_id')
                        ->select(
                            'db_product.name',
                            'db_product.price',
                            'db_product.image',
                            'db_productsale.product_id as id',
                            'db_product.slug',
                            DB::raw('ROUND(db_product.price - (db_product.price * db_sells.percent_sale / 100), 2) as price')
                        );

                    $product_ids = $product_sale->pluck('id')->toArray();

                    $qty_products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->where('p.name', 'like', '%' . $keyword . '%')
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->count();

                    $qty_page = 1;
                    if ($qty_products > $limit) {
                        $qty_page = ceil($qty_products / $limit);
                    }
                    $offset = ($page - 1) * $limit;

                    $products = DB::table('db_product as p')
                        ->where('p.status', 1)
                        ->whereColumn('p.qty', '>', 'p.qty_sold')
                        ->where('p.qty', '>', 0)
                        ->where('p.qty_sold', '>=', 0)    
                        ->whereNotIn('p.id', $product_ids)
                        ->where('p.name', 'like', '%' . $keyword . '%')
                        ->select('p.name', 'p.price', 'p.image', 'p.id', 'p.slug', DB::raw('NULL as price_sale'))
                        ->unionAll($product_sale)
                        ->orderByRaw("IFNULL(price_sale, price) ASC, price_sale ASC")
                        ->offset($offset)->limit($limit)->get();
                }
            }
        }
        return response()->json([
            'success' => true, 'message' => 'Tải dữ liệu thành công',
            'products' => $products,
            'qty' => $qty_products,
            'qty_page' => $qty_page
        ], 200);
    }


    // sp bán chạy
    public function getProductBestSaler($limit)
    {
        $products = Product::where('db_product.status', '=', 1)//đã thay đổi thành 5
            ->join('db_orderdetail', 'db_orderdetail.product_id', '=', 'db_product.id')
            ->join('db_order', 'db_order.id', '=', 'db_orderdetail.order_id')
            ->where('db_order.status', '=', 5)
            ->whereColumn('db_product.qty', '>', 'db_product.qty_sold')
            ->where('db_product.qty', '>', 0)
            ->where('db_product.qty_sold', '>=', 0)
            ->groupBy('db_orderdetail.product_id', 'db_product.id', 'db_product.price', 'db_product.image', 'db_product.name', 'db_product.slug')
            ->selectRaw('db_orderdetail.product_id,COUNT(*) as total')
            ->orderByRaw('total DESC')
            ->select('db_product.id', 'db_product.slug', 'db_product.price', 'db_product.image', 'db_product.name', DB::raw('COUNT(*) as total'))
            ->limit($limit)->get();
        return response()->json(['success' => true, 'message' => 'Tải dữ liệu thành công', 'products' => $products], 200);
    }


    // lay sp theo danh muc
    public function getProductByCategory($id, $limit)
    {
        $category = Category::where(
            [
                ['id', '=', $id],
                ['status', '=', 1]
            ]
        )->first();

        if ($category == null) {
            return response()->json(['success' => true, 'message' => 'Không tìm thấy danh mục !', 'products' => null], 200);
        }
        $listid = array();
        array_push($listid, $category->id + 0); // luôn là một số nguyên.
        $args_cat1 = [
            ['parent_id', '=', $category->id + 0], // luôn là một số nguyên.
            ['status', '=', 1]
        ];
        $list_category1 = Category::where($args_cat1)->get();
        if (count($list_category1) > 0) {
            foreach ($list_category1 as $row1) {
                array_push($listid, $row1->id);
                $args_cat2 = [
                    ['parent_id', '=', $row1->id],
                    ['status', '=', 1]
                ];
                $list_category2 = Category::where($args_cat2)->get();
                if (count($list_category2) > 0) {
                    foreach ($list_category2 as $row2) {
                        array_push($listid, $row2->id);
                    }
                }
            }
        }

        $date = Carbon::now();
        $date_time = $date->format('Y-m-d H:i:s');

        $product_sale = DB::table('db_productsale')
            ->where('db_productsale.status', 1)
            ->where('db_productsale.start_time', '<=', $date_time)
            ->where('db_productsale.end_time', '>=', $date_time)
            ->whereIn('db_product.category_id', $listid)
            ->whereColumn('db_productsale.qty', '>', 'db_productsale.qty_sold')
            ->where('db_productsale.qty', '>', 0)
            ->where('db_productsale.qty_sold', '>=', 0)
            ->join('db_product', 'db_product.id', '=', 'db_productsale.product_id')
            ->select('db_productsale.product_id as id')
            ->get();

        $product_ids = $product_sale->pluck('id')->toArray();

        $products = DB::table('db_product as p')
        ->leftJoin('db_productreview as pr', 'pr.product_id', '=', 'p.id')
        ->whereOr('pr.status','=',1)
        ->whereColumn('p.qty', '>', 'p.qty_sold')
        ->where('p.qty', '>', 0)
        ->where('p.qty_sold', '>=', 0)
        ->where('p.status', '=', 1)
        ->whereNotIn('p.id', $product_ids)
        ->whereIn('p.category_id', $listid)
        ->select(
            'p.name',
            'p.price',
            'p.image',
            'p.id',
            'p.slug',
            'p.qty',
            'p.qty_sold',
            DB::raw('AVG(pr.qty_star) as average_stars'),
            DB::raw('(p.qty - p.qty_sold) as qty_')
        )
        ->groupBy('p.id', 'p.name', 'p.price', 'p.image', 'p.slug', 'p.qty', 'p.qty_sold')
        ->limit($limit)
        ->get();
    

        return response()->json(['success' => true, 'message' => 'Tải dữ liệu thành công', 'products' => $products], 200);
    }
}
