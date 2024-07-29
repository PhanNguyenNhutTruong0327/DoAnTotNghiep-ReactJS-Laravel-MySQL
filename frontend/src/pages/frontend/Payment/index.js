import { useEffect, useState } from "react";
import { useAuth } from "../../../component/Provider/AuthProvider";
import { useCart } from "react-use-cart";
import { Form, useLocation, useNavigate } from "react-router-dom";
import customerServices from "../../../services/CustomerService";
import orderServices from "../../../services/OrderService";
import { urlImage } from "../../../config";
import payServices from "../../../services/PayService";
import { toast, ToastContainer } from 'react-toastify';
import queryString from 'query-string';
import Loading from "./loading";
import './loading.css'

function Payment() {

    const { token } = useAuth();
    const navigation = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');
    const [address, setAddress] = useState('');
    const [data_address, setDataAddress] = useState();

    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    // const [payment_success, setPayentSuccess] = useState(null);
    // const [order_id, setOrderId] = useState();

    // cart
    const {
        isEmpty,
        totalUniqueItems,
        items,
        cartTotal,
        updateItemQuantity,
        removeItem,
        emptyCart
    } = useCart();

    const user = JSON.parse(localStorage.getItem('token'));
    const userItems = items.filter(item => item.user_id == user.user.id);
    useEffect(() => {
        const newTotal = userItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(newTotal);

    }, [userItems])



    useEffect(() => {
        (async () => {
            await customerServices.getDetailAccount().then(res => {
                setName(res.data.data.name);
                setEmail(res.data.data.email);
                setPhone(res.data.data.phone_number);
                res.data.address !== null && setAddress(res.data.address.address_1);
                setDataAddress(res.data.address);
                console.log(res.data);
            });
            const parsed = queryString.parse(window.location.search);
            // setPayentSuccess(parsed.vnp_ResponseCode)
            const payment_success = parsed.vnp_ResponseCode;
            if (typeof payment_success !== 'undefined' && payment_success.toString() == '00') {
                const order_id = parsed.vnp_TxnRef;
                const res = await orderServices.updateStatus(order_id, 2);
                await showNotification('Đã thanh toán thành công. Hãy theo dỗi đơn hàng !', 'success');
                // await userItems.forEach(item => {
                //     removeItem(item.id);
                // });
                await emptyCart();
                setTimeout(() => {
                    navigation('/');
                    window.location.reload();
                }, 3000);
            }
            // else if (typeof  payment_success !== 'undefined' && payment_success.toString() == '24')
            //     {
            //         const order_id = parsed.vnp_TxnRef;
            //         const res = await orderServices.updataStatus(order_id, 2);
            //         await showTrashNotification('Đã thanh toán thành công. Hãy theo dỗi đơn hàng !');
            //         await userItems.forEach(item => {
            //             removeItem(item.id);
            //         });
            //         navigation('/');
            //         window.location.reload();    

            //     }

        })();
    }, []);


    // dinh dang gia
    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };


    const [selectedOptionReceive, setSelectedOptionReceive] = useState('Giao hàng tận nơi');
    const [selectedOptionPay, setSelectedOptionPay] = useState('COD');

    const handleOptionChange = (event) => {
        setSelectedOptionReceive(event.target.value);
    };

    const handleOptionChangePay = (event) => {
        setSelectedOptionPay(event.target.value);
    };
    // userItems.map((item) => {
    //     product.push(item.id);
    //     qty.push(item.quantity);
    //     price.push(item.price);
    // })


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (phone !== '' && address !== '' && email !== '' && name !== '') {
            const order = await {
                'customer_id': user.user.id,
                'name': name,
                'note': note,
                'email': email,
                'phone': phone,
                'address': address,
                'shipping_methods': selectedOptionReceive,
                'payment_methods': selectedOptionPay,
                'status': 2,
                'order_detail': userItems,
            };
            // await userItems.forEach(item => {
            //     removeItem(item.id);
            // });
            console.log(order);
            if (selectedOptionPay === 'vnpay') {
                order.status = 1;
                const orderstore = await orderServices.createOrder(order);
                await handlePayOrder(orderstore.data.data, 'success');
            }
            else {
                const orderstore = await orderServices.createOrder(order);
                if (orderstore.data.success === true) {
                    await setIsLoading(false);
                    await showNotification(orderstore.data.message, 'success');
                    await emptyCart();
                    setTimeout(() => {
                        navigation('/');
                        window.location.reload();
                    }, 3000);
                }
                else {
                    await showNotification(orderstore.data.message, 'warning');
                    setTimeout(() => {
                        navigation('/cart');
                    }, 3000);
                }

            }
        }
        else {
            showNotification('Vui lòng nhập đầy đủ các thông tin cần thiết !', 'warning');
        }
    }

    const handlePayOrder = async (order_id) => {
        const result = await payServices.vnpay_payment({ order_id: order_id, amount: total });
        await result && window.location.replace(result.data.data);

    }

    const handleEditAddress = async (e) => {
        e.preventDefault();
        setShowForm(true);
    }

    // thong bao
    const showNotification = (message, type = 'success') => {
        let options = {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "toast-container"
        }


        switch (type) {
            case 'success':
                toast.success(message, options);
                break;
            case 'error':
                toast.error(message, options);
                break;
            case 'warning':
                toast.warn(message, options);
                break;
            case 'info':
                toast.info(message, options);
                break;
            default:
                toast(message, { ...options, type: 'custom' });
        }
    }

    //form edit address
    const [showForm, setShowForm] = useState(false);


    return (
        <section className="section-content padding-y">
            <ToastContainer />
            
            <form onSubmit={handleSubmit}>
                <div className="container" style={{ maxWidth: "720px" }}>
                    <div className="card mb-4">
                        <div className="card-body old-element">
                            <div className="text-center">
                                <h5 className="">THÔNG TIN ĐƠN HÀNG</h5>
                            </div>
                            <br />
                            <div className="cart">
                                <label>Sản phẩm:</label>
                                {userItems.map((item, index) => (
                                    <div className="row mb-3" key={index}>
                                        <div className="col-md-2">
                                            <img src={urlImage + "product/" + item.image.split(';')[0]} alt="anh san pham" style={{ width: "100%", height: "auto" }} />
                                        </div>
                                        <div className="col-md-10">
                                            <b>{item.name}</b>
                                            <br />
                                            <span className="text-danger">Giá: {formatPrice(item.price)}</span>
                                            <br />
                                            <span>Số lượng: {item.quantity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <span><b>Tổng phụ:</b> {formatPrice(total)}</span>
                            <br />
                            <br />
                            <label >Phương thức nhận hàng</label>
                            <div className="form-row">
                                <div className="form-group col-sm-6">
                                    <label className="js-check box">
                                        <input type="radio" name="dostavka" value="Giao hàng tận nơi" checked={selectedOptionReceive === 'Giao hàng tận nơi'} onChange={handleOptionChange} />
                                        <h6 className="title">Giao hàng tận nơi</h6>
                                        <p className="text-muted">Nhận hàng trong 1-2 ngày</p>
                                    </label>
                                </div>
                                <div className="form-group col-sm">
                                    <label className="js-check box">
                                        <input type="radio" name="dostavka" value="Nhận trực tiếp tại cửa hàng" checked={selectedOptionReceive === 'Nhận trực tiếp tại cửa hàng'} onChange={handleOptionChange} />
                                        <h6 className="title">Nhận trực tiếp tại cửa hàng</h6>
                                        <p className="text-muted">Nhận hàng nhanh chóng</p>
                                    </label>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col form-group">
                                    <label>Họ tên</label>
                                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" placeholder="" />
                                </div>
                                <div className="col form-group">
                                    <label>Ghi chú</label>
                                    <input value={note} onChange={(e) => setNote(e.target.value)} type="text" className="form-control" placeholder="" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="col form-group">
                                    <label>Email</label>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" placeholder="" />
                                </div>
                                <div className="col form-group">
                                    <label>Số điện thoại</label>
                                    <input value={phone} onChange={(e) => setPhone(e.target.value)} type="text" className="form-control" placeholder="" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Địa chỉ</label>
                                <button className="btn btn-outline-danger btn-sm ms-2" onClick={handleEditAddress}>Thay đổi</button>
                                <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" rows="2"></textarea>
                            </div>

                        </div>
                        {showForm ? (
                            <div className="new-element modal1">
                                <div className="modal-content">
                                    <div className="row border-bottom">
                                        <h5 className="col-11 text-center">Thay đổi địa chỉ</h5>
                                        <span className="text-danger close col-1 btn btn-sm" onClick={() => setShowForm(false)}>&times;</span>
                                    </div>
                                    <br />
                                    <div className="col-md">
                                        <label className="me-2">Địa chỉ 1:</label>
                                        <input type="radio" className="me-1" name="status" value={data_address.address_1} required onChange={(e) => setAddress(e.target.value)} />
                                        {data_address.address_1}
                                    </div>
                                    <div className="col-md">
                                        <label className="me-2">Địa chỉ 2:</label>
                                        <input type="radio" className="me-1" name="status" value={data_address.address_2} required onChange={(e) => setAddress(e.target.value)} />
                                        {data_address.address_2}
                                    </div>

                                </div>
                            </div>

                        ) : (<></>)}
                    </div>


                    <div className="card mb-4">
                        <div className="card-body">
                            <b className="mb-4">Phương thức thanh toán</b>
                            <br />
                            <br />
                            <div className="row">
                                <div className="form-group col-sm-6">
                                    <label className="js-check box">
                                        <input type="radio" name="payment" value="COD" checked={selectedOptionPay === 'COD'} onChange={handleOptionChangePay} />
                                        <h6 className="title">Thanh toán khi nhận hàng</h6>
                                        {/* <p className="text-muted">Nhận hàng trong 1-2 ngày</p>  */}
                                    </label>
                                </div>
                                <div className="form-group col-sm-6">
                                    <label className="js-check box">
                                        <input type="radio" name="vn_payment" value="vnpay" checked={selectedOptionPay === 'vnpay'} onChange={handleOptionChangePay} />
                                        <h6
                                            // onClick={() => handlePayOrder()}
                                            className="title">Thanh toán qua VNPAY
                                        </h6>
                                        {/* <p className="text-muted">Nhận hàng nhanh chóng</p> */}
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className="subscribe btn btn-primary btn-block"> Đặt hàng </button>
                        </div>
                    </div>


                    <br /><br />

                </div>
            </form>
        </section>

    );
}

export default Payment;