import axiosInstance from "../httpAxios";

const apiPage = {


    // ds trang don
    getAll: () => {
        return axiosInstance.get(`page/list-page-be`);
    },


    // chi tiet bai viet
    getById: (id) => {
        return axiosInstance.get('/post/show/' + id);
    },

    // them bai viet
    create: (post) => {
        return axiosInstance.post('/post/store', post)
    },

    // cap nhat
    update: (post, id) => {
        return axiosInstance.post('/post/update/' + id, post);
    },

    // xao vao thung rac
    trash: (id) => {
        return axiosInstance.get(`/post/trash/${id}`);
    },

    // ds thung rac
    getListTrash: () => {
        return axiosInstance.get(`/page/getTrash`);
    },

    // phuc hoi thung rac
    rescoverTrash: (id) => {
        return axiosInstance.get(`/post/rescover-trash/${id}`);
    },

    // xoa vinh vien
    remove: (id) => {
        return axiosInstance.delete('/post/destroy/' + id);
    },


    getBySlug: (slug) => {
        return axiosInstance.get('/post/show/' + slug);

    },
    getTopicByParentId: (parent_id) => {
        return axiosInstance.get(`topic_list/${parent_id}`);

    },



    // tat ca bai viet voi type va phan trang
    getAllPage: (page, limit) => {
        return axiosInstance.get(`/pages?${page}&limit=${limit}`).then(res => res.data);
    },

    // // lay chi tiet
    // getById: (id) => {
    //     return axiosInstance.get(`/post/show/${id}`);
    // },


    // // xoa vao thung rac
    // trashPost: (id) => {
    //     return axiosInstance.put(`/post/trash/${id}`);
    // },


    // // phuc hoi thung rac
    // rescoverTrash: (id) => {
    //     return axiosInstance.put(`/post/rescover-trash/${id}`);
    // },


    // // ds thung rac
    // getListTrash: (type, page, limit) => {
    //     return axiosInstance.get(`/post/trash/get-list-trash/${type}?page=${page}&limit=${limit}`).then(res => res.data);
    // },


    // // an, hien
    // displayPost: (id) => {
    //     return axiosInstance.put(`/post/display/${id}`);
    // },


    // // xoa vinh vien
    // deletePost: (id) => {
    //     return axiosInstance.delete(`/post/delete-post/${id}`);
    // },


    // // bai viet theo slug topic
    // getPostBySlugTopic: (slug, page, limit) => {
    //     return axiosInstance.get(`/post/get-by-slug-topic/${slug}?page=${page}&limit=${limit}`).then(res => res.data);
    // },


    // // chi tiet bai viet voi bai viet lien quan
    // getDetailPostAndOther: (slug) => {
    //     return axiosInstance.get(`/post/detail/${slug}`).then(res => res.data);
    // },

    // // tao bai viet
    // createPost: (post) => {
    //     return axiosInstance.post(`/post/create`, post);
    // },

    // // cap nhat 
    // updatePost: (post, id) => {
    //     return axiosInstance.put(`/post/update/${id}`, post)
    // },


}

export default apiPage;