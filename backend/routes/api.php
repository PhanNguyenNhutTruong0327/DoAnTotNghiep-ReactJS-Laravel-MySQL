<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BrandController;

use App\Http\Controllers\RolesController;
use App\Http\Controllers\StaffAccountsController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SellsController;
use App\Http\Controllers\CustomerAddressController;

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductSaleController;
use App\Http\Controllers\ProductStoreController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderdetailController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\TopicController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProductReviewController;
use App\Http\Controllers\MailController;

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Here is where you can register routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the " middleware group. Make something great!
|
*/


//Login facebook
Route::post('/login-facebook', [LoginController::class, 'login_facebook']);
Route::get('/login-facebook/callback', [LoginController::class, 'callback_facebook']);

//Login google
Route::post('/login-google', [LoginController::class, 'login_google']);
Route::get('/login-google/callback', [LoginController::class, 'callback_google']);


// mail
Route::post('/send-email', [MailController::class, 'send_mail']);

// pay onl
Route::post('/vnpay_payment', [OrderController::class, 'vnpay_payment']);


//brand
Route::prefix('brand')->group(function () {

    Route::get('list-brand-fe', [BrandController::class, 'getListBrandFE']);  // ds brand trang ngdung ok
    Route::get('list-brand-be', [BrandController::class, 'getListBrandBE']); // ds brand admin * +
    Route::get('show/{id}', [BrandController::class, 'show']);    // lay chi tiet * +
    Route::post('store', [BrandController::class, 'store']);      // tao brand *
    Route::post('update/{id}', [BrandController::class, 'update']);   // update brand *
    Route::delete('destroy/{id}', [BrandController::class, 'destroy']); // xoa vinh vien

    Route::get('trash/{id}', [BrandController::class, 'trash']);  // xoa brand thanh rac *
    Route::get('rescover-trash/{id}', [BrandController::class, 'rescoverTrash']); // khoi phuc rac *
    Route::get('list-trash', [BrandController::class, 'getTrashAll']); // ds thung rac *

    // admin ok

});

Route::prefix('roles')->group(function () {

    Route::get('getAll', [RolesController::class, 'getAll']);  // ds *
    Route::post('store', [RolesController::class, 'store']);      // tao roles *
    Route::post('update/{id}', [RolesController::class, 'update']);      // cap nhat roles *

});


Route::prefix('customer')->group(function () {

    Route::post('store', [CustomerController::class, 'store']);      // tao customer * +
    Route::post('update-info-customer/{id}', [CustomerController::class, 'update_info']);      // cap nhat customer * +
    Route::get('list-customer-be/{limit?}/{page?}', [CustomerController::class, 'getCustomerBE']);      // ds customer trang admin, phan trang *
    Route::get('show/{id}', [CustomerController::class, 'show']);      // chi tiet customer + dia chi *

    Route::post('create-address', [CustomerAddressController::class, 'store']);      // tao dia chi *
    Route::post('add-address/{customer_id}', [CustomerAddressController::class, 'add']);      // them dia chi thu 2 *
    Route::post('update-address/{customer_id}', [CustomerAddressController::class, 'updateAddress']);     // cap nhat dia chi *
    Route::post('login', [CustomerController::class, 'login']);     // login ** okk

    Route::get('trash/{id}', [CustomerController::class, 'trash']);  // xoa thanh rac +
    Route::get('list-trash/{limit}/{page}', [CustomerController::class, 'getListTrash']); // ds thung rac  +
    Route::get('rescover-trash/{id}', [CustomerController::class, 'rescoverTrash']); // khoi phuc rac +
    Route::delete('destroy/{id}', [CustomerController::class, 'destroy']); // xoa vinh vien +

    Route::middleware('auth:sanctum')->get('get-detail-customer', [CustomerController::class, 'getOneCustomer']);
    Route::post('check-email', [CustomerController::class, 'check_email']); // okkkk
    Route::post('forgot-password', [CustomerController::class, 'forgotPassword']); // okkkk
    Route::post('register', [CustomerController::class, 'register']); // okkkk
    Route::post('update-password/{customer_id}', [CustomerController::class, 'update_password']); // okkkk

    // admin ok
});


Route::prefix('user')->group(function () {

    Route::post('store', [UserController::class, 'store']);      // tao  * +
    Route::post('update/{id}', [UserController::class, 'update']);      // cap nhat  * +
    Route::get('list-user/{limit?}/{page?}', [UserController::class, 'getAllUser']);      // ds trang admin, phan trang * +
    Route::get('show/{id}', [UserController::class, 'show']);      // chi tiet  + dia chi * +


    Route::get('trash/{id}', [UserController::class, 'trash']);  // xoa thanh rac +
    Route::get('list-trash/{limit}/{page}', [UserController::class, 'getListTrash']); // ds thung rac  +
    Route::get('rescover-trash/{id}', [UserController::class, 'rescoverTrash']); // khoi phuc rac +
    Route::delete('destroy/{id}', [UserController::class, 'destroy']); // xoa vinh vien +
    Route::post('login-admin', [UserController::class, 'login_admin']);    

});


Route::prefix('tag')->group(function () {

    Route::get('getAll', [TagController::class, 'getAll']);  // ds**

    Route::post('store', [TagController::class, 'store']);      // tao tag *

});

Route::prefix('staff-accounts')->group(function () {

    Route::get('getAll', [StaffAccountsController::class, 'getAll']);  // ds brand frontend *

    Route::post('store', [StaffAccountsController::class, 'create']);      // tao *

});

Route::prefix('category')->group(function () {
    Route::get('list-category-be', [CategoryController::class, 'getListCategoryBE']); // ds d.muc admin * +
    Route::get('list-category-fe/{parent_id}', [CategoryController::class, 'getByParentId']); // ds d.muc fe (menu 2 cap) * ok
    Route::get('show/{id}', [CategoryController::class, 'show']); // chi tiet category * +
    Route::post('store', [CategoryController::class, 'store']);   // them  category *
    Route::post('update/{id}', [CategoryController::class, 'update']);    // update category *
    Route::delete('destroy/{id}', [CategoryController::class, 'destroy']);  // xoa vinh vien


    Route::get('trash/{id}', [CategoryController::class, 'trash']);   // xoa vao thung rac *
    Route::get('rescover-trash/{id}', [CategoryController::class, 'rescoverTrash']);  // phuc hoi thung rac *
    Route::get('list-trash', [CategoryController::class, 'getListTrash']); // ds thung rac * +

    // admin ok

});

Route::prefix('product')->group(function () {

    Route::get('list-product-be/{limit?}/{page?}', [ProductController::class, 'getListProBE']); // ds sp trang admin *
    Route::get('product-new/{limit}', [ProductController::class, 'getProductNew']); // sp moi * ok
    Route::get('product-best-seller/{limit}', [ProductController::class, 'getProductBestSaler']);   // lay ra 4 sp ban chay ** okkk
    Route::get('show/{id}', [ProductController::class, 'show']);  // chi tiet sp *
    Route::post('store', [ProductController::class, 'store']); // them sp (ch xu ly hinh anh lien quan) +
    Route::post('update/{id}', [ProductController::class, 'update']);   // +
    Route::delete('destroy/{id}', [ProductController::class, 'destroy']);   // xoa vinh vien

    Route::get('product-brand/{slug}/{limit}/{page?}/{filter?}', [ProductController::class, 'getProductBySlugBrand']); // okkk
    // sp theo thuong hieu (phan trang, loc theo gia => filter = 0 k sap xep, filter = 1 sap xep giam dan, filter = 2 sap xep tang dan) **


    Route::get('product-category/{slug}/{limit}/{page?}/{filter?}', [ProductController::class, 'getProductBySlugCategory']); //okkkkkk
    // sp theo danh muc (phan trang, loc theo gia => filter = 0 k sap xep, filter = 1 sap xep giam dan, filter = 2 sap xep tang dan) **

    Route::get('product-by-category-id/{id}/{limit}', [ProductController::class, 'getProductByCategory']); //ok

    Route::get('product-detail/{slug}', [ProductController::class, 'getProductDetailAndProOther']); // chi tiet sp + sp cung danh muc * + ok
    Route::get('search-product/{key}/{limit}/{page?}/{filter?}', [ProductController::class, 'getSearchProduct']); // tim kiem sp co phan trang *

    Route::get('product-all/{limit}/{page?}/{filter?}', [ProductController::class, 'getProductAll']); // okkk
    // tat ca sp (phan trang, loc theo gia)** => filter = 0 k sap xep, filter = 1 sap xep giam dan, filter = 2 sap xep tang dan

    Route::get('trash/{id}', [ProductController::class, 'trash']);    // xoa vao thung rac **  +
    Route::get('rescover-trash/{id}', [ProductController::class, 'recoverTrash']); // phuc hoi rac **
    Route::get('list-trash/{limit}/{page?}', [ProductController::class, 'getListTrash']);   // ds rac **


    // admin ok
});

//
Route::prefix('product-category')->group(function () {
    Route::get('getAll', [ProductCategoryController::class, 'getProductCategory']); // ok

});
//

Route::prefix('product-sale')->group(function () {

    Route::get('list-product-sale/{limit}', [ProductSaleController::class, 'getProductSaleFE']); // sp sale trang ng.dung vs so luong can lay ** + ok
    Route::get('list-product-sale-be/{limit}/{page?}', [ProductSaleController::class, 'getProductSaleBE']); // sp sale trang admin ** +

    Route::get('trash/{id}', [ProductSaleController::class, 'trash']); // xoa vao thung rac +
    Route::get('rescover_trash/{id}', [ProductSaleController::class, 'recoverTrash']); // phuc hoi thung rac +
    Route::get('list-trash-pro-sale/{limit}/{page}', [ProductSaleController::class, 'getTrashProSale']); // ds rac sp sale +
    Route::get('show/{id}', [ProductSaleController::class, 'show']);  // chi tiet sp sale
    Route::delete('destroy/{id}', [ProductSaleController::class, 'destroy']);   // xoa vinh vien +

    Route::post('update/{id}', [ProductSaleController::class, 'update']); // * +
    Route::post('store', [ProductSaleController::class, 'store']); //* +
    Route::get('list-product-not-sale/{limit}/{page?}', [ProductSaleController::class, 'getProductNotSale']); // sp ch sale trang admin ** +
    Route::get('detail/{id}', [ProductSaleController::class, 'showProSale']);  // chi tiet sp sale ++

    //admin ok
});

Route::prefix('contact')->group(function () {
    Route::get('list-contact-be/{limit}/{page?}', [ContactController::class, 'getListContactBE']); // ds lh admin
    Route::get('show/{id}', [ContactController::class, 'show']);  // chi tiet
    Route::post('store', [ContactController::class, 'store']);    // tao lien he (ca 2 trang)
    Route::post('update/{id}', [ContactController::class, 'update']); // cap nhat
    Route::delete('destroy/{id}', [ContactController::class, 'destroy']); // xoa vinh vien

    //
    Route::get('trash/{id}', [ContactController::class, 'trash']);    // xoa vao thung rac
    Route::get('rescover-trash/{id}', [ContactController::class, 'RescoverTrash']);   // phuc hoi tu thung rac
    Route::get('list-trash', [ContactController::class, 'getListTrash']);   // ds thung rac

});


Route::prefix('sells')->group(function () {
    Route::get('get-list-sells', [SellsController::class, 'getListSale']); // +
    Route::get('list-sale-be', [SellsController::class, 'getListSaleBE']); // +
    Route::get('show/{id}', [SellsController::class, 'show']); // +
    Route::post('create', [SellsController::class, 'create']); // +
    Route::post('update/{id}', [SellsController::class, 'update']); // +
    Route::get('trash/{id}', [SellsController::class, 'trash']); // +
    Route::get('rescover-trash/{id}', [SellsController::class, 'rescoverTrash']); // +
    Route::get('list-trash', [SellsController::class, 'getListTrash']); // +
    Route::delete('destroy/{id}', [SellsController::class, 'destroy']); // +

    // admin ok
});

// Route::prefix('menu')->group(function(){
//     Route::get('index',[MenuController::class,'index']);
//     Route::get('show/{id}',[MenuController::class,'show']);
//     Route::post('store',[MenuController::class,'store']);
//     Route::post('update/{id}',[MenuController::class,'update']);
//     Route::delete('destroy/{id}', [MenuController::class, 'destroy']);
//     Route::get('getByParentId/{position}/{parent_id}', [MenuController::class, 'getByParentId']);
//     Route::get('getMenuFooter/{type}/{position}', [MenuController::class, 'getCS_Footer']);

//     Route::get('trash/{id}',[MenuController::class,'trash']);
//     Route::get('rescover_trash/{id}',[MenuController::class,'RescoverTrash']);
//     Route::get('trash',[MenuController::class,'getTrashAll']);
// });

Route::prefix('order')->group(function () {
    Route::get('list-order-be/{limit}/{page?}', [OrderController::class, 'getAllOderBE']); // ds don hang trang admin, phan trang
    Route::get('show/{id}', [OrderController::class, 'show']);    // chi tiet don hang
    Route::post('store', [OrderController::class, 'store']);  // tao don hang
    Route::post('update/{id}', [OrderController::class, 'update']); // cap nhat don hang
    Route::get('update-status/{id}/{status}', [OrderController::class, 'updateStatus']);
    Route::get('list-cancel/{page}', [OrderController::class, 'getListCancel']);  // ds don hang bi huy

    Route::get('recent-orders/{customer_id}/{limit}/{page}', [OrderController::class, 'getRecentOrders']);  // ds don hang gan day cua id khach hang okk
    Route::get('qty-orders/{customer_id}', [OrderController::class, 'getQtyOrderAndOrder']); //

    Route::get('revenue', [OrderController::class, 'getRevenueData']); //++++

});

Route::prefix('post')->group(function () {
    Route::get('list-post-be/{limit}/{page?}', [PostController::class, 'getListPostBE']); // ds bai viet admin **
    Route::get('show/{id}', [PostController::class, 'show']); // chi tiet ** +
    Route::post('store', [PostController::class, 'store']);   // tao bai viet, trang don admin * +
    Route::post('update/{id}', [PostController::class, 'update']);    // cap nhat bai viet, trang don +

    Route::delete('destroy/{id}', [PostController::class, 'destroy']);  // xoa vinh vien

    Route::get('trash/{id}', [PostController::class, 'trash']);   // xoa vao thung rac  **
    Route::get('rescover-trash/{id}', [PostController::class, 'rescoverTrash']); // phuc hoi thung rac  **
    Route::get('list-trash/{type}/{limit}/{page}', [PostController::class, 'getListTrash']); // ds thung rac bai viet, trang don +

    Route::get('list-post-fe/{limit}/{page?}', [PostController::class, 'getPostFE']); // ds bai viet trang nguoi dung * okk
    Route::get('post-detail/{slug}/{limit}', [PostController::class, 'getDetailPostAndPostOther']);  // chi tiet bai viet + bai viet lien quan * okk
    Route::get('post-by-topic/{slug}/{limit}/{page?}', [PostController::class, 'getPostBySlugTopic']); // bai viet theo chu de * ok
    Route::get('post-new/{limit}/{page}', [PostController::class, 'getPostNew']); // lay bai viet moi nhat * ok

    // admin ok

});


Route::prefix('banner')->group(function () {
    Route::get('list-banner-be', [BannerController::class, 'getBannerBE']); // ds slider trang admin **
    Route::get('list-banner-fe/{position}', [BannerController::class, 'getBannerFE']); // ds slider trang ng.dung *
    Route::get('show/{id}', [BannerController::class, 'show']);   // chi tiet slider *
    Route::post('store', [BannerController::class, 'store']); // tao slider *
    Route::post('update/{id}', [BannerController::class, 'update']);  // cap nhat slider
    Route::delete('destroy/{id}', [BannerController::class, 'destroy']);    // xoa vinh vien

    Route::get('trash/{id}', [BannerController::class, 'trash']); // xoa vao thung rac
    Route::get('rescover-trash/{id}', [BannerController::class, 'rescoverTrash']);    //phuc hoi thung rac
    Route::get('list-trash', [BannerController::class, 'getListTrash']);    // ds rac

    // admin ok
});

Route::prefix('topic')->group(function () {
    Route::get('list-topic-be', [TopicController::class, 'getTopicBE']);  // ds chu de trang admin **
    Route::get('list-topic', [TopicController::class, 'getListTopic']);  // ds chu de ** + ok
    Route::get('show/{id}', [TopicController::class, 'show']);    // chi tiet **
    Route::post('store', [TopicController::class, 'store']);  // tao topic *
    Route::post('update/{id}', [TopicController::class, 'update']);   // cap nhat topic **
    Route::delete('destroy/{id}', [TopicController::class, 'destroy']); // xoa vinh vien

    Route::get('list-topic/{parent_id}', [TopicController::class, 'getTopicByParent']); // ds chu de theo parent **

    Route::get('trash/{id}', [TopicController::class, 'trash']);  // xoa vao thung rac **
    Route::get('rescover-trash/{id}', [TopicController::class, 'rescoverTrash']); // phuc hoi rac **
    Route::get('list-trash', [TopicController::class, 'getListTrash']);   // ds rac **


});



//product review
Route::prefix('product-review')->group(function () {
    Route::post('store', [ProductReviewController::class, 'store']); // okkk
    Route::delete('destroy/{id}', [ProductReviewController::class, 'destroy']); // okkk
    Route::get('list-review/{limit}/{page}', [ProductReviewController::class, 'getListReview']); // okkk
    Route::get('show/{id}', [ProductReviewController::class, 'show']); // okkk
    Route::get('change-status/{id}', [ProductReviewController::class, 'changeStatus']); // okkk
});


// page
Route::prefix('page')->group(function () {
    Route::get('list-page-be', [PostController::class, 'getListPageBE']); // ds trang don admin +
    Route::get('showPage/{id}', [PostController::class, 'getPageById']); // chi tiet trang don
    Route::get('getPageFE/{slug}', [PostController::class, 'getPageFE']); // lay trang don cho trang ng.dung
    Route::get('getTrash', [PostController::class, 'getTrashPageAll']);   // ds thung rac +

    // sd link chung vs post van duoc
    Route::post('store', [PostController::class, 'store']);
    Route::post('update/{id}', [PostController::class, 'update']);
    Route::delete('destroy/{id}', [PostController::class, 'destroy']);
    Route::get('trash/{id}', [PostController::class, 'trash']);
    Route::get('rescover_trash/{id}', [PostController::class, 'rescoverTrash']);

    // admin ok
});

Route::prefix('config')->group(function () {
    Route::get('getConfig', [ConfigController::class, 'getConfig']);  // lay config ca 2 trang **
    Route::get('show/{id}', [ConfigController::class, 'show']); // chi tiet  **
    Route::post('update/{id}', [ConfigController::class, 'updateConfig']); // cap nhat config **
    Route::post('create', [ConfigController::class, 'create']); // tao config **
});
