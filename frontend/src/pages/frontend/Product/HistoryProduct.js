// ProductItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from './formatPrice'; // Đảm bảo thay đổi đường dẫn nếu bạn đặt file ở một vị trí khác
import { urlImage } from '../../../config';

const ProductItem = ({ product }) => {
    const handleProductClick = () => {
        // Lấy danh sách sản phẩm đã xem từ localStorage
        let viewedProducts = JSON.parse(localStorage.getItem('viewedProducts')) || [];

        // Kiểm tra xem sản phẩm đã tồn tại trong danh sách đã xem chưa
        const existingProductIndex = viewedProducts.findIndex((p) => p.id === product.id);

        // Nếu sản phẩm chưa có trong danh sách đã xem, thêm vào
        if (existingProductIndex === -1) {
            viewedProducts = [...viewedProducts, product];
        }

        // Lưu danh sách đã xem vào localStorage
        localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
    };

    return (
        <div className="col-xl-2 col-lg-3 col-md-4 col-6" key={product.id} style={{ display: 'flex' }}>
            <div className="card card-sm card-product-grid pt-2" style={{ flexGrow: 1 }}>
                <span className="badge badge-danger ml-1 mb-2" style={{ width: '40%' }}>
                    Trả góp 0%
                </span>
                <Link to={`/san-pham/chi-tiet-san-pham/${product.slug}`} className="img-wrap">
                    {' '}
                    <img src={`${urlImage}product/${product.image.split(';')[0]}`} style={{ height: '140px', width: 'auto' }} />
                </Link>
                <figcaption className="info-wrap">
                    <Link to={`/san-pham/chi-tiet-san-pham/${product.slug}`} className="title" style={{ fontSize: '14px' }}>
                        {product.name}
                    </Link>
                    <div className="price mt-1 text-danger">{product.price_sale ? formatPrice(product.price_sale) : formatPrice(product.price)}</div>
                    <div className="price mt-1 text-gray">
                        <del className="12px">{product.price_sale ? formatPrice(product.price) : ''}</del>
                    </div>
                    <p style={{ fontSize: '12px' }}>Quà 900.000đ</p>
                    <div className="rating-wrap mt-2">
                        <ul className="rating-stars">
                            <li style={{ width: '80%' }} className="stars-active">
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
    );
};

export default ProductItem;
