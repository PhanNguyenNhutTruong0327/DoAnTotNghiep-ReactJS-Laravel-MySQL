import axiosInstance from "./axios";

const apiRole = {

    // lay ds order voi user_id
    getAllRole: () => {
        return axiosInstance.get(`/roles`);
    },

}

export default apiRole;