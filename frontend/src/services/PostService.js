import httpAxios from "../httpAxios";

// bai viet moi nhat 
function getListPostNew(limit, page) {
    return httpAxios.get(`post/post-new/${limit}/${page}`);
}

// chi tiet bai viet + bai viet lien quan
function getPostDetailAndPostOther(slug, limit) {
    return httpAxios.get(`post/post-detail/${slug}/${limit}`);
}

// bai viet theo chu de
function getPostBySlugTopic(slug, limit, page) {
    return httpAxios.get(`post/post-by-topic/${slug}/${limit}/${page}`);
}

// tat ca bai viet
function getAllPost(limit, page) {
    return httpAxios.get(`post/list-post-fe/${limit}/${page}`);
}

// tat ca bai viet

function getAll(limit, page) {
    return httpAxios.get(`post/list-post-be/${limit}/${page}`);
}

// chi tiet bai viet
function getById(id) {
    return httpAxios.get('post/show/' + id);
}

// them bai viet
function create(post) {
    return httpAxios.post('post/store', post)
}

// cap nhat
function update(post, id) {
    return httpAxios.post('post/update/' + id, post);
}

// xao vao thung rac
function trash(id) {
    return httpAxios.get(`post/trash/${id}`);
}

// ds thung rac
function getListTrash(type, limit, page) {
    return httpAxios.get(`post/list-trash/${type}/${limit}/${page}`);
}

// phuc hoi thung rac
function rescoverTrash(id) {
    return httpAxios.get(`post/rescover-trash/${id}`);
}

// xoa vinh vien
function remove(id) {
    return httpAxios.delete('post/destroy/' + id);
}


function getBySlug(slug) {
    return httpAxios.get('post/show/' + slug);

}
function getTopicByParentId(parent_id) {
    return httpAxios.get(`topic_list/${parent_id}`);

}

const postServices = {
    getListPostNew: getListPostNew,
    getPostDetailAndPostOther: getPostDetailAndPostOther,
    getPostBySlugTopic: getPostBySlugTopic,
    getAllPost: getAllPost,
    // getAllPostBackend: getAllPostBackend,
    getAll: getAll,
    getById: getById,
    create: create,
    update: update,
    remove: remove,
    getBySlug: getBySlug,
    getTopicByParentId: getTopicByParentId,
    trash: trash,
    getListTrash: getListTrash,
    rescoverTrash: rescoverTrash,




};

export default postServices;