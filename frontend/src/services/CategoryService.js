import httpAxios from "../httpAxios";

// ds category trang nguoi dung
function getListCategories(parent_id) {
    return httpAxios.get(`category/list-category-fe/${parent_id}`);
}
//danh sách danh mục trang backend
function getBackend() {
    return httpAxios.get(`category/list-category-be`);
}
// thêm
function create(category) {
    return httpAxios.post(`category/store`, category);
}
//xem chi tiết
function getById(id) {
    return httpAxios.get(`category/show/` + id);
}
//xóa
function remove(id) {
    return httpAxios.delete(`category/destroy/` + id);
}
function getTrash(id) {
    return httpAxios.get(`category/trash/` + id);
}
function getRecover(id) {
    return httpAxios.get(`category/rescover-trash/` + id);
}
function getAllTrash() {
    return httpAxios.get(`category/list-trash`);
}
function update(id, category) {
    return httpAxios.post(`category/update/` + id, category);
}

function getCategoryByParentId(parent_id) {
    return httpAxios.get(`category/category_list/${parent_id}`);

}
//menu 
function MenuCategory(parent_id) {
    return httpAxios.get(`category/list-category-fe/${parent_id}`)
}
function getBySlug(slug) {
    return httpAxios.get('/category/show/' + slug);
}
const categoryServices = {
    getListCategories: getListCategories,
    getBackend: getBackend,
    create: create,
    getById: getById,
    remove: remove,
    getTrash: getTrash,
    getRecover: getRecover,
    getAllTrash: getAllTrash,
    update: update,
    getCategoryByParentId: getCategoryByParentId,
    MenuCategory: MenuCategory,
    getBySlug: getBySlug,



};

export default categoryServices;