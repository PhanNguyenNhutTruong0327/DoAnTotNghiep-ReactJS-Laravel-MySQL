import httpAxios from "../httpAxios";

// ds slider trang nguoi dung
function login_google(){
    return httpAxios.post(`/login-google`);
}


// ds slider trang nguoi dung
function login_facebook(){
    return httpAxios.post(`/login-facebook`);
}





const loginServices = {
    login_google:login_google,
    login_facebook:login_facebook,
    

};

export default loginServices;