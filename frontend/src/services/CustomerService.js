import httpAxios from "../httpAxios";

// ds slider trang nguoi dung
function checkLogin(data) {
    return httpAxios.post(`customer/login`, data);
}

// chi tiet tai khoan khach hang
function getDetailAccount() {
    const token = JSON.parse(localStorage.getItem('token'));
    console.log(`Bearer ${token.jwt}`);
    return httpAxios.get(`customer/get-detail-customer`,
        {
            headers: {
                'Authorization': `Bearer ${token.jwt}`
            }
        }
    );
}


// login fb
function loginFaceboook() {
    return httpAxios.get('/login-faceboook');
}

// check emai
function checkEmail(email) {
    return httpAxios.post('/customer/check-email', email);
}

// Forgot Password
function forgotPassword(data) {
    return httpAxios.post('/customer/forgot-password', data);
}

// register
function register(data) {
    return httpAxios.post('/customer/register', data);
}

// edit info
function updateInfoCustomer(data, id) {
    return httpAxios.post(`/customer/update-info-customer/${id}`, data);
}


// ds khach hang trang admin
function getAll(limit, page) {
    return httpAxios.get(`customer/list-customer-be/${limit}/${page}`);
}

// chi tiet khach hang
function show(id) {
    return httpAxios.get(`/customer/show/${id}`);
}

// them khach hang
function create(data) {
    return httpAxios.post(`/customer/store`, data);
}

// cap nhat khach hang
function update(data, id) {
    return httpAxios.post(`/customer/update/${id}`, data);
}

// xoa thung rac
function trash(id) {
    return httpAxios.get(`/customer/trash/${id}`);
}


// ds thung rac
function getListTrash(limit, page) {
    return httpAxios.get(`/customer/list-trash/${limit}/${page}`);
}

// phuc hoi rac
function rescoverTrash(id) {
    return httpAxios.get(`/customer/rescover-trash/${id}`);
}

// xoa vinh vien
function deleteCustomer(id) {
    return httpAxios.delete(`/customer/destroy/${id}`);
}

// edit address
function updataCustomerAddress(data, id){
    return httpAxios.post(`/customer/update-address/${id}`,data);
}

// tao dia chi 
function createCustomerAddress(data){
    return httpAxios.post(`/customer/create-address`,data);
}

// thay doi mat khau
function updatePassword(data, id){
    return httpAxios.post(`/customer/update-password/${id}`,data);
}

const customerServices = {
    checkLogin: checkLogin,
    getDetailAccount: getDetailAccount,
    loginFaceboook: loginFaceboook,
    checkEmail: checkEmail,
    forgotPassword: forgotPassword,
    register: register,
    updateInfoCustomer: updateInfoCustomer,
    getAll: getAll,
    show: show,
    create: create,
    update: update,
    trash: trash,
    getListTrash: getListTrash,
    rescoverTrash: rescoverTrash,
    deleteCustomer: deleteCustomer,
    updataCustomerAddress:updataCustomerAddress,
    createCustomerAddress:createCustomerAddress,
    updatePassword:updatePassword


};

export default customerServices;