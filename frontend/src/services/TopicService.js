import httpAxios from "../httpAxios";

// ds topic trang nguoi dung
function getListTopic() {
    return httpAxios.get(`topic/list-topic`);
}

function getAll() {
    return httpAxios.get('topic/list-topic-be');
}

// chi tiet
function getById(id) {
    return httpAxios.get('topic/show/' + id);
}

// them 
function create(topic) {
    return httpAxios.post('topic/store', topic)
}

// cap nhat
function update(id, topic) {
    return httpAxios.post(`topic/update/` + id, topic);
}

// xoa vinh vien
function remove(id) {
    return httpAxios.delete('/topic/destroy/' + id);
}

// xoa vao thung rac
function trash(id) {
    return httpAxios.get(`/topic/trash/${id}`);
}
function getRecover(id) {
    return httpAxios.get(`topic/rescover-trash/` + id);
}
function listTrash(i) {
    return httpAxios.get(`topic/list-trash`);
}

const topicService = {
    getListTopic: getListTopic,
    getAll: getAll,
    getById: getById,
    create: create,
    update: update,
    remove: remove,
    trash: trash,
    getRecover: getRecover,
    listTrash: listTrash,

};

export default topicService;