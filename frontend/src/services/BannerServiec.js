import httpAxios from "../httpAxios";

// ds slider trang nguoi dung
function getListBanner(position) {
    return httpAxios.get(`banner/list-banner-fe/${position}`);
}
function getAll() {
    return httpAxios.get(`banner/list-banner-be`);
}
function create(banner) {
    return httpAxios.post(`banner/store`, banner);
}
//xem chi tiết
function getById(id) {
    return httpAxios.get(`banner/show/` + id);
}
//xóa
function remove(id) {
    return httpAxios.delete(`banner/destroy/` + id);
}
function getTrash(id) {
    return httpAxios.get(`banner/trash/` + id);
}
function getRecover(id) {
    return httpAxios.get(`banner/rescover-trash/` + id);
}
function getAllTrash() {
    return httpAxios.get(`banner/list-trash`);
}
function update(id, banner) {
    return httpAxios.post(`banner/update/` + id, banner);
}



const bannerServices = {
    getListBanner: getListBanner,
    getAll: getAll,
    create: create,
    getById: getById,
    remove: remove,
    getTrash: getTrash,
    getRecover: getRecover,
    getAllTrash: getAllTrash,
    update: update,


};

export default bannerServices;