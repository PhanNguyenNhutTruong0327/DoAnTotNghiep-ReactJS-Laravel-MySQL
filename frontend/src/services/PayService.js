import httpAxios from "../httpAxios";

// vnpay
function vnpay_payment(data){
    return httpAxios.post(`/vnpay_payment`,data);
}






const payServices = {
    vnpay_payment:vnpay_payment,

    

};

export default payServices;