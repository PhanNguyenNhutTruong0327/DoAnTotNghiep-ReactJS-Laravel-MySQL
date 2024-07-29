import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { urlImage } from "../../../config";
import productServices from "../../../services/ProductService";

function Product_Search() {

    const { key } = useParams('key');
    const { page } = useParams('page');
    const { limit } = useParams('limit');

    const [qty, setQty] = useState(0);
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState(0);
    const [filterPrice, setFilterPrice] = useState({ "min": 0, "max": 0 });


    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };

    const [pages, setPages] = useState(1);


    useEffect(() => {
        (async () => {
            await productServices.getSearchProductByName(key, limit, page, filter, filterPrice).then(res => {
                setProducts(res.data.products);
                setPages(res.data.qty_page);
                setQty(res.data.qty)
                setPages(res.data.qty_page);
            })
        })()
    }, [key, page, filter, filterPrice])

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);

    const handleFilterPrice = (min, max) => {
        setFilterPrice({
            min: min,
            max: max,
        });
    }

    const FilterByPriceChange = () => {
        setFilterPrice({
            min: minPrice,
            max: maxPrice
        });
    }

    return (
        <section className="padding-bottom-sm container">
            <header className="section-heading heading-line">
                <h4 className="title-section text-uppercase1">Tìm kiếm sản phẩm</h4>
            </header>


            <div class="card mb-3">
                <div class="card-body">
                    <hr />
                    <div class="row">
                        <div class="col-md-2">Bộ lọc</div>
                        <div class="col-md-10">
                            <ul class="list-inline">
                                <li class="list-inline-item mr-3 dropdown"><a href="#" class="dropdown-toggle"
                                    data-toggle="dropdown"> Xếp theo </a>
                                    <div class="dropdown-menu p-3" style={{ maxWidth: "400px" }}>
                                        <label class="form-check">
                                            <input type="radio" value={filter} onChange={(e) => setFilter(2)} name="myfilter" class="form-check-input" /> Giá từ thấp đến cao
                                        </label>
                                        <label class="form-check">
                                            <input type="radio" value={filter} onChange={(e) => setFilter(1)} name="myfilter" class="form-check-input" />Giá từ cao đến thấp
                                        </label>
                                    </div>
                                </li>
                                <li class="list-inline-item mr-3"><button onClick={() => handleFilterPrice(0, 2000)} className="btn btn-outline-secondary btn-sm">Dưới 2 triệu</button></li>
                                <li class="list-inline-item mr-3"><button onClick={() => handleFilterPrice(2000, 4000)} className="btn btn-outline-secondary btn-sm">Từ 2 - 4 triệu</button></li>
                                <li class="list-inline-item mr-3"><button onClick={() => handleFilterPrice(4000, 7000)} className="btn btn-outline-secondary btn-sm" >Từ 4 - 7 triệu</button></li>
                                <li class="list-inline-item mr-3"><button onClick={() => handleFilterPrice(7000, 10000)} className="btn btn-outline-secondary btn-sm" >Từ 7 - 10 triệu</button></li>
                                <li class="list-inline-item mr-3"><button onClick={() => handleFilterPrice(10000, 'max')} className="btn btn-outline-secondary btn-sm" >Trên 10 triệu</button></li>

                                <li class="list-inline-item mr-3">
                                    <div class="form-inline">
                                        <label class="mr-2">Giá</label>
                                        <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} step={100} min={300} max={49000} class="form-control form-control-sm" placeholder="Min" type="number" />
                                        <span class="px-2"> - </span>
                                        <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} step={100} min={400} max={50000} class="form-control form-control-sm" placeholder="Max" type="number" />
                                        <button onClick={() => FilterByPriceChange()} type="submit" class="btn btn-sm btn-light ml-2">Ok</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <strong class="mr-md-auto">{qty} sản phẩm </strong>
            <div className="row row-sm">
                {products.map((item, index) => (

                    <div className="col-xl-2 col-lg-3 col-md-4 col-6" key={index} style={{ display: "flex" }}>
                        <div className="card card-sm card-product-grid pt-2" style={{ flexGrow: 1 }}>
                            <span className="badge badge-danger ml-1 mb-2" style={{ width: "40%" }}> Trả góp 0% </span>
                            <a href="#" className="img-wrap"> <img src={urlImage + 'product/' + item.image.split(';')[0]} style={{ height: "140px", width: "auto" }} /> </a>
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

                        </div>
                    </div>


                ))}
            </div>
            <ul className="pagination">
                <li className="page-item">
                    {page > 1 ? (
                        <Link className="page-link" to={`/tim-kiem/${key}/${limit}/${page - 1}`}>Previous</Link>
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
                            to={`/tim-kiem/${key}/${limit}/${index + 1}`}
                        >
                            {index + 1}
                        </Link>
                    </li>
                ))}
                <li className="page-item">
                    {page < pages ? (

                        <Link className="page-link" to={`/tim-kiem/${key}/${limit}/${Number(page) + 1}`}>
                            Next
                        </Link>
                    ) : (
                        <span className="page-link disabled">Next</span>

                    )}
                </li>
            </ul>

        </section>

    );
}

export default Product_Search;