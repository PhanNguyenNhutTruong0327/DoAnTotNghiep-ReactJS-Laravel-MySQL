import { Link } from "react-router-dom";
import { useCart } from "react-use-cart";
import { useAuth } from "../../../component/Provider/AuthProvider";
import { useEffect, useState } from "react";
import { urlImage } from "../../../config";

function Cart() {
    const { token } = useAuth();
    const [total, setTotal] = useState(0);
    const {
        isEmpty,
        totalUniqueItems,
        items,
        cartTotal,
        updateItemQuantity,
        emptyCart,
        removeItem,
    } = useCart();

    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };

    const user = JSON.parse(localStorage.getItem('token'));
    const userItems = token ? items.filter(item => item.user_id === user.user.id) : [];

    useEffect(() => {
        const newTotal = userItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotal(newTotal);
    }, [userItems, items]);

    const deleteCart = () => {
        emptyCart();
    };

    return (
        <section className="section-content padding-y">
            <div className="container">
                {token == null ? (
                    <div className="row" style={{ height: "300px" }}>
                        <div className="col-md-4"></div>
                        <div className="col-md-4 text-center d-flex flex-column justify-content-center align-items-center">
                            <h6 className="">Hãy đăng nhập để mua hàng !</h6>
                            <br />
                            <Link className="btn btn-success" to={`/login`}>Đăng nhập</Link>
                        </div>
                        <div className="col-md-4"></div>
                    </div>
                ) : userItems.length === 0 ? (
                    <div className="row" style={{ height: "300px" }}>
                        <div className="col-md-4"></div>
                        <div className="col-md-4 text-center d-flex flex-column justify-content-center align-items-center">
                            <h6 className="">Không có sản phẩm nào trong giỏ hàng !</h6>
                            <br />
                            <Link className="btn btn-success" to={`/`}>Về trang chủ</Link>
                        </div>
                        <div className="col-md-4"></div>
                    </div>
                ) : (
                    <div className="row">
                        <main className="col-md-9">
                            <div className="card">
                                <table className="table table-borderless table-shopping-cart">
                                    <thead className="text-muted">
                                        <tr className="small text-uppercase">
                                            <th scope="col" className="text-center">Sản phẩm</th>
                                            <th scope="col" width="120" className="text-center">Số lượng</th>
                                            <th scope="col" width="120" className="text-center">Giá</th>
                                            <th scope="col" className="text-right">
                                                <button className="btn btn-danger btn-sm" onClick={() => deleteCart()}>
                                                    Làm trống
                                                </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userItems.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <figure className="itemside">
                                                        <div className="aside">
                                                            <img src={urlImage + 'product/' + item.image.split(';')[0]} className="img-sm" style={{ height: "80px", width: "80px" }} alt={item.product_name} />
                                                        </div>
                                                        <figcaption className="info">
                                                            <Link to={`/san-pham/chi-tiet-san-pham/${item.slug}`} className="title text-dark">{item.product_name}</Link>
                                                            <p className="text-muted small">
                                                                Hãng: {item.brand_name}
                                                            </p>
                                                        </figcaption>
                                                    </figure>
                                                </td>
                                                <td>
                                                    <div className="btn-group" role="group" aria-label="Basic example" style={{ height: "40px" }}>
                                                        <button type="button" className="btn btn-light" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
                                                        <h6 className="btn btn-light" style={{ width: "50px", height: "100%" }}>{item.quantity}</h6>
                                                        <button type="button" className="btn btn-light" onClick={() => updateItemQuantity(item.id, item.quantity + 1 < 5 ? item.quantity + 1 : 5)}>+</button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="price-wrap">
                                                        <var className="price pt-2 mt-1">{formatPrice(item.price)}</var>
                                                    </div>
                                                </td>
                                                <td className="text-right">
                                                    <button onClick={() => removeItem(item.id)} className="btn btn-light ml-2 text-danger">Xóa</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="card-body border-top">
                                    <Link to="/" className="btn btn-light">
                                        <i className="fa fa-chevron-left"></i> Tiếp tục mua hàng
                                    </Link>
                                </div>
                            </div>

                            <div className="alert alert-success mt-3" style={{ backgroundColor: "#ccf0d1", borderColor: "#ccf0d1" }}>
                                <p className="icontext" style={{ color: "#005e0c" }}><i className="icon text-success fa fa-truck"></i> Miễn phí đổi trả</p>
                            </div>
                        </main>

                        <aside className="col-md-3">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <form>
                                        <div className="form-group">
                                            <label>Have Voucher?</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" name="" placeholder="Mã Phiếu Mua Hàng" style={{ height: "40px" }} />
                                                <span className="input-group-append">
                                                    <button className="btn btn-info">ÁP DỤNG</button>
                                                </span>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <dl className="dlist-align">
                                        <dt>Tổng phụ:</dt>
                                        <dd className="text-right">{formatPrice(total)}</dd>
                                    </dl>
                                    <dl className="dlist-align">
                                        <dt>Tổng cộng:</dt>
                                        <dd className="text-right h5"><strong>{formatPrice(total)}</strong></dd>
                                    </dl>
                                    <hr />
                                    <p className="text-center mb-3">
                                        <Link to="/payment" className="btn btn-primary">Đặt hàng</Link>
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Cart;
