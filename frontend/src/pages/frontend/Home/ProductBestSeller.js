import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { urlImage } from '../../../config';
import productServices from '../../../services/ProductService';

function ProductBestSeller() {


    const [data, setData] = useState([]);

    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };

    useEffect(() => {
        (async () => {
            await productServices.getProductBestSeller(6).then(res => {
                try {
                    setData(res.data.products);
                } catch (e) { console.log(e); }
            })
        })()
    }, [])


    return (
        <>
            {data.length > 0 && (
                <>
                    <section className="padding-bottom">
                        <header className="section-heading heading-line">
                            <h4 className="title-section text-uppercase"> Top sản phẩm bán chạy</h4>
                        </header>

                        <div className="card card-home-category">
                            <div className="row no-gutters">
                                {/* <div className="col-md-3">

                        <div className="home-category-banner bg-light-orange">
                            <h5 className="title">Sản phẩm bán chạy</h5>
                            <Link to={`/danh-muc/aa/1/10`} className="btn btn-outline-primary rounded-pill">Xem thêm</Link>
                            <img src={product_1} className="img-bg" />
                        </div>

                    </div> */}
                                <div className="col-md-12">
                                    <ul className="row no-gutters bordered-cols">
                                        {data.map((item, index) => {
                                            return (
                                                <li className="col-6 col-lg-2 col-md-4" key={index}>
                                                    <Link to={`/san-pham/chi-tiet-san-pham/${item.slug}`} className="item">
                                                        <span className="badge badge-danger mt-1 ml-1" style={{ fontSize: "11px" }}> Trả góp 0% </span>
                                                        <div className="card-body text-center">
                                                            <img className="img-md " src={urlImage + 'product/' + item.image.split(';')[0]} style={{ height: "auto", width: "90%" }} />
                                                            <br /><br />
                                                            <p>{item.name}</p>
                                                            <h6 className="text-danger">{formatPrice(item.price)}</h6>
                                                            {/* <p className="text-muted"><del>14.550.000đ</del></p> */}
                                                        </div>
                                                        <div className="rating-wrap ml-3 my-3">
                                                            <ul className="rating-stars">
                                                                <li style={{ width: "80%" }} className="stars-active">
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
                                                            <small className="label-rating text-muted">{132}</small>
                                                            <br />
                                                            <small className="label-rating text-success"> <i className="fa fa-clipboard-check"></i> {item.total} orders </small>
                                                        </div>
                                                    </Link>
                                                </li>

                                            )
                                        })}
                                        {/* <li className="col-6 col-lg-3 col-md-4">
                            <a href="#" className="item">
                                <span className="badge badge-danger mt-1 ml-1" style={{ fontSize: "11px" }}> Trả góp 0% </span>
                                <div className="card-body text-center">
                                    <img className="img-md " src={product_1} style={{ height: "140px", width: "140px" }} />                                        <br /><br />
                                    <p>iPhone 13 128GB</p>
                                    <h6>13.500.000đ</h6>
                                    <p className="text-muted"><del>14.550.000đ</del></p>
                                </div>
                            </a>
                        </li>
                        <li className="col-6 col-lg-3 col-md-4">
                            <a href="#" className="item">
                                <span className="badge badge-danger mt-1 ml-1" style={{ fontSize: "11px" }}> Trả góp 0% </span>
                                <div className="card-body text-center">
                                    <img className="img-md " src={product_1} style={{ height: "140px", width: "140px" }} />                                        <br /><br />
                                    <p>iPhone 13 128GB</p>
                                    <h6>13.500.000đ</h6>
                                    <p className="text-muted"><del>14.550.000đ</del></p>
                                </div>
                            </a>
                        </li>
                        <li className="col-6 col-lg-3 col-md-4">
                            <a href="#" className="item">
                                <span className="badge badge-danger mt-1 ml-1" style={{ fontSize: "11px" }}> Trả góp 0% </span>
                                <div className="card-body text-center">
                                    <img className="img-md " src={product_1} style={{ height: "140px", width: "140px" }} />                                        <br /><br />
                                    <p>iPhone 13 128GB</p>
                                    <h6>13.500.000đ</h6>
                                    <p className="text-muted"><del>14.550.000đ</del></p>
                                </div>
                            </a>
                        </li> */}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </>

            )}
        </>
    );

}
export default ProductBestSeller;