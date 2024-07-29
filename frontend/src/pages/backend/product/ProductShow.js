import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { urlImage } from '../../../config';
import productServices from '../../../services/ProductService';
function ProductShow() {
    const navigate = useNavigate();

    const { id } = useParams()

    const [product, setproduct] = useState([]);
    const [image, setImage] = useState([]);

    useEffect(function () {
        (async function () {
            await productServices.getById(id).then(function (result) {
                setproduct(result.data.products);
                // setImage(result.data.images);
                setImage(result.data.products.image.split(';'));

            });
        })();
    }, [])


    function productDelete(id) {
        productServices.remove(id).then(function (result) {
            alert(result.data.message);
            navigate("/admin/list-products", { replace: true });

        })
    }

    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };


    return (
        <section className="card" style={{ paddingLeft: "30px" }}>
            <form onSubmit={ProductShow} method="product"></form>
            <div className="card-header">
                <div className="row">
                    <div className="col-md-6">
                        <strong className="text-danger  ">Chi Tiết Sản Phẩm</strong>
                    </div>
                    <div className="col-md-6 text-end">
                        <Link to="/admin/list-products/10/1" className="btn btn-sm btn-outline-success me-1">
                            Về Danh Sách
                        </Link>
                        <Link to={"/admin/list-products/update/" + product.id} className="btn btn-sm btn-outline-primary me-1 ">
                            <FaEdit /> Sửa
                        </Link>
                        {/* <button onClick={() => productDelete(product.id)} className="btn btn-sm btn-danger">
                            <FaTrash /> Xóa
                        </button> */}
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
                            <td>{product.id}  </td>
                        </tr>
                        <tr>
                            <td>Tên Sản Phẩm</td>
                            <td>{product.name}  </td>
                        </tr>
                        <tr>
                            <td>Slug</td>
                            <td>{product.slug}  </td>
                        </tr>
                        {/* <tr>
                            <td>Hình ảnh</td>
                            <img src={urlImage + "product/" + product.image} alt="hinh" className="img_fluid" style={{ width: 100 }} />
                        </tr> */}
                        {image.length > 0 ? (
                            <tr>
                                <td>Hình ảnh</td>
                                {image.map((item, index) => (
                                    <img src={urlImage + "product/" + item} key={index} alt="hinh" className="img_fluid" style={{ width: 100 }} />
                                ))}
                            </tr>

                        ) : (<></>)}
                        <tr>
                            <td>Hình ảnh chi tiết</td>
                            <img src={urlImage + "product/" + product.image_detail} alt="hinh" className="img_fluid" style={{ width: 100 }} />
                        </tr>
                        
                        <tr>
                            <td>Danh mục</td>
                            <td>{product.categoryname}  </td>
                        </tr>
                        <tr>
                            <td>Thương hiệu</td>
                            <td>{product.brandname}  </td>
                        </tr>
                        <tr>
                            <td>Giá</td>
                            <td>{formatPrice(product.price)}  </td>
                        </tr>
                        <tr>
                            <td>Số lượng</td>
                            <td>{product.qty}  </td>
                        </tr>
                        <tr>
                            <td rowSpan={2}>Mô tả</td>
                            <td>{product.description_1}</td>
                        </tr>
                        <tr>
                            <td>{product.description_2 ? (product.description_2) : (<></>)}</td>
                        </tr>
                        <tr>
                            <td>Ngày tạo</td>
                            <td>{product.created_at}</td>
                        </tr>
                        <tr>
                            <td>Ngày cập nhật</td>
                            <td>{product.updated_at}</td>
                        </tr>
                        <tr>
                            <td>Trạng thái</td>
                            <td>{product.status === 1 ? "Hiển thị" : "Ẩn"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="card-body">
                <table className="table table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <td className="text-danger" style={{ width: 300 }}><strong>Thông số kỹ thuật</strong></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Chip</td>
                            <td>{product.chip}  </td>
                        </tr>
                        <tr>
                            <td>Màng hình</td>
                            <td>{product.screen}  </td>
                        </tr>
                        <tr>
                            <td>Camera trước</td>
                            <td>{product.front_camera}  </td>
                        </tr>
                        <tr>
                            <td>Camera sau</td>
                            <td>{product.rear_camera}  </td>
                        </tr>
                        <tr>
                            <td>Hệ đều hành</td>
                            <td>{product.operating_system}  </td>
                        </tr>
                        <tr>
                            <td>Ram</td>
                            <td>{product.ram}  </td>
                        </tr>
                        <tr>
                            <td>Dung lượng lưu trữ</td>
                            <td>{product.rom} </td>
                        </tr>
                        <tr>
                            <td>Pin</td>
                            <td>{product.pin}</td>
                        </tr>
                        <tr>
                            <td>Kích thướt</td>
                            <td>{product.size}</td>
                        </tr>
                        <tr>
                            <td>Kết nối</td>
                            <td>{product.connect}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </section>

    );
}
export default ProductShow;
