import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaRedoAlt, FaEye, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { urlImage } from '../../../config';
import productSaleService from "../../../services/ProductSaleService";

function ProductSaleTrash() {
    const [data, setData] = useState([]);
    const page = parseInt(useParams().page);
    const limit = parseInt(useParams().limit);
    const [pages, setPages] = useState(1);
    const [qtyTrash, setQtyTrash] = useState(0);
    const [tamp, setTamp] = useState();

    useEffect(() => {
        (async () => {
            try {
                const result = await productSaleService.getListTrash(limit, page);
                setData(result.data.products);
                setPages(result.data.pages);
                setQtyTrash(result.data.qty_trash);
            } catch (error) {
                console.error('Error fetching products from trash:', error);
            }
        })();
        setTamp();
    }, [page, limit, tamp]);

    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };

    const showNotification = (message, type) => {
        switch (type) {
            case 'success':
                toast.success(message, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    className: "toast-container"
                });
                break;
            case 'error':
                toast.error(message, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    className: "toast-container"
                });
                break;
            default:
                break;
        }
    };

    const recoverTrash = (id) => {
        productSaleService.rescoverTrash(id)
            .then((result) => {
                if (result.data.success === true) {
                    showNotification(result.data.message, 'success');
                    setTamp(id);
                } else {
                    showNotification(result.data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error recovering product from trash:', error);
                showNotification('Có lỗi xảy ra khi khôi phục sản phẩm.', 'error');
            });
    };

    const deleteProduct = (id) => {
        productSaleService.remove(id)
            .then((result) => {
                if (result.data.success === true) {
                    showNotification(result.data.message, 'success');
                    setTamp(id);
                } else {
                    showNotification(result.data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                showNotification('Có lỗi xảy ra khi xóa sản phẩm.', 'error');
            });
    };

    return (
        <div className="card" style={{ paddingLeft: "40px" }}>
            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <strong className="text-primary">Thùng rác <sup>({qtyTrash})</sup></strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link to="/admin/product-sale/10/1" className="btn btn-sm btn-outline-success me-1">
                            Về Danh Sách
                        </Link>
                    </div>
                </div>
            </div>
            {data.length > 0 ? (
                <>
                    <div className="card-body">
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: 30 }} className="text-center">#</th>
                                    <th style={{ width: 80 }} className="text-center">Hình</th>
                                    <th style={{ width: 150 }} className="text-center">Tên sản phẩm</th>
                                    <th style={{ width: 100 }} className="text-center">Giá</th>
                                    <th style={{ width: 100 }} className="text-center">Giá giảm</th>
                                    <th style={{ width: 100 }} className="text-center">Số lượng</th>
                                    <th style={{ width: 100 }} className="text-center">Ngày bắt đầu</th>
                                    <th style={{ width: 100 }} className="text-center">Ngày kết thúc</th>
                                    <th style={{ width: 130 }} className="text-center">Chức năng</th>
                                    <th style={{ width: 30 }} className="text-center">ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((product, index) => (
                                    <tr key={index}>
                                        <td className="text-center"><input type="checkbox" /></td>
                                        <td className="text-center">
                                            <img src={urlImage + 'product/' + product.image.split(';')[0]} alt="hinh" className="img-fluid" style={{ width: 100 }} />
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
                                            <button className="btn btn-sm btn-warning me-1" onClick={() => recoverTrash(product.id)}>
                                                <FaRedoAlt />
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(product.id)}>
                                                <FaTrash />
                                            </button>
                                        </td>
                                        <td className="text-center">{product.id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <ul className="pagination">
                        <li className="page-item">
                            {page > 1 ? (
                                <Link className="page-link" to={`/admin/product/${limit}/${page - 1}`}>Previous</Link>
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
                                    to={`/admin/product/${limit}/${index + 1}`}
                                >
                                    {index + 1}
                                </Link>
                            </li>
                        ))}
                        <li className="page-item">
                            <Link className="page-link" to={`/admin/product/${limit}/${page + 1}`}>
                                Next
                            </Link>
                        </li>
                    </ul>
                </>
            ) : (
                <div className="card-body">
                    <h6 className="text-center">Hiện không có sản phẩm nào trong thùng rác!</h6>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default ProductSaleTrash;
