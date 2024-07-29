import httpAxios from "../httpAxios";

// sp giam gia
function getProductSale(limit) {
    return httpAxios.get(`product-sale/list-product-sale/${limit}`);
}

// sp moi
function getProductNew(limit) {
    return httpAxios.get(`/product/product-new/${limit}`);
}

// sp theo danh muc trang home
function getProductByCategoryId(category_id, limit) {
    return httpAxios.get(`/product/product-by-category-id/${category_id}/${limit}`);
}

// chi tiet san pham + sp cung danh muc
function getProductDetailAndProductOther(slug) {
    return httpAxios.get(`/product/product-detail/${slug}`);
}

// sp theo danh muc (phan trang + loc theo gia)
function getProductByCategorySlug(slug, limit, page, filter, filter_price, brand) {
    if (filter_price.max != 0) {
        if (brand != 0) {
            console.log(`/product/product-category/${slug}/${limit}/${page}/${filter}?pricemin=${filter_price.min}&pricemax=${filter_price.max}&brand=${brand}`);
            return httpAxios.get(`/product/product-category/${slug}/${limit}/${page}/${filter}?pricemin=${filter_price.min}&pricemax=${filter_price.max}&brand=${brand}`);
        }
        console.log(`/product/product-category/${slug}/${limit}/${page}/${filter}?pricemin=${filter_price.min}&pricemax=${filter_price.max}`);
        return httpAxios.get(`/product/product-category/${slug}/${limit}/${page}/${filter}?pricemin=${filter_price.min}&pricemax=${filter_price.max}`);
    }
    else {
        if (brand != 0) {
            console.log(`/product/product-category/${slug}/${limit}/${page}/${filter}&brand=${brand}`);
            return httpAxios.get(`/product/product-category/${slug}/${limit}/${page}/${filter}?brand=${brand}`);
        }
        console.log(`/product/product-category/${slug}/${limit}/${page}/${filter}`);
        return httpAxios.get(`/product/product-category/${slug}/${limit}/${page}/${filter}`);
    }
}

// tat ca cac sp
function getAllProducts(limit, page, filter ,filter_price, brand) {
    if (filter_price.max != 0) {
        if (brand != 0) {
            console.log(`/product/product-all/${limit}/${page}/${filter}?pricemin=${filter_price.min}&pricemax=${filter_price.max}&brand=${brand}`);
            return httpAxios.get(`/product/product-all/${limit}/${page}/${filter}?pricemin=${filter_price.min}&pricemax=${filter_price.max}&brand=${brand}`);
        }
        console.log(`/product/product-all/${limit}/${page}/${filter}?pricemin=${filter_price.min}&pricemax=${filter_price.max}`);
        return httpAxios.get(`/product/product-all/${limit}/${page}/${filter}?pricemin=${filter_price.min}&pricemax=${filter_price.max}`);
    }
    else {
        if (brand != 0) {
            console.log(`/product/product-all/${limit}/${page}/${filter}&brand=${brand}`);
            return httpAxios.get(`/product/product-all/${limit}/${page}/${filter}?brand=${brand}`);
        }
        console.log(`/product/product-all/${limit}/${page}/${filter}`);
        return httpAxios.get(`/product/product-all/${limit}/${page}/${filter}`);
    }
}

// san pham theo thuong hieu
function getProductByBrandSlug(slug, limit, page, filter, filter_price) {
    // console.log(filter_price.filter_price[1]);
    if (filter_price.max != 0) {
        console.log(`/product/product-brand/${slug}/${limit}/${page}/${filter}?pricemin=${filter_price.min}&pricemax=${filter_price.max}`);
        return httpAxios.get(`/product/product-brand/${slug}/${limit}/${page}/${filter}?pricemin=${filter_price.min}&pricemax=${filter_price.max}`);
    }
    else {
        console.log(`/product/product-brand/${slug}/${limit}/${page}/${filter}`);
        return httpAxios.get(`/product/product-brand/${slug}/${limit}/${page}/${filter}`);
    }
}

// sp ban chay
function getProductBestSeller(limit) {
    return httpAxios.get(`/product/product-best-seller/${limit}`);
}

// tim kiem sp theo ten
function getSearchProductByName(keyword, limit, page, filter, filter_price) {
    if (filter_price.max != 0) {
        console.log(`/product/search-product/${keyword}/${limit}/${page}/${filter}?pricemin=${filter_price.min}&pricemax=${filter_price.max}`);
        return httpAxios.get(`/product/search-product/${keyword}/${limit}/${page}/${filter}?pricemin=${filter_price.min}&pricemax=${filter_price.max}`);
    }
    else {
        console.log(`/product/search-product/${keyword}/${limit}/${page}/${filter}`);
        return httpAxios.get(`/product/search-product/${keyword}/${limit}/${page}/${filter}`);
    }
}


//backend
function getAll(limit, page) {
    return httpAxios.get(`product/list-product-be/${limit}/${page}`);
}
function create(product) {
    return httpAxios.post(`product/store`, product);
}
//xem chi tiết
function getById(id) {
    return httpAxios.get(`product/show/` + id);
}
//xóa
function remove(id) {
    return httpAxios.delete(`product/destroy/` + id);
}
function getTrash(id) {
    return httpAxios.get(`product/trash/` + id);
}
function getRecover(id) {
    return httpAxios.get(`product/rescover-trash/` + id);
}
function getAllTrash(limit, page) {
    return httpAxios.get(`product/list-trash/${limit}/${page}`);
}

function update(product, id) {
    return httpAxios.post('product/update/' + id, product);

}


const productServices = {
    getProductSale: getProductSale,
    getProductNew: getProductNew,
    getProductByCategoryId: getProductByCategoryId,
    getProductDetailAndProductOther: getProductDetailAndProductOther,
    getProductByCategorySlug: getProductByCategorySlug,
    getAllProducts: getAllProducts,
    getProductByBrandSlug: getProductByBrandSlug,
    getProductBestSeller: getProductBestSeller,
    getSearchProductByName: getSearchProductByName,
    getAll: getAll,
    create: create,
    getById: getById,
    remove: remove,
    getTrash: getTrash,
    getRecover: getRecover,
    getAllTrash: getAllTrash,
    update: update,



};

export default productServices;