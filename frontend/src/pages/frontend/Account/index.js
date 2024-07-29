import { Link } from "react-router-dom";
import { useAuth } from "../../../component/Provider/AuthProvider";
import { Suspense, useEffect, useState } from "react";
import img_avt from "../../../assets/frontend/images/avatars/avt4.jpg";
import { urlImage } from "../../../config";
import customerServices from "../../../services/CustomerService";
import Menu_Account from "../../../component/frontend/Menu_Account";
import orderServices from "../../../services/OrderService";

function Account() {
    const currentTime = new Date().toISOString();

    const [data, setData] = useState({});

    const { token, setToken } = useAuth();

    const [orders, setOrders] = useState([]);
    const [address, setAddress] = useState();
    const [qty, setQty] = useState(0);
    const [qty_delivered, setQtyDelivered] = useState(0);
    const [qty_are_delivery, setQtyAreDelivery] = useState(0);
    const [qty_favourite, setQtyfavourite] = useState(0);
    const tokenExpiresAt = JSON.parse(localStorage.getItem('token'));


    useEffect(() => {
        (async () => {
            if (token) {
                if (tokenExpiresAt.token_expires_at > currentTime) {
                    await customerServices.getDetailAccount().then(res => {
                        setData(res.data.data);
                        setAddress(res.data.address);
                    })

                    await orderServices.qtyOrder(tokenExpiresAt.user.id).then(res => {
                        setQtyAreDelivery(res.data.qty_are_delivery);
                        setQtyDelivered(res.data.qty_delivered);
                        setQty(res.data.qty);
                    })
                }
                else {
                    alert('Tài khoản hết hiệu lực. Cần đăng nhập lại !');
                }
            }
        })()
    }, [])




    return (
        <div className="">
            <section className="section-pagetop bg-gray" >
                <div className="container">
                    <h3 className="title-page">Tài khoản của tôi</h3>
                </div>
            </section>
            {Object.keys(data).length !== 0 ? (<section className="section-content padding-y">
                <div className="container">

                    <div className="row">

                        <Menu_Account />
                        <main className="col-md-9">

                            <article className="card mb-3">
                                <div className="card-body">

                                    <figure className="icontext">
                                        <div className="icon">
                                            <img className="rounded-circle img-sm border" src={img_avt} style={{ height: "80px", width: "80px" }} />
                                        </div>
                                        <div className="text">
                                            <strong> {data.name} </strong> <br />
                                            <p className="mb-2">{data.email} </p>
                                        </div>
                                    </figure>
                                    <hr />
                                    {address ? (
                                        <>
                                        <p>
                                            <i className="fa fa-map-marker text-muted"></i> &nbsp; <b>Địa chỉ mặc định: </b>{address.address_1}
                                            <Link to={`/tai-khoan/dia-chi/1`} className=" ms-3 btn btn-outline-danger btn-sm">Chỉnh sửa</Link>
                                        </p>
                                        <p>
                                        <i className="fa fa-map-marker text-muted"></i> &nbsp; <b>Địa chỉ khác: </b>{address.address_2}
                                        <Link to={`/tai-khoan/dia-chi/2`} className=" ms-3 btn btn-outline-danger btn-sm">Chỉnh sửa</Link>
                                    </p>
                                    </>
                                    ) : (
                                        <div className="text-center">
                                            <h6>
                                                Hãy thêm địa chỉ để cửa hàng giao hàng tận nơi cho bạn !
                                            </h6>
                                            <Link to={`/tai-khoan/them-dia-chi`} className="btn btn-success btn-sm">Thêm ngay</Link>
                                            <br />
                                            <br />

                                        </div>

                                    )}

                                    <article className="card-group card-stat">
                                        <figure className="card bg">
                                            <div className="p-3">
                                                <h4 className="title">{qty}</h4>
                                                <span>Đơn hàng</span>
                                            </div>
                                        </figure>
                                        <figure className="card bg">
                                            <div className="p-3">
                                                <h4 className="title">{qty_favourite}</h4>
                                                <span>Danh sách yêu thích</span>
                                            </div>
                                        </figure>
                                        <figure className="card bg">
                                            <div className="p-3">
                                                <h4 className="title">{qty_are_delivery}</h4>
                                                <span>Chờ giao hàng</span>
                                            </div>
                                        </figure>
                                        <figure className="card bg">
                                            <div className="p-3">
                                                <h4 className="title">{qty_delivered}</h4>
                                                <span>Đã giao</span>
                                            </div>
                                        </figure>
                                    </article>
                                </div>
                            </article>
                            {orders.length > 0 && (<article className="card  mb-3">
                                <div className="card-body">
                                    <h5 className="card-title mb-4">Đơn hàng đã giao gần đây</h5>
                                    <br />
                                    <br />
                                    <div className="row">
                                        {orders.map((item, index) => {
                                            return (
                                                <div className="col-md-6" key={index}>
                                                    <figure className="itemside  mb-3">
                                                        <div className="aside"><img src={urlImage + 'product/' + item.image} className="border img-sm" style={{ height: "80px", width: "80px" }} /></div>
                                                        <figcaption className="info">
                                                            <time className="text-muted"><i className="fa fa-calendar-alt me-1"></i>
                                                                {item.created_at}</time>
                                                            <p>{item.name} </p>
                                                            <span className="text-success">Xác nhận đặt hàng</span>
                                                        </figcaption>
                                                    </figure>
                                                </div>

                                            )
                                        })}
                                    </div>
                                    <Link href="#" className="btn btn-outline-primary btn-block"> Xem tất cả các đơn hàng <i
                                        className="fa fa-chevron-down"></i> </Link>
                                </div>
                            </article>
                            )}

                        </main>

                    </div>

                </div>
            </section>
            ) : (
                <section className="section-content padding-y">

                        <div className="container">
                            <div className="text-center">
                                <h6>Vui lòng đăng nhập tài khoản !</h6>
                            </div>
                        </div>

                </section>
            )}
        </div>
    );

}
export default Account;