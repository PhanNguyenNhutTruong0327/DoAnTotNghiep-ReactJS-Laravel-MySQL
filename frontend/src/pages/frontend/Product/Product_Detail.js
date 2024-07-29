import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "react-use-cart";
import { useAuth } from "../../../component/Provider/AuthProvider";
import { urlImage } from "../../../config";
import productServices from "../../../services/ProductService";
import { toast, ToastContainer } from 'react-toastify';// thêm thông báo
import 'react-toastify/dist/ReactToastify.css';// thêm thông báo


function Product_Detail() {

    const { slug } = useParams();

    const { token } = useAuth();

    const { addItem } = useCart();

    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => {
        if (quantity < 5) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const [product, setProduct] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [productOther, setProductOther] = useState([]);
    const [images, setImages] = useState([]);
    const [related_accessories, setRelatedAccessories] = useState([]);
    const [reviews, setReviews] = useState([]);

    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000đ';
    };


    useEffect(() => {
        (async () => {
            console.log(slug);
            await productServices.getProductDetailAndProductOther(slug).then(res => {
                try {
                    console.log(res.data);
                    setProduct(res.data.product);
                    setProductOther(res.data.product_other);
                    setAttributes(res.data.attributes);
                    setImages(res.data.product.image.split(';'));
                    setLargeImageSrc(res.data.product.image.split(';')[0]);
                    setReviews(res.data.product_review);

                } catch (err) {
                    console.log(err);
                }
            })
        })()
    }, [slug])


    const addToCart = async (product) => {
        if (token !== null) {
            const user = JSON.parse(localStorage.getItem('token'));
            const user_id = user.user.id;
            if (product.sale_id) {
                const cart_product_data = await { 'user_id': user_id, 'id': product.id, 'price': product.price, 'product_name': product.name, 'image': largeImageSrc, 'brand_name': product.name_brand, 'sale_id': product.sale_id };
                addItem(cart_product_data, quantity);
            }
            else {
                const cart_product_data = await { 'user_id': user_id, 'id': product.id, 'price': product.price, 'product_name': product.name, 'image': largeImageSrc, 'brand_name': product.name_brand, 'sale_id': 0 };
                addItem(cart_product_data, quantity);
            }

            showNotification('Đã thêm sản phẩm vào giỏ hàng !', 'success');

        }
        else {
            showNotification('Hãy đăng nhập để mua hàng !', 'warning');
        }
    }

    const [largeImageSrc, setLargeImageSrc] = useState("");
    const changeLargeImage = (newSrc) => {
        setLargeImageSrc(newSrc);
    };

    // thong bao
    const showNotification = (message, type = 'success') => {
        let options = {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "toast-container"
        }


        switch (type) {
            case 'success':
                toast.success(message, options);
                break;
            case 'error':
                toast.error(message, options);
                break;
            case 'warning':
                toast.warn(message, options);
                break;
            case 'info':
                toast.info(message, options);
                break;
            default:
                toast(message, { ...options, type: 'custom' });
        }
    }

    return (
        <>
            <section className="section-content bg-white padding-y" style={{ padding: "0px 40px" }}>
                <ToastContainer />
                <div className="container">
                    {console.log(product)}
                    <div className="row">
                        <aside className="col-md-8">
                            <div className="card">
                                <article className="gallery-wrap">
                                    <div className="img-big-wrap">
                                        <div>
                                            <a href="#">
                                                <img src={urlImage + 'product/' + largeImageSrc} alt={`Image`} className="pt-3" style={{ height: "40%", width: "30%" }} />
                                            </a>
                                        </div>
                                    </div>
                                    <div className="thumbs-wrap">
                                        {images.length > 1 && images.map((image, index) => {
                                            return (
                                                <a key={index} href="#" className="item-thumb" onClick={() => changeLargeImage(image)}>  <img src={urlImage + 'product/' + image} className="p-1" style={{}} /></a>
                                            )
                                        })}
                                    </div>
                                </article>
                            </div>

                            <h5 className="title-description">Thông tin sản phẩm</h5>
                            <p>{product.description_1}</p>
                            {product.image_detail && (
                                <div className="img-fuild text-center">
                                    <img src={urlImage + 'product/' + product.image_detail} alt="img detail" className="img-fuild" style={{ height: "60%", width: "60%" }} />
                                </div>
                            )}
                            {/* <ul className="list-check">
                                <li>Material: Stainless steel</li>
                                <li>Weight: 82kg</li>
                                <li>built-in drip tray</li>
                                <li>Open base for pots and pans</li>
                                <li>On request available in propane execution</li>
                            </ul> */}
                            <br />
                            <p>{product.description_2}</p>
                            <br />
                            {reviews.length > 0 ? (
                                <div className="product-review">
                                    <div className="border" style={{ borderRadius: "10px" }}>
                                        <section class="product-reviews p-3">
                                            <div class="container">
                                                <h5 class="section-title">Đánh giá {product.name}</h5>
                                                <div class="">
                                                    {reviews.map((item, index) => (
                                                        <>
                                                            <div className="rating-wrap ml-3 my-3">
                                                                <div className="user-name">
                                                                    <b>{item.name}</b>
                                                                </div>
                                                                <ul className="rating-stars">
                                                                    <li style={{ width: (item.qty_star / 5 * 100) + '%' }} className="stars-active">
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
                                                                <small className=" ms-3 label-rating text-">{item.content}</small>
                                                            </div>
                                                            <hr />
                                                            {item.image_review && item.image_review.split(';').map((image, index) => {
                                                                return (
                                                                    // <a key={index} href="#" className="item-thumb" onClick={() => changeLargeImage(image)}>
                                                                    <img src={urlImage + 'review/' + image} className="p-1" style={{ width: "100px" }} />
                                                                    // </a>
                                                                )
                                                            })}
                                                        </>
                                                    ))}

                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>

                            ) : (<></>)}


                        </aside>
                        <main className="col-md-4">
                            <article className="product-info-aside">

                                <h2 className="title mt-3 ml-3">{product.name} </h2>

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
                                    <small className="label-rating text-muted">132 reviews</small>
                                    <small className="label-rating text-success"> <i className="fa fa-clipboard-check"></i> 154 orders </small>
                                </div>

                                <div className="mb-3 ml-3">
                                    <var className="price h4">{formatPrice(product.price)}</var>
                                    <br />
                                    <del className="price h6" style={{ color: "gray" }}>{product.price_initial ? formatPrice(product.price_initial) : ''}</del>
                                    {/* <span className="text-muted">USD 562.65 incl. VAT</span> */}
                                </div>

                                <dl className="row">
                                    <dt className="col-sm-4">Thương hiệu</dt>
                                    <dd className="col-sm-8"><a href="#">{product.brand_name}</a></dd>

                                    <dt className="col-sm-12">Sinh nhật giá sốc</dt>
                                    {/* <dd className="col-sm-9">596 065</dd> */}
                                    {/* <dt className="col-sm-3">Guarantee</dt> */}

                                    <ul className="list-check ml-3" style={{ fontSize: "13px" }}>
                                        <li>Apple Watch mua kèm giảm thêm 300,000đ đến 3,000,000đ (Tùy Model) khi mua kèm Iphone/iPad/Macbook</li>
                                        <li>Mua 1 số iPad giảm đến 20% (Không kèm khuyến mãi khác của iPad) </li>
                                    </ul>
                                </dl>

                                <div className="form-row  mt-4">
                                    <div className="form-group col-md-4 flex-grow-0">
                                        <div className="input-group mb-3 input-spinner">
                                            <div className="input-group-prepend">
                                                <button className="btn btn-light" type="button" id="button-minus" onClick={handleDecrement}> &minus; </button>

                                            </div>
                                            <input type="text" className="form-control text-center" value={quantity} readOnly style={{ height: "38px" }} />
                                            <div className="input-group-append">
                                                <button className="btn btn-light" type="button" id="button-plus" onClick={handleIncrement}> + </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group col-md">
                                        <button className="btn  btn-primary" onClick={() => addToCart(product)}>
                                            <i className="fas fa-shopping-cart"></i> <span className="text">Mua ngay</span>
                                        </button>
                                        {/* <a href="#" className="btn btn-light">
                                            <i className="fas fa-envelope"></i> <span className="text">Contact supplier</span>
                                        </a> */}
                                    </div>
                                    {attributes.operating_system !== 'Không có' && (<div className="col-12">
                                        <hr></hr>
                                        <h6>Cấu hình {attributes.name}</h6>
                                        <table className="table table-striped" style={{ fontSize: "13px" }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: "150px" }}>Màn hình:</td>
                                                    <td>{attributes.screen}</td>
                                                </tr>
                                                <tr>
                                                    <td>Hệ điều hành:</td>
                                                    <td>{attributes.operating_system}</td>
                                                </tr>
                                                <tr>
                                                    <td>Camera sau:</td>
                                                    <td>{attributes.rear_camera}</td>
                                                </tr>
                                                <tr>
                                                    <td>Camera trước:</td>
                                                    <td>{attributes.front_camera}</td>
                                                </tr>
                                                <tr>
                                                    <td>Chip:</td>
                                                    <td>{attributes.chip}</td>
                                                </tr><tr>
                                                    <td>Ram:</td>
                                                    <td>{attributes.ram}</td>
                                                </tr>
                                                <tr>
                                                    <td>Dung lượng lưu trữ:</td>
                                                    <td>{attributes.rom}</td>
                                                </tr>
                                                <tr>
                                                    <td>Kết nối:</td>
                                                    <td>{attributes.connect}</td>
                                                </tr>
                                                <tr>
                                                    <td>Pin, Sạc:</td>
                                                    <td>{attributes.pin}</td>
                                                </tr>
                                                <tr>
                                                    <td>Kích thước:</td>
                                                    <td>{attributes.size}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    )}

                                    {/* <div className="box">

                                        <h5 className="title-description mb-4" style={{ fontSize: "16px" }}>Tin tức về sản phẩm</h5>

                                        <article className="media mb-3">
                                            <a href="#"><img className="img-sm mr-3" src="images/posts/3.jpg" /></a>
                                            <div className="media-body">
                                                <h6 className="mt-0"><a href="#">How to use this item</a></h6>
                                                <p className="mb-2"> Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                                                    sollicitudin </p>
                                            </div>
                                        </article>

                                        <article className="media mb-3">
                                            <a href="#"><img className="img-sm mr-3" src="images/posts/2.jpg" /></a>
                                            <div className="media-body">
                                                <h6 className="mt-0"><a href="#">New tips and tricks</a></h6>
                                                <p className="mb-2"> Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                                                    sollicitudin </p>
                                            </div>
                                        </article>

                                        <article className="media mb-3">
                                            <a href="#"><img className="img-sm mr-3" src="images/posts/1.jpg" /></a>
                                            <div className="media-body">
                                                <h6 className="mt-0"><a href="#">New tips and tricks</a></h6>
                                                <p className="mb-2"> Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante
                                                    sollicitudin </p>
                                            </div>
                                        </article>
                                    </div> */}
                                </div>
                            </article>
                        </main>
                    </div>
                </div>
            </section>
            {related_accessories.length > 0 ? (
                <section className="padding-bottom-sm container " style={{ paddingTop: "50px" }}>

                    <header className="section-heading heading-line">
                        <h4 className="title-section text-uppercase">Phụ kiện mua cùng</h4>
                    </header>

                    <div className="row row-sm container  flex-nowrap overflow-auto">
                        {related_accessories.map((item, index) => (
                            <div className="col-xl-2 col-lg-3 col-md-4 col-6" style={{ display: "flex" }} key={index}>
                                <div className="card card-sm card-product-grid pt-2" style={{ flexGrow: 1 }}>
                                    <span className="badge badge-danger ml-1 mb-2" style={{ width: "40%" }}> Trả góp 0% </span>
                                    <Link to={`/san-pham/chi-tiet-san-pham/${item.slug}`} className="img-wrap"> <img src={urlImage + 'product/' + item.image} alt="anh sp" /> </Link>
                                    <figcaption className="info-wrap">
                                        <Link href="#" to={`/san-pham/chi-tiet-san-pham/${item.slug}`} className="title" style={{ fontSize: "14px" }}>{item.name}</Link>
                                        <div className="price mt-1 text-danger">{item.price_sale ? formatPrice(item.price_sale) : formatPrice(item.price)}</div>
                                        <div className="price mt-1 text-gray"><del className="12px">{item.price_sale ? formatPrice(item.price) : ''}</del></div>
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

            ) : (<></>)}


            <section className="padding-bottom-sm container" style={{ paddingTop: "50px" }}>

                <div className='row'>
                    <header className="section-heading heading-line col-md-11">
                        <h4 className="title-section text-uppercase">Sản phẩm tương tự</h4>
                    </header>
                    <Link to={`/danh-muc/${product.slug_cat}/10/1/0`} className="section-heading col-md-1 title-section text-success">Xem Thêm</Link>

                </div>
                <div className="row row-sm container">
                    {productOther.map((item, index) => {
                        return (
                            <div className="col-xl-2 col-lg-3 col-md-4 col-6" key={index} style={{ display: "flex" }}>
                                <div className="card card-sm card-product-grid pt-2" style={{ flexGrow: 1 }}>
                                    <Link to={`/san-pham/chi-tiet-san-pham/${item.slug}`}>
                                        <span className="badge badge-danger ml-1 mb-2" style={{ width: "40%" }}> Trả góp 0% </span>
                                        <a href="#" className="img-wrap"> <img src={urlImage + 'product/' + item.image.split(';')[0]} alt="san pham" style={{ objectFit: "contain" }} /> </a>
                                        <figcaption className="info-wrap">
                                            <a href="#" className="title" style={{ fontSize: "14px" }}>{item.name}</a>
                                            <div className="price mt-1 text-danger">{item.price_sale ? formatPrice(item.price_sale) : formatPrice(item.price)}</div>
                                            <div className="price mt-1 text-gray"><del className="12px">{item.price_sale ? formatPrice(item.price) : ''}</del></div>
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
                                    </Link>
                                </div>
                            </div>

                        )
                    })}



                </div>
            </section>


        </>
    );
}
export default Product_Detail;