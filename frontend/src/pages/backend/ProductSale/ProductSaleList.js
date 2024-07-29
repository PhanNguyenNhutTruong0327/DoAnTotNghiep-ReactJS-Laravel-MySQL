import { Link, useParams } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { urlImage } from '../../../config';
import productSaleService from "../../../services/ProductSaleService";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductSaleList() {
    const [data, setData] = useState([]);
    const page = parseInt(useParams().page);
    const limit = parseInt(useParams().limit);
    const [pages, setPages] = useState(1);
    const [qty_trash, setQtyTrash] = useState(0);
    const [qty, setQty] = useState(0);
    const [tamp, setTamp] = useState();

    useEffect(() => {
        fetchData();
    }, [page, tamp]);

    const fetchData = async () => {
        try {
            const result = await productSaleService.getAll(limit, page);
            setData(result.data.products);
            setPages(result.data.page);
            setQtyTrash(result.data.qty_trash);
            setQty(result.data.qty_pro);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };

    const productTrash = async (id) => {
        try {
            const result = await productSaleService.trash(id);
            if (result.data.success === true) {
                showTrashNotification(result.data.message);
                setTamp(id);
                setTimeout(() => {
                    setTamp(0);
                }, 2000); // Hiển thị thông báo trong 5 giây
            } else {
                showErrorNotification(result.data.message);
            }
        } catch (error) {
            console.error('Error trashing product:', error);
            showErrorNotification("Có lỗi xảy ra khi thực hiện thao tác.");
        }
    };

    const showTrashNotification = (message) => {
        toast.success(message, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "toast-container",
            closeButton: true // Cho phép hiển thị nút đóng
        });
    };

    const showErrorNotification = (message) => {
        toast.error(message, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "toast-container",
            closeButton: true // Cho phép hiển thị nút đóng
        });
    };

    return (
        <div className="Card" style={{ paddingLeft: "40px" }}>
            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <strong className="text-primary">SẢN PHẨM GIẢM GIÁ<sup>({qty})</sup></strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link className="btn btn-success me-2" to={"/admin/product-sale/list-product/10/1"}>
                            <FaPlus />Thêm
                        </Link>
                        <Link className="btn text-danger" to={"/admin/product-sale/list-trash/10/1"}>
                            <FaTrash /><sup>{qty_trash}</sup>
                        </Link>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: 30 }} className="text-center">#</th>
                                <th style={{ width: 100 }} className="text-center">Hình</th>
                                <th style={{ width: 150 }} className="text-center">Tên sản phẩm</th>
                                <th style={{ width: 100 }} className="text-center">Giá</th>
                                <th style={{ width: 100 }} className="text-center">Giá giảm</th>
                                <th style={{ width: 50 }} className="text-center">Số lượng</th>
                                <th style={{ width: 100 }} className="text-center">Ngày bắt đầu</th>
                                <th style={{ width: 100 }} className="text-center">Ngày kết thúc</th>
                                <th style={{ width: 130 }} className="text-center">Chức năng</th>
                                <th style={{ width: 50 }} className="text-center">Id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((product, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="text-center">
                                        <img src={urlImage + 'product/' + product.image.split(';')[0]} alt="hinh" className="img_fluid" style={{ width: 100 }} />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{formatPrice(product.price)}</td>
                                    <td>{formatPrice(product.price_sale)}</td>
                                    <td>{product.qty_sale}</td>
                                    <td>{product.start_time}</td>
                                    <td>{product.end_time}</td>
                                    <td className="text-center">
                                        <Link className="btn btn-sm btn-success me-1" to={"/admin/product-sale/show/" + product.id}>
                                            <FaEye />
                                        </Link>
                                        <Link className="btn btn-sm btn-primary me-1" to={"/admin/product-sale/update/" + product.id_sale}>
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => productTrash(product.id)} className="btn btn-sm btn-danger">
                                            <FaTrash />
                                        </button>
                                    </td>
                                    <td className="text-center">{product.id_sale}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <ul className="pagination">
                    <li className="page-item">
                        {page > 1 ? (
                            <Link className="page-link" to={`/admin/product-sale/${limit}/${page - 1}`}>Previous</Link>
                        ) : (
                            <span className="page-link disabled">Previous</span>
                        )}
                    </li>
                    {Array.from(Array(pages).keys()).map((index) => (
                        <li
                            key={index}
                            className={`page-item ${index + 1 === page ? "active" : ""}`}
                        >
                            <Link
                                className="page-link"
                                to={`/admin/product-sale/${limit}/${index + 1}`}
                            >
                                {index + 1}
                            </Link>
                        </li>
                    ))}
                    <li className="page-item">
                        {page < pages ? (
                            <Link className="page-link" to={`/admin/product-sale/${limit}/${page + 1}`}>
                                Next
                            </Link>
                        ) : (
                            <span className="page-link disabled">Next</span>
                        )}

                    </li>
                </ul>
                <ToastContainer closeButton={false} /> {/* Đặt closeButton thành false nếu không muốn hiển thị nút đóng mặc định */}
            </div>
        </div>
    );
}

export default ProductSaleList;
