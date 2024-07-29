import httpAxios from "../httpAxios";

// ds slider trang nguoi dung
function addReviewProduct(data){
    return httpAxios.post(`/product-review/store`, data);
}






const reviewServices = {
    addReviewProduct:addReviewProduct,

    

};

export default reviewServices;