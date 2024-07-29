import { Link, useParams } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaTrash, FaRedoAlt } from 'react-icons/fa';
import { useEffect, useState } from "react";
import productServices from "../../../services/ProductService";
import { urlImage } from "../../../config";
import Notification, { showNotification } from '../Notificatio'; // Import Notification và hàm showNotification

function Product_Trash() {

    const [data, setData] = useState([]);

    const page = parseInt(useParams().page);
    const limit = parseInt(useParams().limit);

    const [pages, setPages] = useState(1);

    const [qty, setQty] = useState(0);
    const [tamp, setTamp] = useState();

    useEffect(function () {
        (async function () {
            await productServices.getAllTrash(limit, page).then(function (result) {
                setData(result.data.trash);
                setPages(result.data.end_page);
                setQty(result.data.qty_trash);
                console.log(result.data)
            });
        })()
    }, [page, tamp]);

    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };


    function rescoverTrash(id) {
        productServices.getRecover(id).then(function (result) {
            if (result.data.success === true) {
                showNotification(result.data.message,'success');
                setTamp(id);
            }
            else {
                showNotification(result.data.message,'warning');
            }
        })
    }

    function deleteProduct(id) {
        productServices.remove(id).then(function (result) {
            if (result.data.success === true) {
                showNotification(result.data.message,'success');
                setTamp(id);
            }
            else {
                showNotification(result.data.message,'warning');
            }
        })
    }

    return (
        <div className="Card" style={{ paddingLeft: "40px" }}>
            <Notification />
            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <strong className="text-primary">THÙNG RÁC<sup>({qty})</sup></strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link className="btn btn-sm btn-success me-1" to="/admin/list-products/10/1">
                            Quay lại
                        </Link>
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
                                        <th style={{ width: 50 }} className="text-center">Tên sản phẩm</th>
                                        <th style={{ width: 100 }} className="text-center">Danh mục</th>
                                        <th style={{ width: 100 }} className="text-center">Thương hiệu</th>
                                        <th style={{ width: 100 }} className="text-center">Giá</th>
                                        <th style={{ width: 130 }} className="text-center">Chức năng</th>
                                        <th style={{ width: 30 }} className="text-center">Id</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(function (product, index) {
                                        return (
                                            <tr key={index}>
                                                <td className="text-center">
                                                    <input type="checkbox" />
                                                </td>
                                                <td className="text-center">
                                                    <img src={urlImage + 'product/' + product.image.split(';')[0]} alt="hinh" className="img_fluid" style={{ width: 100 }} />
                                                </td>
                                                <td>{product.name}</td>
                                                <td>{product.categoryname}</td>
                                                <td>{product.brandname}</td>
                                                <td>{formatPrice(product.price)}</td>
                                                <td className="text-center">
                                                    <Link className="btn btn-sm btn-success me-1" to={"/admin/product/show/" + product.id}>
                                                        <FaEye />
                                                    </Link>
                                                    <button onClick={() => rescoverTrash(product.id)} className="btn btn-sm btn-warning me-1">
                                                        <FaRedoAlt />
                                                    </button>
                                                    <button onClick={() => deleteProduct(product.id)} className="btn btn-sm btn-danger">
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                                <td className="text-center">{product.id}</td>
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>
                        </div>
                        <ul className="pagination">
                            <li className="page-item">
                                {page > 1 ? (
                                    <Link className="page-link" to={`/admin/product/list-trash/${limit}/${page - 1}`}>Previous</Link>
                                ) : (
                                    <span className="page-link disabled">Previous</span>
                                )}
                            </li>
                            {Array.from(Array(pages).keys()).map((index) => (
                                <li
                                    style={{}}
                                    key={index}
                                    className={`page-item ${index + 1 === page ? "active" : ""}`}
                                >
                                    <Link
                                        className="page-link"
                                        to={`/admin/product/list-trash/${limit}/${index + 1}`}
                                    >
                                        {index + 1}
                                    </Link>
                                </li>
                            ))}
                            <li className="page-item">
                                <Link className="page-link" to={`/admin/product/list-trash/${limit}/${page + 1}`}>
                                    Next
                                </Link>
                            </li>
                        </ul>
                    </>

                ) : (<section class="content">
                    <div class="card">
                        <div class="card-header text-center">
                            <h6>Hiện không có sản phẩm nào !</h6>
                        </div>
                    </div>
                </section>
                )}
            </div>
        </div>
    );
}

export default Product_Trash; 