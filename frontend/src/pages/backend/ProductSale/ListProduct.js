import { Link, useParams } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import productservice from "../../../services/ProductService";
import { useEffect, useState } from "react";
import { urlImage } from '../../../config';
import productSaleService from "../../../services/ProductSaleService";

function ListProduct() {

    const [data, setData] = useState([]);

    const page = parseInt(useParams().page);
    const limit = parseInt(useParams().limit);

    const [pages, setPages] = useState(1);

    const [qty_trash, setQtyTrash] = useState(0);
    const [qty, setQty] = useState(0);
    const [tamp, setTamp] = useState();

    useEffect(function () {
        (async function () {
            await productSaleService.getProductNotSale(limit, page).then(function (result) {
                setData(result.data.products);
                setPages(result.data.page);
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
        productservice.productTrash(id).then(function (result) {
            if (result.data.success === true) {
                alert(result.data.message);
                setTamp(id);
            }
            else {
                alert(result.data.message);
            }
        })
    }

    return (
        <div className="Card" style={{ paddingLeft: "40px" }}>
            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <strong className="text-primary">DANH SÁCH SẢN PHẨM<sup>({qty})</sup></strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link to="/admin/product-sale/10/1" className="btn btn-sm btn-outline-success me-1">
                            Về Danh Sách
                        </Link>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: 30 }} className="text-center">#</th>
                            <th style={{ width: 30 }} className="text-center">Id</th>
                            <th style={{ width: 80 }} className="text-center">Hình</th>
                            <th style={{ width: 150 }} className="text-center">Tên sản phẩm</th>
                            <th style={{ width: 100 }} className="text-center">Giá</th>
                            <th style={{ width: 100 }} className="text-center">Số lượng</th>
                            <th style={{ width: 130 }} className="text-center">Chức năng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(function (product, index) {
                            return (
                                <tr key={index}>
                                    <td className="text-center">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="text-center">{product.id}</td>
                                    <td className="text-center">
                                        <img src={urlImage + 'product/' + product.image.split(';')[0]} alt="hinh" className="img_fluid" style={{ width: 100 }} />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{formatPrice(product.price)}</td>
                                    <td>{product.qty}</td>
                                    <td className="text-center">
                                        <Link className="btn btn-sm btn-success me-1" to={`/admin/product-sale/create/${product.id}`}>
                                            Thiết lập sale
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>
            </div>
            <ul className="pagination">
                <li className="page-item">
                    {page > 1 ? (
                        <Link className="page-link" to={`/admin/product-sale/list-product/${limit}/${page - 1}`}>Previous</Link>
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
                            to={`/admin/product-sale/list-product/${limit}/${index + 1}`}
                        >
                            {index + 1}
                        </Link>
                    </li>
                ))}
                <li className="page-item">
                    <Link className="page-link" to={`/admin/product-sale/list-product/${limit}/${page + 1}`}>
                        Next
                    </Link>
                </li>
            </ul>

        </div>
    );
}

export default ListProduct; 