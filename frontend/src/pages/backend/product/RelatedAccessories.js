import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiProduct from "../../../api/apiProduct";
import { imageURL } from "../../../api/config";

function RelatedAccessories() {

    const {id} = useParams();

    const [product, setProduct] = useState([]);
    const [related_accessories, setRelatedAccessories] = useState([]);


    useEffect(()=>{
        apiProduct.getProductById(id).then(res => {
            setProduct(res.data.data);
        })

        apiProduct.getProductByCategorySlug('phu-kien',1,10).then((res) => {
            setRelatedAccessories(res.data.data);
        })



    },[])

    const handleSubmit = (e) => {

    }

    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };


    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-10">
                            <h1 className="d-inline">Thêm phụ kiệm mua cùng</h1>
                        </div>
                        <div className="col-sm-2  text-right">
                            <Link to="/admin/list-products/1/10" className="btn btn-sm btn-info">
                                <i className="fa fa-reply me-1" aria-hidden="true"></i>
                                Quay lại
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-2"></div>
                            <div className="col-md-8">
                                <form onSubmit={handleSubmit} >
                                <div className="mb-3">
                                        <label>Sản phẩm chính:</label>
                                        <span className="ps-2">{product.name}</span>
                                        <br />
                                        <div className="text-center">
                                            <img style={{ width: "auto", height: "150px" }} src={imageURL + product.image} alt="anh" />

                                        </div>
                                        <br />
                                    </div>
                                    <div className="mb-3">
                                        <label>Phụ kiện mua cùng (*)</label>
                                        <div className="col-md">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ width: "30px" }}>
                                                <input type="checkbox" />
                                            </th>
                                            <th className="text-center" style={{ width: "130px" }}>Hình ảnh</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Giá</th>
                                            <th>Giá giảm</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {related_accessories.map((item, index) => {
                                            return (
                                                <tr className="datarow" key={index}>
                                                    <td>
                                                        <input type="checkbox" />
                                                    </td>
                                                    <td>
                                                        <img src={imageURL + item.attributes.image} alt="product.jpg" style={{ width: "100%" }} />
                                                    </td>
                                                    <td style={{ width: "30%" }}>
                                                            {item.attributes.name}
                                                    </td>
                                                    <td>{formatPrice(item.attributes.price)}</td>
                                                    <td>{formatPrice(item.attributes.price_sale)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                                    </div>
                                    <div className="card-header text-right">
                                        <button className="btn btn- btn-success">
                                            <i className="fa fa-save me-2" aria-hidden="true"></i>
                                            Lưu
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    );
}

export default RelatedAccessories;