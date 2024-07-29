import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../component/Provider/AuthProvider";
import orderServices from "../../../services/OrderService";
import { urlImage } from "../../../config";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./orderreview.css";
import reviewServices from "../../../services/ReviewServiec";
import Menu_Account from "../../../component/frontend/Menu_Account";

// Import font base64
import { font } from "./ArialUnicodeMS-normal";

function Order() {
    const [data, setData] = useState([]);
    const { token, setToken } = useAuth();
    const { page, limit } = useParams();
    const [tamp, setTamp] = useState();
    const [notification, setNotification] = useState(null);

    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };

    const user = JSON.parse(localStorage.getItem('token'));

    // Đăng ký phông chữ và thực hiện render lại khi có thay đổi
    useEffect(() => {
        // Đăng ký phông chữ
        jsPDF.API.events.push(['addFonts', () => {
            jsPDF.API.addFileToVFS('ArialUnicodeMS-normal.ttf', font);
            jsPDF.API.addFont('ArialUnicodeMS-normal.ttf', 'ArialUnicodeMS', 'normal');
        }]);

        // Render lại khi có thay đổi
        (async () => {
            await orderServices.getRecentOrders(user.user.id, limit, page).then((res) => {
                setData(res.data.data);
            });
        })();
        setTamp();
    }, [tamp, limit, page, user.user.id]);

    const handleLogout = () => {
        setToken(null);
    };

    const exportToPDF = (order) => {
        const doc = new jsPDF();
        let y = 15;

        // Sử dụng font đã đăng ký
        doc.setFont("ArialUnicodeMS");

        doc.setFontSize(20);
        doc.text("Receipt", 105, y, null, null, "center");
        y += 10;

        doc.setFontSize(12);
        doc.text(`Date of order: ${order.created_at}.`, 15, y);
        y += 10;
        doc.text(`Name: ${order.name}.`, 15, y);
        y += 10;
        doc.text(`Phone: ${order.phone}.`, 15, y);
        y += 10;
        doc.text(`Email: ${order.email}.`, 15, y);
        y += 10;
        doc.text(`Address: ${order.address}.`, 15, y);
        y += 10;

        // Tạo một mảng chứa thông tin sản phẩm
        const tableRows = order.products.map((product, index) => {
            return [
                index + 1,
                product.name,
                product.qty,
                formatPrice(product.price),
                formatPrice(product.price * product.qty)
            ];
        });

        // In bảng sản phẩm
        doc.autoTable({
            startY: y,
            head: [['#', 'Name Product', 'Quantity', 'Unit price', 'Into money']],
            body: tableRows,
        });

        // Tính toán tổng
        const shippingFee = 56;
        const totalAmount = order.total_order_amount + shippingFee;
        y = doc.lastAutoTable.finalY + 10;

        doc.text(`Subtotal: ${formatPrice(order.total_order_amount)}.`, 15, y);
        y += 10;
        doc.text(`Transport fee: ${formatPrice(shippingFee)}.`, 15, y);
        y += 10;
        doc.text(`Total: ${formatPrice(totalAmount)}.`, 15, y);

        // Lưu file
        doc.save(`hoa-don-${order.name}-${order.id}.pdf`);
    };

    const [showForm, setShowForm] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [selectedRating, setSelectedRating] = useState(0);

    const showStatusForm = (product_id, image, name) => {
        setSelectedOrderId(product_id);
        setName(name);
        setImage(image);
        setShowForm(true);
    };

    const handleReview = async (e) => {
        e.preventDefault();
        const image_1 = document.querySelector("#image_1");
        const image_2 = document.querySelector("#image_2");
        const image_3 = document.querySelector("#image_3");

        const data = new FormData();
        data.append("product_id", selectedOrderId);
        data.append("customer_id", user.user.id);
        data.append("content", content);
        data.append("image_1", image_1.files.length === 0 ? "" : image_1.files[0]);
        data.append("image_2", image_2.files.length === 0 ? "" : image_2.files[0]);
        data.append("image_3", image_3.files.length === 0 ? "" : image_3.files[0]);
        data.append("qty_star", selectedRating);
        data.append("status", 1);

        await reviewServices.addReviewProduct(data).then(res => {
            if (res.data.data !== null) {
                setShowForm(false);
                setNotification('Cảm ơn bạn đã chia sẻ cảm nhận về sản phẩm !');
            }
            else {
                setNotification('Đã xảy ra lỗi. Hãy thử lại sau !');
            }
        })

    }

    const handlerCancelOrder = async (order_id) => {
        await orderServices.updateStatusOrder({ status: 0 }, order_id).then(res => {
            if (res.data.success === true) {
                setNotification("Đã hủy đơn hàng thành công !");
                setTamp(order_id);
                // Clear notification after 3 seconds
                setTimeout(() => {
                    setNotification(null);
                }, 3000);
            }
            else {
                setNotification('Đã xảy ra lỗi. Hãy thử lại sau');
            }
        })
    }

    return (
        <div className="">
            <section className="section-pagetop bg-gray">
                <div className="container">
                    <h3 className="title-page">Tài khoản của tôi</h3>
                </div>
            </section>
            {data.length > 0 ? (
                <section className="section-content padding-y">
                    <div className="container">
                        <div className="row">
                            <Menu_Account />
                            <main className="col-md-9 old-element">
                                {data.map((item, index) => (
                                    <div className="col-md-9" key={index}>
                                        <article className="card mb-4">
                                            <header className="card-header">
                                                <p className="float-right text-success">
                                                    {item.status === 3 ? "Người bán đang chuẩn bị hàng" : item.status === 2 ? "Đang chờ xác nhận đơn hàng" : item.status === 0 ? "Đã hủy" : item.status === 4 ? "Đang giao hàng" : "Đã giao hàng"}
                                                </p>
                                                <strong className="d-inline-block mr-3">Order ID: {item.id}</strong>
                                                <br />
                                                <span>Ngày đặt hàng: {item.created_at}</span>
                                            </header>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <h6 className="text-muted">Chuyển tới</h6>
                                                        <p>{item.name} <br />
                                                            Sđt: {item.phone} <br />Email: {item.email} <br />
                                                            Địa chỉ: {item.address}<br />
                                                        </p>
                                                    </div>
                                                    <div className="col-md-4">
                                                        {item.payment_method != 'COD' ? (
                                                            <>
                                                                <h6 className="text-muted">Payment</h6>
                                                                <span className="text-success">
                                                                    <i className="fab fa-lg fa-cc-visa"></i>
                                                                    Visa **** 4216
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                            </>
                                                        )}
                                                        <p>Tổng phụ: {formatPrice(item.total_order_amount)} <br />
                                                            Phí vận chuyển: {formatPrice(56)} <br />
                                                            <span className="b">Tổng: {formatPrice(item.total_order_amount + 56)}</span>
                                                        </p>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-6"></div>
                                                        <div className="col-md-6 text-right">
                                                            {(item.status === 1 || item.status === 2 || item.status === 3) && (
                                                                <button onClick={() => handlerCancelOrder(item.id)} className="btn btn-outline-primary me-1">Hủy đơn</button>
                                                            )}
                                                            {item.status !== 0 && (
                                                                <button onClick={() => exportToPDF(item)} className="btn btn-outline-primary me-1">Xuất hóa đơn</button>
                                                            )}
                                                            {item.status === 0 && item.payment_method !== 'COD' ? (
                                                                <span className="text-success">Tiền của bạn sẽ được hoàn về tài khoản trong vòng 24h.</span>
                                                            ) : (<></>)}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <tbody>
                                                        {item.products.map((pro, index) => (
                                                            <tr key={index}>
                                                                <td width="65">
                                                                    <img src={urlImage + 'product/' + pro.image.split(';')[0]} className="img-xs border" alt={pro.name} />
                                                                </td>
                                                                <td>
                                                                    <p className="title mb-0">{pro.name}</p>
                                                                    <var className="price text-muted">{formatPrice(pro.price)}</var>
                                                                </td>
                                                                <td>Số lượng: {pro.qty}</td>
                                                                <td width="250">
                                                                    {item.status === 5 && (
                                                                        <button onClick={() => showStatusForm(pro.id, pro.image, pro.name)} className="btn btn-outline-primary me-1">Đánh giá</button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </article>
                                    </div>
                                ))}
                            </main>
                            {showForm && (
                                <div className="new-element modal1">
                                    <div className="modal-content">
                                        <div className="row border-bottom">
                                            <h4 className="col-11 text-center">Đánh giá sản phẩm</h4>
                                            <span className="text-danger close col-1 btn btn-sm" onClick={() => setShowForm(false)}>&times;</span>
                                        </div>
                                        <br />
                                        <div className="text-center">
                                            <div className="">
                                                <img src={urlImage + "product/" + image.split(';')[0]} alt="anh.jpg" width="100" />
                                                <br />
                                                <br />
                                                <div className="title">
                                                    <b>{name}</b>
                                                </div>
                                            </div>
                                        </div>
                                        <br />
                                        <form onSubmit={handleReview} className="row">
                                            <div className="col-md-3"></div>
                                            <div className="col-md-4">
                                                <div class="rating">
                                                    {[5, 4, 3, 2, 1].map((rating) => (
                                                        <>
                                                            <input type="radio" id={`star${rating}`} name="rate" value={rating} onClick={(e) => setSelectedRating(e.target.value)} />
                                                            <label for={`star${rating}`} title="text"
                                                            ><svg
                                                                viewBox="0 0 576 512"
                                                                height="1em"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                class="star-solid"
                                                            >
                                                                    <path
                                                                        d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
                                                                    ></path></svg
                                                                ></label>
                                                        </>
                                                    ))}



                                                </div>

                                            </div>
                                            <br />
                                            <label className="">
                                                <textarea rows="3" type="text" className="" name="status" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Mời bạn chia sẻ thêm cảm nhận..." style={{ width: "100%", padding: "5px", borderRadius: "10px" }} />
                                            </label>
                                            <div className="mb-3">
                                                <label>Gửi hình ảnh thực tế </label>  (Không bắt buộc)
                                                <input id="image_1" type="file" name="image" className="form-control" />
                                                <br />
                                                <input id="image_2" type="file" name="image" className="form-control" />
                                                <br />
                                                <input id="image_3" type="file" name="image" className="form-control" />
                                            </div>
                                            <br />
                                            <button type="submit" className="btn btn-primary">
                                                Gửi đánh giá
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </section>
            ) : (
                <section className="section-content padding-y">
                    <div className="container">
                        <div className="row">
                            <aside className="col-md-3">
                                <nav className="list-group">
                                    <Link className="list-group-item active text-white" style={{ background: "#ff6a00", borderColor: "#ff6a00" }} to="/tai-khoan">Tổng quan</Link>
                                    <Link className="list-group-item" to={`/tai-khoan/don-hang`}> Đơn hàng</Link>
                                    <Link className="list-group-item" to={`/tai-khoan/cai-dat`}> Cài đặt</Link>
                                    <button className="list-group-item text-left" onClick={handleLogout}> Đăng xuất </button>
                                </nav>
                            </aside>
                            <main className="col-md-9">
                                <div className="col-md-9">
                                    <p className="text-center">Bạn chưa có đơn hàng nào !</p>
                                </div>
                            </main>
                        </div>
                    </div>
                </section>
            )}
            {/* Thông báo */}
            {notification && (
                <div className="alert alert-success text-center fixed-bottom mb-0" role="alert">
                    {notification}
                </div>
            )}
        </div>
    );
}

export default Order;
