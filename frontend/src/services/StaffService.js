import httpAxios from "../httpAxios";

// kiem tra login
function checkLogin(data){
    return httpAxios.post(`user/login-admin`,data);
}






const staffServices = {
    checkLogin:checkLogin,

    

};

export default staffServices;