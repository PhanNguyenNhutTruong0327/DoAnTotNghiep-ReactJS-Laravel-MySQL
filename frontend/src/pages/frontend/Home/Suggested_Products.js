import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { urlImage } from "../../../config";
import productServices from "../../../services/ProductService";

function Suggested_Products() {

    const [products, setProducts] = useState([]);

    // const page = parseInt(useParams().page);
    // const limit = parseInt(useParams().limit);

    // const [pages, setPages] = useState(1);


    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };

    useEffect(() => {
        try {
            (async () => {
                await productServices.getProductNew(12).then(res => {
                    setProducts(res.data.products);
                })
            })()
        } catch (e) { console.log(e) }
    }, [])

    return (
        <>
            {products && (
                <section className="padding-bottom-sm">
                    <div className="row">
                        <header className="section-heading heading-line col-md-11">
                            <h4 className="title-section text-uppercase">Sản phẩm mới</h4>
                        </header>
                        <Link to="/san-pham/12/1/0" className="section-heading col-md-1 title-section text-success">Xem Thêm</Link>

                    </div>
                    <div className="row row-sm">
                        {products.map((item, index) => (

                            <div className="col-xl-2 col-lg-3 col-md-4 col-6" key={index} style={{ display: "flex" }}>
                                <div className="card card-sm card-product-grid pt-2" style={{ flexGrow: 1 }}>
                                    <span className="badge badge-danger ml-1 mb-2" style={{ width: "40%" }}> Trả góp 0% </span>
                                    <Link to={`/san-pham/chi-tiet-san-pham/${item.slug}`} className="img-wrap"> <img className="" src={urlImage + 'product/' + item.image.split(';')[0]} style={{ height: "auto", width: "90%" }} /> </Link>
                                    <figcaption className="info-wrap">
                                        <Link to={`/san-pham/chi-tiet-san-pham/${item.slug}`} className="title" style={{ fontSize: "14px" }}>{item.name}</Link>
                                        <div className="price mt-1 text-danger">{item.price_sale ? formatPrice(item.price_sale) : formatPrice(item.price)}</div>
                                        <div className="price mt-1 text-black"><del className="12px">{item.price_sale ? formatPrice(item.price) : ''}</del></div>
                                        <p style={{ fontSize: "12px" }}>Quà 900.000đ</p>
                                        <div className="rating-wrap mt-2">
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
                                            <small className="label-rating text-muted">(132)</small>
                                        </div>

                                    </figcaption>

                                </div>
                            </div>


                        ))}
                    </div>
                </section>

            )}
        </>
    );
}
export default Suggested_Products;