// import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { urlImage } from '../../../config';
import productSaleService from "../../../services/ProductSaleService";
import productServices from "../../../services/ProductService";

function ProductSaleShow() {
    const navigate = useNavigate();

    const { id } = useParams()

    const [data, setData] = useState([]);
    const [image, setImage] = useState('');

    useEffect(function () {
        (async function () {
            await productSaleService.getById(id).then(function (result) {
                setData(result.data.product);
                setImage(result.data.product.image.split(';')[0])
            });
        })();
    }, [])


    function productDelete(id) {
        productServices.remove(id).then(function (result) {
            alert(result.data.message);
            navigate("/admin/product", { replace: true });

        })
    }

    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };


    return (
        <section className="card" style={{ paddingLeft: "40px" }}>
            <div className="card-header">
                <div className="row">
                    <div className="col-md-6">
                        <strong className="text-danger  ">CHI TIẾT SẢN PHẨM GIẢM GIÁ</strong>
                    </div>
                    <div className="col-md-6 text-end">
                        <Link to="/admin/product-sale/10/1" className="btn btn-sm btn-outline-success me-1">
                            Về Danh Sách
                        </Link>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <table className="table table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <td className="text-danger" style={{ width: 300 }}><strong>Tên Trường</strong></td>
                            <td className="text-danger"><strong>Giá Trị</strong></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ID</td>
                            <td>{data.id}  </td>
                        </tr>
                        <tr>
                            <td>Tên Sản Phẩm</td>
                            <td>{data.product_name}  </td>
                        </tr>
                        <tr>
                            <td>Hình ảnh</td>
                            <img src={urlImage + "product/" + image} alt="hinh" className="img_fluid" style={{ width: 100 }} />
                        </tr>
                        <tr>
                            <td>Danh mục</td>
                            <td>{data.category_name}  </td>
                        </tr>
                        <tr>
                            <td>Thương hiệu</td>
                            <td>{data.brand_name}  </td>
                        </tr>
                        <tr>
                            <td>Chủ đề sale</td>
                            <td>{data.title}  </td>
                        </tr>
                        <tr>
                            <td>Phần trăm sale</td>
                            <td>{data.percent_sale}  </td>
                        </tr>
                        <tr>
                            <td>Giá</td>
                            <td>{formatPrice(data.price)}  </td>
                        </tr>
                        <tr>
                            <td>Giá giảm</td>
                            <td>{formatPrice(data.price_sale)}  </td>
                        </tr>
                        <tr>
                            <td>Số lượng</td>
                            <td>{data.qty}  </td>
                        </tr>
                        <tr>
                            <td>Số lượng đã bán</td>
                            <td>{data.qty_sold}  </td>
                        </tr>
                        <tr>
                            <td>Số lượng còn lại</td>
                            <td>{data.qty - data.qty_sold}  </td>
                        </tr>
                        <tr>
                            <td>Ngày bắt đầu</td>
                            <td>{data.start_time}</td>
                        </tr>
                        <tr>
                            <td>Ngày kết thúc</td>
                            <td>{data.end_time}</td>
                        </tr>
                        <tr>
                            <td>Ngày tạo</td>
                            <td>{data.created_at}</td>
                        </tr>
                        <tr>
                            <td>Ngày cập nhật</td>
                            <td>{data.updated_at}</td>
                        </tr>
                        <tr>
                            <td>Trạng thái</td>
                            <td>{data.status === 1 ? "Hiển thị" : "Ẩn"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </section>

    );
}
export default ProductSaleShow;
