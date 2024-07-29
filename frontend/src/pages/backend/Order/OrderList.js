import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./order.css";
import orderServices from "../../../services/OrderService";
import Notification, { showNotification } from '../Notificatio'; // Import Notification và hàm showNotification

function OrderList() {
    const { page } = useParams('page');
    const { limit } = useParams('limit');
    const [data, setData] = useState([]);
    const [pages, setPages] = useState(1);
    const [qtyData, setQtyData] = useState(0);
    const [qtyCancel, setQtyCancel] = useState(0);
    const [tamp, setTamp] = useState();

    useEffect(() => {
        orderServices.getAll(limit, page).then((res) => {
            try {
                console.log(res.data);
                console.log(res.data.orders);
                const numberOfPages = res.data.page_end;
                setPages(numberOfPages);
                setData(res.data.orders);

                setQtyData(res.data.qty_order);
                setQtyCancel(res.data.qty_cancel);
            } catch (e) {
                console.log(e);
            }
            setTamp();
        });
    }, [tamp, page]);

    const [showForm, setShowForm] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const showStatusForm = (orderId) => {
        setSelectedOrderId(orderId);
        setShowForm(true);
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        const selectedStatus = document.querySelector('input[name="status"]:checked').value;
        const data = {
            status: selectedStatus
        };
        await orderServices.updateStatusOrder(data, selectedOrderId).then((res) => {
            if (res.data.success === true) {
                showNotification(res.data.message,'success');
                setShowForm(false);
                setTamp(selectedOrderId);
            } else {
                showNotification(res.data.message, 'error');
            }
        });
    };

    return (
        <div className="content-wrapper">
            <Notification />
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        {/* <div className="col-sm-10">
                            <h6 className="d-inline">Tất cả đơn hàng <sup>({qtyData})</sup></h6>
                        </div> */}
                        <div className="col-sm-2 text-right">
                            {/* <Link className="action-btn btn" to="/admin/orders/cancel/1/10" style={{ color: "red" }}>
                                Đơn hủy
                                <sup className="count ms-1">{qtyCancel}</sup>
                            </Link> */}
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">

                <div className="card">

                    <div className="pt-2 pe-4">
                        
                    </div>
                    <div className="card-body">
                        
                        <div className="row content">
                        <div className="">
                            <strong className="text-primary">ĐƠN HÀNG<sup>({qtyData})</sup></strong>
                        </div>
                            <div className="col-md old-element">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ width: "30px" }}>
                                                <input type="checkbox" />
                                            </th>
                                            <th>Id</th>
                                            <th style={{ width: "260px" }}>Tên khách hàng</th>
                                            <th>Email</th>
                                            <th>Sđt</th>
                                            <th>Phương thức nhận hàng</th>
                                            <th>Phương thức thanh toán</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr className="datarow" key={index}>
                                                <td>
                                                    <input type="checkbox" />
                                                </td>
                                                <td>{item.id}</td>
                                                <td>
                                                    <div className="name">
                                                        {item.name}
                                                    </div>
                                                    <div className="function_style">
                                                        <Link to={`/admin/order/show/${item.id}`} className="btn btn-sm"><i className="fa fa-eye me-1"></i>Chi tiết</Link> |
                                                        <button onClick={() => showStatusForm(item.id)} className="btn btn-sm"><i className="fa fa-edit me-1"></i>Cập nhật trạng thái</button>
                                                    </div>
                                                </td>
                                                <td>{item.email}</td>
                                                <td>{item.phone}</td>
                                                <td>{item.shipping_methods}</td>
                                                <td>{item.payment_methods}</td>
                                                <td>{item.status === 1 ? "Đang chờ xử lý" : item.status === 2 ? "Đang chờ xác nhận đơn hàng" : item.status === 3 ? "Đang chuẩn bị đơn hàng" : item.status === 4 ? "Đang vận chuyển đơn hàng" : "Đã giao hàng"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {showForm && (
                                <div className="new-element modal1">
                                    <div className="modal-content">
                                        <div className="row">
                                            <h4 className="col-11">Cập nhật trạng thái</h4>
                                            <span className="text-danger close col-1 btn btn-sm" onClick={() => setShowForm(false)}>&times;</span>
                                        </div>
                                        <br />
                                        <div className="col-6"></div>
                                        <form onSubmit={handleStatusUpdate}>
                                            {/* <label className="me-4">
                                                <input type="radio" className="me-1" name="status" value="1" required />
                                                Đang chờ xử lý
                                            </label>
                                            <label className="me-4">
                                                <input type="radio" className="me-1" name="status" value="2" required />
                                                Đang chờ xác nhận đơn hàng
                                            </label> */}
                                            <label className="me-4">
                                                <input type="radio" className="me-1" name="status" value="3" required />
                                                Đang chuẩn bị đơn hàng
                                            </label>
                                            <label className="me-4">
                                                <input type="radio" className="me-1" name="status" value="4" required />
                                                Đang vận chuyển đơn hàng
                                            </label>
                                            <label className="me-4">
                                                <input type="radio" className="me-1" name="status" value="5" required />
                                                Giao hàng thành công
                                            </label>
                                            <label className="me-4">
                                                <input type="radio" className="me-1" name="status" value="0" required />
                                                Hủy đơn
                                            </label>
                                            <br />
                                            <button type="submit" className="btn btn-primary">
                                                Lưu
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                            <ul className="pagination">
                                <li className="page-item">
                                    {page > 1 ? (
                                        <Link className="page-link" to={`/admin/orders/${page - 1}/${limit}`}>Previous</Link>
                                    ) : (
                                        <span className="page-link disabled">Previous</span>
                                    )}
                                </li>
                                {Array.from(Array(pages).keys()).map((index) => (
                                    <li key={index} className={`page-item ${index + 1 === parseInt(page) ? "active" : ""}`}>
                                        <Link className="page-link" to={`/admin/orders/${index + 1}/${limit}`}>
                                            {index + 1}
                                        </Link>
                                    </li>
                                ))}
                                <li className="page-item">
                                    {page < pages ? (
                                        <Link className="page-link" to={`/admin/orders/${parseInt(page) + 1}/${limit}`}>
                                            Next
                                        </Link>

                                    ) : (
                                        <span className="page-link disabled">Next</span>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default OrderList;
