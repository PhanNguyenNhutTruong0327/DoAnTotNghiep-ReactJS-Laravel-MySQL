import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { urlImage } from "../../../config";
import { format, parseISO } from "date-fns";
import productSaleService from "../../../services/ProductSaleService";
import sellService from "../../../services/SaleService";
import "react-toastify/dist/ReactToastify.css";

function ProductSaleUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState([]);
    const [sales, setSales] = useState([]);

    const [status, setStatus] = useState(1);
    const [start_time, setStartTime] = useState("");
    const [end_time, setEndTime] = useState("");
    const [qty, setQty] = useState(1);
    const [sale_id, setSaleId] = useState(1);
    const [percent_sale, setPercentSale] = useState(0);
    const [image, setImage] = useState("");
    useEffect(() => {
        (async () => {
            try {
                const productResult = await productSaleService.getDeatil(id);
                const productData = productResult.data.product;
                setProduct(productData);
                setSaleId(productData.sale_id);
                const startTime = parseISO(productData.start_time);
                setStartTime(format(startTime, "yyyy-MM-dd"));
                const endTime = parseISO(productData.end_time);
                setEndTime(format(endTime, "yyyy-MM-dd"));
                setQty(productData.qty);
                setStatus(productData.status);
                setImage(productData.image.split(';')[0]);
                const salesResult = await sellService.getListSale();
                setSales(salesResult.data.sells);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        })();
    }, [id]);

    async function productSaleStore(event) {
        event.preventDefault();
        if (start_time !== "" && end_time !== "") {
            var data = new FormData();
            data.append("sale_id", sale_id);
            data.append("start_time", start_time);
            data.append("end_time", end_time);
            data.append("status", status);
            data.append("qty", qty);

            try {
                const res = await productSaleService.update(data, id);
                if (res.data.data !== null) {
                    showSuccessNotification(res.data.message);
                    setTimeout(() => {
                        navigate("/admin/product-sale/10/1", { replace: true });
                    }, 2000); // Chuyển hướng sau khi hiển thị thông báo thành công trong 5 giây

                } else {
                    showErrorNotification("Thêm dữ liệu không thành công !");
                }
            } catch (error) {
                console.error("Error updating product sale:", error);
                showErrorNotification("Có lỗi xảy ra khi cập nhật sản phẩm giảm giá.");
            }
        } else {
            showErrorNotification("Vui lòng nhập đầy đủ thông tin !");
        }
    }

    const showSuccessNotification = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const showErrorNotification = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <form onSubmit={productSaleStore} method="post">
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6">
                            <strong className="text-danger">CẬP NHẬT SẢN PHẨM GIẢM GIÁ</strong>
                        </div>
                        <div className="col-md-6 text-end">
                            <Link to="/admin/product-sale/10/1" className="btn btn-sm btn-info me-3">
                                Quay lại
                            </Link>
                            <button className="btn btn-sm btn-success" type="submit">
                                Lưu
                            </button>
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
                                <img src={urlImage + "product/" + image} style={{ width: 150 }} />
                                <br />
                                <br />
                                <div className="row">
                                    <span className="col-md-6">Số lượng còn: {product.qty_pro - product.qty_pro_sold}</span>
                                    <span className="col-md-6">Giá: {product.price}</span>

                                </div>
                                <br />
                                {/* <span>Giá sau khi giảm: {product.price}</span> */}
                            </div>
                            <br />
                            <div className="mb-3">
                                <label htmlFor="brand_id">Chủ đề sale</label>
                                <select
                                    name="brand_id"
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
                                <br />
                                <label htmlFor="name">Thời gian bắt đầu</label>
                                <input
                                    type="date"
                                    name="name"
                                    className="form-control"
                                    value={start_time}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <br />
                                <label htmlFor="name">Thời gian kết thúc</label>
                                <input
                                    type="date"
                                    name="name"
                                    value={end_time}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <br />
                                <label htmlFor="name">Số lượng sale</label>
                                <input
                                    type="number"
                                    name="name"
                                    value={qty}
                                    onChange={(e) => setQty(e.target.value)}
                                    className="form-control"
                                    min={1}
                                    max={product.qty_pro}
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
            <ToastContainer />
        </form>
    );
}

export default ProductSaleUpdate;
