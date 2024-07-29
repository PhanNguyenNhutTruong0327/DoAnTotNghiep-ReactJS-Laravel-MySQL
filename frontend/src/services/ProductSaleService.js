import httpAxios from '../httpAxios';

// ds sp sale
function getAll(limit,page) {
    return httpAxios.get(`product-sale/list-product-sale-be/${limit}/${page}`);
}

// chi tiet theo product_id
function getById(id) {
    return httpAxios.get('product-sale/show/' + id);
}

// xoa vao thung rac
function trash(id){
    return httpAxios.get(`product-sale/trash/${id}`);
}

// ds thung rac
function getListTrash(limit, page){
    return httpAxios.get(`product-sale/list-trash-pro-sale/${limit}/${page}`);
}

// phuc hoi thung rac
function rescoverTrash(id){
    return httpAxios.get(`product-sale/rescover_trash/${id}`);
}

// xoa vinh vien
function remove(id) {
    return httpAxios.delete('product-sale/destroy/' + id);
}

// ds sp ch sale de thiet lap sale
function getProductNotSale(limit, page){
    return httpAxios.get(`product-sale/list-product-not-sale/${limit}/${page}`);
}

// them sp sale
function create(data) {
    return httpAxios.post('product-sale/store', data)
}

// chi tiet theo id
function getDeatil(id) {
    return httpAxios.get('product-sale/detail/' + id);
}

// cap nhat
function update(data, id) {
    return httpAxios.post('product-sale/update/' + id, data);
}





function getBySlug(slug) {
    return httpAxios.get('product-sale/show/' + slug);
}




const productSaleService = {
    getBySlug: getBySlug,
    getAll: getAll,
    getById: getById,
    create: create,
    update: update,
    remove: remove,
    trash : trash,
    getListTrash:getListTrash,
    rescoverTrash:rescoverTrash,
    getProductNotSale:getProductNotSale,
    getDeatil:getDeatil,







}
export default productSaleService;