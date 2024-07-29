import httpAxios from "../httpAxios";

// ds don hang theo customer id
function getRecentOrders(customer_id, limit, page) {
    return httpAxios.get(`order/recent-orders/${customer_id}/${limit}/${page}`);
}

// huy don hang
function cancelOrder(order_id, status) {
    return httpAxios.get(`order/update-status/${order_id}/${status}`);
}

// so luong tung muc theo customer 
function qtyOrder(customer_id) {
    return httpAxios.get(`order/qty-orders/${customer_id}`);
}

// them don hang
function createOrder(data) {
    return httpAxios.post(`order/store`, data);
}

function getAll(limit, page) {
    return httpAxios.get(`order/list-order-be/${limit}/${page}`);
}
function updateStatusOrder(data, id) {
    return httpAxios.post(`order/update/${id}`, data);
}
// cap nhat trang thai don hang
function updateStatus(order_id, status) {
    return httpAxios.get(`order/update-status/${order_id}/${status}`);
}

// thay doi phuong thuc thanh toan
function editPaymentMethods(order_id, data) {
    return httpAxios.post(`order/edit-payment-methods/${order_id}`, data);
}

// chi tiet don hang
function show(id) {
    return httpAxios.get(`order/show/${id}`);
}


const orderServices = {
    getRecentOrders: getRecentOrders,
    cancelOrder: cancelOrder,
    qtyOrder: qtyOrder,
    createOrder: createOrder,
    getAll: getAll,
    updateStatusOrder: updateStatusOrder,
    updateStatus: updateStatus,
    editPaymentMethods: editPaymentMethods,
    show: show,

};

export default orderServices;