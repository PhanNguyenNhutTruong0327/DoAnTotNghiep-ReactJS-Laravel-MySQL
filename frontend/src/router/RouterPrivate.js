import ListBanner from "../pages/backend/Slider/SliderList";
import BannerShow from "../pages/backend/Slider/SliderShow";
import BannerUpdate from "../pages/backend/Slider/SliderUpdate";
import ListTrashBanner from "../pages/backend/Slider/Slider_Trash";
import BannerCreate from "../pages/backend/Slider/SliderCreate";

import ListBrand from "../pages/backend/Brand";
import BrandShow from "../pages/backend/Brand/BrandShow";
import CreateBrand from "../pages/backend/Brand/BrandCreate";
import BrandUpdate from "../pages/backend/Brand/BrandUpdate";
import ListTrash from "../pages/backend/Brand/ListTrash";
import ListCategories from "../pages/backend/Category/CategoryList";
import CategoryShow from "../pages/backend/Category/CategoryShow";
import CategoryUpdate from "../pages/backend/Category/CategoryUpdate";
import ListTrashCat from "../pages/backend/Category/CategoryTrash";
import CreateCat from "../pages/backend/Category/CategoryCreate";
// import Config from "../pages/backend/Config";
// import UpdateConfig from "../pages/backend/Config/UpdateConfig";
import ListCustomer from "../pages/backend/Customer";
import CustomerShow from "../pages/backend/Customer/CustomerShow";
// import CustomerUpdate from "../pages/backend/Customer/CustomerUpdate";
// import ListTrashCustomer from "../pages/backend/Customer/ListTrashCustomer";
import Dashboard from "../pages/backend/Dashboard";
// import ListDiscountedProduct from "../pages/backend/DiscountedProduct";
// import DiscountedCreate from "../pages/backend/DiscountedProduct/DiscountedCreate";
// import DiscountedProCreate from "../pages/backend/DiscountedProduct/DiscountedProCreate";
// import DiscountedProductShow from "../pages/backend/DiscountedProduct/DiscountedProductShow";
// import DiscountedTrash from "../pages/backend/DiscountedProduct/DiscountedTrash";
// import DiscountedUpdate from "../pages/backend/DiscountedProduct/DiscountedUpdate";
// import ProductImport from "../pages/backend/Import";
// import CreateImport from "../pages/backend/Import/CreateImport";
// import LoginAdmin from "../pages/backend/LoginAdmin";
import OrderCancel from "../pages/backend/Order/OrderCancel";
import OrderList from "../pages/backend/Order/OrderList";
import OrderShow from "../pages/backend/Order/OrderShow";
import ListPage from "../pages/backend/Page/PageList";
import PageCreate from "../pages/backend/Page/PageCreate";
import PageShow from "../pages/backend/Page/PageShow";
import PageTrash from "../pages/backend/Page/ListTrash";
import PageUpdate from "../pages/backend/Page/PageUpdate";
import ListPost from "../pages/backend/Post/PostList";
import PostCreate from "../pages/backend/Post/PostCreate";
import PostListTrash from "../pages/backend/Post/Trash_Post";
import PostShow from "../pages/backend/Post/PostShow";
import PostUpdate from "../pages/backend/Post/PostUpdate";
import ListSale from "../pages/backend/Sale";
import ListTrashSale from "../pages/backend/Sale/ListTrashSale";
import SaleShow from "../pages/backend/Sale/SaleShow";
import SaleUpdate from "../pages/backend/Sale/SaleUpdate";
import CreateSale from "../pages/backend/Sale/SaleCreate";
// import ListStaff from "../pages/backend/Staff";
// import ListTrashStaff from "../pages/backend/Staff/ListTrashStaff";
// import StaffCreate from "../pages/backend/Staff/StaffCreate";
// import StaffShow from "../pages/backend/Staff/StaffShow";
// import StaffUpdate from "../pages/backend/Staff/StaffUpdate";
// import ListTag from "../pages/backend/Tag";
import ListTopic from "../pages/backend/Topic";
import CreateTopic from "../pages/backend/Topic/TopicCreate";
import ListTrashTopic from "../pages/backend/Topic/ListTrashTopic";
import TopicShow from "../pages/backend/Topic/TopicShow";
import TopicUpdate from "../pages/backend/Topic/TopicUpdate";
import ListProduct from "../pages/backend/product/ListProduct";
import ListProductTrash from "../pages/backend/product/ListProductTrash";
import ProductCreate from "../pages/backend/product/ProductCreate";
import ProductShow from "../pages/backend/product/ProductShow";
import ProductUpdate from "../pages/backend/product/ProductUpdate";
import ProductSaleList from "../pages/backend/ProductSale/ProductSaleList";
import ProductSaleShow from "../pages/backend/ProductSale/ProductSaleShow";
import ListSaleProduct from "../pages/backend/ProductSale/ListProduct";
import ProductSaleTrash from "../pages/backend/ProductSale/ProductSaleTrash";
import ProductSaleCreate from "../pages/backend/ProductSale/ProductSaleCreate";
import ProductSaleUpdata from "../pages/backend/ProductSale/ProductSaleUpdate";
import LoginAdmin from "../pages/backend/LoginAdmin";

// import RelatedAccessories from "../pages/backend/product/RelatedAccessories";


const RouterPrivate = [
    { path: '/admin', component: Dashboard },
    { path: '/admin-login', component: LoginAdmin },


    // category
    { path: '/admin/list-categories', component: ListCategories },
    { path: '/admin/list-categories/show/:id', component: CategoryShow },
    { path: '/admin/list-categories/update/:id', component: CategoryUpdate },
    { path: '/admin/list-categories/list-trash', component: ListTrashCat },
    { path: '/admin/list-categories/create', component: CreateCat },


    // // brand
    { path: '/admin/list-brands', component: ListBrand },
    { path: '/admin/list-brands/create', component: CreateBrand },
    { path: '/admin/list-brands/show/:id', component: BrandShow },
    { path: '/admin/list-brands/list-trash', component: ListTrash },
    { path: '/admin/list-brands/update/:id', component: BrandUpdate },

    // // topic
    { path: '/admin/list-topic', component: ListTopic },
    { path: '/admin/list-topic/create', component: CreateTopic },
    { path: '/admin/list-topic/update/:id', component: TopicUpdate },
    { path: '/admin/list-topic/show/:id', component: TopicShow },
    { path: '/admin/list-topic/list-trash', component: ListTrashTopic },


    // // sale
    { path: '/admin/list-sale-be/create', component: CreateSale },
    { path: '/admin/list-sale-be', component: ListSale },
    { path: '/admin/list-sale/show/:id', component: SaleShow },
    { path: '/admin/list-sale/update/:id', component: SaleUpdate },
    { path: '/admin/list-sale/list-trash', component: ListTrashSale },


    // // customer
    { path: '/admin/list-customer/:page/:limit', component: ListCustomer },
    { path: '/admin/list-customer/show/:id', component: CustomerShow },
    // {path:'/admin/list-customer/update/:id', component: CustomerUpdate},
    // {path:'/admin/list-customer/list-trash', component: ListTrashCustomer},


    // // staff
    // {path:'/admin/list-staff', component: ListStaff},
    // {path:'/admin/list-staff/show/:id', component: StaffShow},
    // {path:'/admin/list-staff/update/:id', component: StaffUpdate},
    // {path:'/admin/list-staff/list-trash', component: ListTrashStaff},
    // {path:'/admin/list-staff/create', component: StaffCreate},


    // // product
    { path: '/admin/list-products/:limit/:page', component: ListProduct },
    { path: '/admin/list-products/show/:id', component: ProductShow },
    { path: '/admin/list-products/update/:id', component: ProductUpdate },
    { path: '/admin/list-products/list-trash/:page/:limit', component: ListProductTrash },
    { path: '/admin/list-products/create', component: ProductCreate },
    // {path:'/admin/list-products/add-related-accessories/:id', component: RelatedAccessories},

    // // tag
    // {path:'/admin/list-tag', component: ListTag},


    // // banner
    { path: '/admin/list-banners', component: ListBanner },
    { path: '/admin/list-banners/show/:id', component: BannerShow },
    { path: '/admin/list-banners/update/:id', component: BannerUpdate },
    { path: '/admin/list-banners/list-trash', component: ListTrashBanner },
    { path: '/admin/list-banners/create', component: BannerCreate },


    // product sale
    { path: '/admin/product-sale/:limit/:page', component: ProductSaleList },
    { path: '/admin/product-sale/list-product/:limit/:page', component: ListSaleProduct },
    { path: '/admin/product-sale/list-trash/:limit/:page', component: ProductSaleTrash },
    { path: '/admin/product-sale/show/:id', component: ProductSaleShow },
    { path: '/admin/product-sale/create/:id', component: ProductSaleCreate },
    { path: '/admin/product-sale/update/:id', component: ProductSaleUpdata },


    // // post
    { path: '/admin/list-post/:page/:limit', component: ListPost },
    { path: '/admin/list-post/show/:id', component: PostShow },
    { path: '/admin/list-post/list-trash/:type/:page/:limit', component: PostListTrash },
    { path: '/admin/list-post/create', component: PostCreate },
    { path: '/admin/list-post/update/:id', component: PostUpdate },


    // // import 
    // {path:'/admin/product-import/:page/:limit', component: ProductImport},
    // {path:'/admin/product-import/create/:id', component: CreateImport},


    // // config
    // {path:'/admin/config', component: Config},
    // {path:'/admin/config/update/:id',component: UpdateConfig},


    // // order
    { path: '/admin/orders/:page/:limit', component: OrderList },
    { path: '/admin/order/show/:id', component: OrderShow },
    { path: '/admin/orders/cancel/:page/:limit', component: OrderCancel },

    // //page
    { path: '/admin/pages/:page/:limit', component: ListPage },
    { path: '/admin/page/show/:id', component: PageShow },
    { path: '/admin/page/create', component: PageCreate },
    { path: '/admin/page/update/:id', component: PageUpdate },
    { path: '/admin/page/list-trash/:page/:limit', component: PageTrash },


];

export default RouterPrivate;