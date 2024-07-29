import axiosInstance from "./axios";

const apiTag = {
    // lay tat ca thuong hieu
    getTagCatgory: () => {
        return axiosInstance.get("/tag");
    },

    // lay tat ca tag
    getAll: () => {
        return axiosInstance.get(`/tags`);

    },

    // lay tag va danh muc
    getTagAndCategory: () => {
        return axiosInstance.get(`/tag/get-tag-and-category`);
    },



    
}

export default apiTag;