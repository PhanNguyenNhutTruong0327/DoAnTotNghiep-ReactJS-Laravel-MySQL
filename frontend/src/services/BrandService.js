import httpAxios from "../httpAxios";

// ds brand trang nguoi dung
function getListBrands() {
    return httpAxios.get(`brand/list-brand-fe`);
}
function getAll() {
    return httpAxios.get(`brand/list-brand-be`);
}
function create(brand) {
    return httpAxios.post(`brand/store`, brand);
}
//xem chi tiết
function getById(id) {
    return httpAxios.get(`brand/show/` + id);
}
//xóa
function remove(id) {
    return httpAxios.delete(`brand/destroy/` + id);
}
function getTrash(id) {
    return httpAxios.get(`brand/trash/` + id);
}
function getRecover(id) {
    return httpAxios.get(`brand/rescover-trash/` + id);
}
function getAllTrash() {
    return httpAxios.get(`brand/list-trash`);
}
function update(id, brand) {
    return httpAxios.post('/brand/update/' + id, brand);
}



const brandServices = {
    getListBrands: getListBrands,
    getAll: getAll,
    create: create,
    getById: getById,
    remove: remove,
    getTrash: getTrash,
    getRecover: getRecover,
    getAllTrash: getAllTrash,
    update: update,

};

export default brandServices;