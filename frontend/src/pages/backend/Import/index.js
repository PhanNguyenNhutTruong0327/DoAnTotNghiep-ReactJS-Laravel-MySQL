import { useEffect, useState } from "react";
import apiProduct from "../../../api/apiProduct";
import { Link, useParams } from "react-router-dom";
import { imageURL } from "../../../api/config";

function ProductImport() {

    const [products, setProducts] = useState([]);
    const [qty, setQty] = useState(0);

    const page = parseInt(useParams().page);
    const limit = parseInt(useParams().limit);

    const [pages, setPages] = useState(1);

    useEffect(() => {
        apiProduct.getAllProductPagination(page, limit).then(res => {
            try {
                setProducts(res.data);
                const numberOfPages = res.meta.pagination.pageCount;
                setPages(numberOfPages);
                setQty(res.meta.pagination.total);
            } catch (e) {
                console.log(e);
            }
        })
    }, [page])

    const formatPrice = (price) => {
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(price);
        return formattedPrice.replace(/,/g, '.') + '.000đ';
    };


    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-10">
                            <h1 className="d-inline">Tất cả sản phẩm <sup>({qty})</sup></h1>
                        </div>
                        {/* <div className="col-sm-2  text-right">
                            <Link to="/admin/discounted-products/1/10" className="btn btn-sm btn-info">
                                <i className="fa fa-reply me-1" aria-hidden="true"></i>
                                Quay lại
                            </Link>
                        </div> */}

                    </div>
                </div>
            </section>
            <section className="content">
                <div className="card">
                    <div className="text-right pt-2 pe-4">
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ width: "30px" }}>
                                                <input type="checkbox" />
                                            </th>
                                            <th>Id</th>
                                            <th className="text-center" style={{ width: "130px" }}>Hình ảnh</th>
                                            <th>Tên sản phẩm</th>
                                            {/* <th>Tên slug</th> */}
                                            <th>Giá</th>
                                            <th>Số lượng ban đầu</th>
                                            <th>Số lượng đã bán</th>
                                            <th>Số lượng còn lại</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((item, index) => {
                                            return (
                                                <tr className="datarow" key={index}>
                                                    <td>
                                                        <input type="checkbox" />
                                                    </td>
                                                    <td>{item.id}</td>
                                                    <td>
                                                        <img src={imageURL + item.attributes.image} alt="product.jpg" style={{ width: "100%" }} />
                                                    </td>
                                                    <td style={{ width: "26%" }}>
                                                        <div className="name">
                                                            {item.attributes.product_name}
                                                        </div>
                                                    </td>
                                                    {/* <td>{item.slug}</td> */}
                                                    <td>{isNaN(item.attributes.price) ? (<></>) : (formatPrice(item.attributes.price))}</td>
                                                    <td>{item.attributes.qty ? (item.attributes.qty) : (0)}</td>
                                                    <td>{item.attributes.qty_sold ? (item.attributes.qty_sold) : (0)}</td>
                                                    <td>{item.attributes.qty - item.attributes.qty_sold}</td>
                                                    <td className="text-center">
                                                        <Link to={`/admin/product-import/create/${item.id}`} className="btn btn-success btn-sm">Nhập hàng</Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
                <ul className="pagination">
                    <li className="page-item">
                        {page > 1 ? (
                            <Link className="page-link" to={`/admin/product-import/${page - 1}/${limit}`}>Previous</Link>
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
                                className="page-link bg-white"
                                to={`/admin/product-import/${index + 1}/${limit}`}
                            >
                                {index + 1}
                            </Link>
                        </li>
                    ))}
                    <li className="page-item">
                        <Link className="page-link" to={`/admin/product-import/${page + 1}/${limit}`}>
                            Next
                        </Link>
                    </li>
                </ul>

            </section>
        </div>

    );
}

export default ProductImport;