import axiosInstance from "./axios";

const adminToken = axiosInstance.getAuthToken('admin');

const apiConfig = {
    // lay slider theo position
    getConfig: () => {
        return axiosInstance.get(`/config`);
    },

    // lay chi tiet 
    getOneConfig: (id) => {
        return axiosInstance.get(`/config/show/${id}`);
    },

    // cap nhat
    updateConfig: (data, id) => {
        if(adminToken === null){
            return;
        }
        return axiosInstance.put(`/config/update/${id}`, data, {
            headers:{
                Authorization: `Bearer ${adminToken.jwt}`
            }
        });
    },


}

export default apiConfig;