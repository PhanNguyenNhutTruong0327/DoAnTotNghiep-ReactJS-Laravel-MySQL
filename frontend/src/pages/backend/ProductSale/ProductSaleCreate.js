import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { urlImage } from "../../../config";
import productServices from "../../../services/ProductService";
import productSaleService from "../../../services/ProductSaleService";
import sellService from "../../../services/SaleService";
import Notification, { showNotification } from "../Notificatio";

function ProductSaleCreate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState([]);
    const [sales, setSales] = useState([]);
    const [status, setStatus] = useState(1);
    const [start_time, setStartTime] = useState('');
    const [end_time, setEndTime] = useState('');
    const [qty, setQty] = useState(1);
    const [sale_id, setSaleId] = useState(1);
    const [image, setImage] = useState('');
    useEffect(() => {
        async function fetchData() {
            try {
                const productResult = await productServices.getById(id);
                setProduct(productResult.data.products);
                setImage(productResult.data.products.image.split(';')[0]);
                const salesResult = await sellService.getListSale();
                setSales(salesResult.data.sells);
            } catch (error) {
                console.error('Error fetching product or sales:', error);
            }
        }
        fetchData();
    }, [id]);

    async function productSaleStore(event) {
        event.preventDefault();
        if (start_time !== '' && end_time !== '') {
            var data = new FormData();
            data.append("product_id", id);
            data.append("sale_id", sale_id);
            data.append("start_time", start_time);
            data.append("end_time", end_time);
            data.append("status", status);
            data.append("qty", qty);

            try {
                const res = await productSaleService.create(data);
                if (res.data.data !== null) {
                    showNotification(res.data.message, 'success');
                    setTimeout(() => {
                        navigate('/admin/product-sale/10/1', { replace: true });
                    }, 5000);
                } else {
                    showNotification('Thêm dữ liệu không thành công !', 'error');
                }
            } catch (error) {
                console.error('Error creating product sale:', error);
                showNotification('Có lỗi xảy ra khi thêm sản phẩm giảm giá!', 'error');
            }
        } else {
            showNotification('Vui lòng nhập đầy đủ thông tin!', 'error');
        }
    }

    return (
        <>
            <Notification />
            <form onSubmit={productSaleStore} method="post">
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <strong className="text-danger">THÊM SẢN PHẨM GIẢM GIÁ</strong>
                            </div>
                            <div className="col-md-6 text-end">
                                <Link to="/admin/product-sale/10/1" className="btn btn-sm btn-info me-3">
                                    Quay lại
                                </Link>
                                <button className="btn btn-sm btn-success" type="submit">Lưu</button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4"></div>
                            <div className="col-md-4">
                                <div className="mb">
                                    <h6 htmlFor="name">Sản phẩm: {product.name}</h6>
                                    <br />
                                    <img src={urlImage + "product/" + image} style={{ width: 150 }} alt={product.name} />
                                    <br />
                                    <span>Số lượng: {product.qty}</span>
                                </div>
                                <br />
                                <div className="mb-3">
                                    <label htmlFor="sale_id">Chủ đề sale</label>
                                    <select
                                        name="sale_id"
                                        className="form-control"
                                        value={sale_id}
                                        onChange={(e) => setSaleId(e.target.value)}
                                    >
                                        <option value="0">None</option>
                                        {sales.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="start_time">Thời gian bắt đầu</label>
                                    <input
                                        type="date"
                                        name="start_time"
                                        className="form-control"
                                        value={start_time}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="end_time">Thời gian kết thúc</label>
                                    <input
                                        type="date"
                                        name="end_time"
                                        className="form-control"
                                        value={end_time}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="qty">Số lượng sale</label>
                                    <input
                                        type="number"
                                        name="qty"
                                        className="form-control"
                                        value={qty}
                                        onChange={(e) => setQty(e.target.value)}
                                        min={1}
                                        max={product.qty}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="status">Trạng thái</label>
                                    <select
                                        name="status"
                                        className="form-control"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="1">Xuất bản</option>
                                        <option value="2">Chưa xuất bản</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default ProductSaleCreate;
