import axiosInstance from "./axios";

const adminToken = axiosInstance.getAuthToken('admin');

const apiStore = {
    // lay slider theo position
    createStore: (data) => {
        if(adminToken === null){
            return;
        }
        return axiosInstance.post(`/store/create`,data, {
            headers:{
                Authorization: `Bearer ${adminToken.jwt}`
            }
        });
    },

}

export default apiStore;