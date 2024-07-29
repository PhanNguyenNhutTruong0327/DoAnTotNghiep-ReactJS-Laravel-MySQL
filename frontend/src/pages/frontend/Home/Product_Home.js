import { Link } from 'react-router-dom';
import img_phone from '../../../assets/frontend/images/product/samsung-galaxy-s23-ultra.jpg';
import { useEffect, useState } from "react";
import { urlImage } from '../../../config';
import productServices from '../../../services/ProductService';
import '../../../assets/frontend/css/ProductHome.css';
function Product_Home(props) {
    const category = props.item;

    const [data, setData] = useState([]);

    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };

    useEffect(() => {
        (async () => {
            try {
                const res = await productServices.getProductByCategoryId(category.id, 4);
                setData(res.data.products);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    if (data.length > 0) {
        return (
            <section className="padding-bottom">
                <header className="section-heading heading-line">
                    <h4 className="title-section text-uppercase">{category.name} nổi bật</h4>
                </header>

                <div className="card card-home-category">
                    <div className="row no-gutters">
                        <div className="col-md-3">
                            <div className="home-category-banner bg-light-orange">
                                <h5 className="title animated-text">Đây là những {category.name} khá phổ biến</h5>
                                <Link to={`/danh-muc/${category.slug}/10/1`} className="btn btn-outline-primary rounded-pill">Xem thêm</Link>
                                <img src={img_phone} className="img-bg" alt={category.name} />
                            </div>
                        </div>
                        <div className="col-md-9">
                            <ul className="row no-gutters bordered-cols">
                                {data.map((item, index) => (
                                    <li className="col-6 col-lg-3 col-md-4" key={index}>
                                        <Link to={`/san-pham/chi-tiet-san-pham/${item.slug}`} className="item">
                                            <span className="badge badge-danger mt-1 ml-1" style={{ fontSize: "11px" }}> Trả góp 0% </span>
                                            <div className="card-body text-center">
                                                <img className="img-md " src={urlImage + 'product/' + item.image.split(';')[0]} style={{ height: "140px", width: "auto" }} alt={item.name} />
                                                <br /><br />
                                                <p>{item.name}</p>
                                                <h6 className="text-danger">{formatPrice(item.price)}</h6>
                                            </div>
                                            <div className="rating-wrap ml-3 my-3">
                                                <ul className="rating-stars">
                                                    <li style={{ width: (item.average_stars / 5 * 100) + '%' }} className="stars-active">
                                                        <i className="fa fa-star"></i> <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i> <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                    </li>
                                                    <li>
                                                        <i className="fa fa-star"></i> <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i> <i className="fa fa-star"></i>
                                                        <i className="fa fa-star"></i>
                                                    </li>
                                                </ul>
                                                {/* <small className="label-rating text-muted">132</small> */}
                                                <br />
                                                <small className="label-rating text-success">
                                                    {item.qty_ > 0 ? (
                                                        <>
                                                            <i className="fa fa-clipboard-check"></i> Số lượng: {item.qty_}
                                                        </>

                                                    ) : (
                                                        <>
                                                            <i className="fa fa-clipboard-check"></i> Hết hàng
                                                        </>
                                                    )}
                                                </small>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        );
    } else {
        return null; // Xử lý trường hợp data chưa có
    }
}

export default Product_Home;
