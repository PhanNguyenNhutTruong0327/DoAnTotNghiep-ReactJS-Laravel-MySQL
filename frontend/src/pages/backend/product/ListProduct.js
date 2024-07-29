import { Link, useParams } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { urlImage } from '../../../config';
import productservice from '../../../services/ProductService';
import Notification, { showNotification } from '../Notificatio'; // Import Notification và hàm showNotification



function ProductList() {

    const [data, setData] = useState([]);

    const page = parseInt(useParams().page);
    const limit = parseInt(useParams().limit);

    const [pages, setPages] = useState(1);

    const [qty_trash, setQtyTrash] = useState(0);
    const [qty, setQty] = useState(0);
    const [tamp, setTamp] = useState();

    useEffect(function () {
        (async function () {
            await productservice.getAll(limit, page).then(function (result) {
                setData(result.data.products);
                setPages(result.data.page);
                setQtyTrash(result.data.qty_trash);
                setQty(result.data.qty);

            });
        })()
    }, [page, tamp]);

    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };


    function productTrash(id) {
        productservice.getTrash(id).then(function (result) {
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
                        <strong className="text-primary">SẢN PHẨM<sup>({qty})</sup></strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link className="btn btn-success me-2" to={"/admin/list-products/create"}>
                            <FaPlus />Thêm
                        </Link>
                        <Link className=" btn text-danger" to={"/admin/list-products/list-trash/1/10"}>
                            <FaTrash /><sup>{qty_trash}</sup>
                        </Link>

                    </div>
                </div>
                <div className="card-body">
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: 30 }} className="text-center">#</th>
                                <th style={{ width: 80 }} className="text-center">Hình</th>
                                <th style={{ width: 50 }} className="text-center">Tên sản phẩm</th>
                                <th style={{ width: 100 }} className="text-center">Danh mục</th>
                                <th style={{ width: 100 }} className="text-center">Thương hiệu</th>
                                <th style={{ width: 30 }} className="text-center">Giá</th>
                                <th style={{ width: 30 }} className="text-center">Số lượng còn</th>
                                <th style={{ width: 80 }} className="text-center">Chức năng</th>
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
                                        <td>{product.qty - product.qty_sold > 0 ? (product.qty - product.qty_sold):("Hết hàng")}</td>
                                        <td className="text-center" style={{ width: "120px" }}>
                                            <Link className="btn btn-sm btn-success me-1" to={"/admin/list-products/show/" + product.id}>
                                                <FaEye />
                                            </Link>
                                            <Link className="btn btn-sm btn-primary me-1" to={"/admin/list-products/update/" + product.id}>
                                                <FaEdit />
                                            </Link>
                                            <button onClick={() => productTrash(product.id)} className="btn btn-sm btn-danger">
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
                            <Link className="page-link" to={`/admin/list-products/${limit}/${page - 1}`}>Previous</Link>
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
                                to={`/admin/list-products/${limit}/${index + 1}`}
                            >
                                {index + 1}
                            </Link>
                        </li>
                    ))}
                    <li className="page-item">
                        <Link className="page-link" to={`/admin/list-products/${limit}/${page + 1}`}>
                            Next
                        </Link>
                    </li>
                </ul>

            </div>
        </div>
    );
}

export default ProductList; 