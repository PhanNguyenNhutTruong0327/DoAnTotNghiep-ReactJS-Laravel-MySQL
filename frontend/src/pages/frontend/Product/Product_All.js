import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import productServices from '../../../services/ProductService';
import { setDate } from 'date-fns';
import { urlImage } from '../../../config';
import brandServices from '../../../services/BrandService';

function Product_All() {

    const [data, setData] = useState([]);

    const { page } = useParams('page');
    const { limit } = useParams('limit');

    const [pages, setPages] = useState(1);
    const [brands, setBrands] = useState([]);
    const [brand, setBrand] = useState(0);
    const [qty, setQty] = useState(0);
    const [filter, setFilter] = useState(0);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [filterPrice, setFilterPrice] = useState({ "min": 0, "max": 0 });


    const formatPrice = (price) => {
        const roundedPrice = Math.round(price);
        const formattedPrice = new Intl.NumberFormat('vi-VN').format(roundedPrice);
        return formattedPrice.replace(/,/g, '.') + '.000';
    };


    // useEffect(() => {
    //     (async () => {
    //         await productServices.getAllProducts(limit, page, 0).then(res => {
    //             try {
    //                 setData(res.data.products);
    //             } catch (e) { console.log(e) }
    //         })

    //     })()
    // }, [page])

    useEffect(() => {
        (async () => {    
            try {
                const [productsResponse, brandsResponse] = await Promise.all([
                    productServices.getAllProducts(limit, page, filter, filterPrice, brand),
                    brandServices.getListBrands(),
                ]);
    
                setData(productsResponse.data.products);
                setPages(productsResponse.data.qty_page);
                setBrands(brandsResponse.data.brands);
                setQty(productsResponse.data.qty);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [ page, filter, filterPrice, brand]);



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

    const handleBrand = (brand) => {
        setBrand(brand);
    }


    return (
        <div className='container'>
            <section className="padding-bottom-sm">

                <header className="section-heading heading-line">
                    <h4 className="title-section text-uppercase">Tất cả sản phẩm</h4>
                </header>

                <div class="card mb-3">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-10">
                                <ul class="list-inline">
                                    {brands && brands.map((item, index) => (
                                        <li class="list-inline-item mr-3">
                                            <button onClick={()=>handleBrand(item.id)} className="btn border" >
                                                <img src={urlImage + 'brand/' + item.image} alt='' className='' style={{width:"100px"}}/>
                                            </button>
                                            </li>
                                    ))}
                                    {/* // <li class="list-inline-item mr-3"><a className="btn btn-outline-secondary btn-sm" href="#">Từ 2 - 4 triệu</a></li>
                                    // <li class="list-inline-item mr-3"><a className="btn btn-outline-secondary btn-sm" href="#">Từ 4 - 7 triệu</a></li>
                                    // <li class="list-inline-item mr-3"><a className="btn btn-outline-secondary btn-sm" href="#">Từ 7 - 10 triệu</a></li>
                                    // <li class="list-inline-item mr-3"><a className="btn btn-outline-secondary btn-sm" href="#">Trên 10 triệu</a></li> */}
                                </ul>
                            </div>
                        </div>
                        <hr />
                        <div class="row">
                            <div class="col-md-2">Bộ lọc</div>
                            <div class="col-md-10">
                                <ul class="list-inline">
                                    <li class="list-inline-item mr-3 dropdown"><a href="#" class="dropdown-toggle"
                                        data-toggle="dropdown"> Xếp theo </a>
                                        <div class="dropdown-menu p-3" style={{ maxWidth: "400px" }}>
                                            <label class="form-check">
                                                <input type="radio" value={filter} onChange={(e)=>setFilter(2)} name="myfilter" class="form-check-input" /> Giá từ thấp đến cao
                                            </label>
                                            <label class="form-check">
                                                <input type="radio" value={filter} onChange={(e)=>setFilter(1)} name="myfilter" class="form-check-input" />Giá từ cao đến thấp
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
                                            <input value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} step={100} min={300} max={49000} class="form-control form-control-sm" placeholder="Min" type="number" />
                                            <span class="px-2"> - </span>
                                            <input value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} step={100} min={400} max={50000} class="form-control form-control-sm" placeholder="Max" type="number" />
                                            <button  onClick={() => FilterByPriceChange()} type="submit" class="btn btn-sm btn-light ml-2">Ok</button>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>



                <br />
                <strong class="mr-md-auto">{qty} sản phẩm </strong>
                <div className="row row-sm">
                    {data.map((item, index) => (

                        <div className="col-xl-2 col-lg-3 col-md-4 col-6" key={index} style={{ display: "flex" }}>
                            <div className="card card-sm card-product-grid pt-2" style={{ flexGrow: 1 }}>
                                <span className="badge badge-danger ml-1 mb-2" style={{ width: "40%" }}> Trả góp 0% </span>
                                <Link to={`/san-pham/chi-tiet-san-pham/${item.slug}`} className="img-wrap"> <img src={urlImage + 'product/' + item.image.split(';')[0]} style={{ height: "140px", width: "auto" }} /></Link>
                                <figcaption className="info-wrap">
                                    <Link to={`/san-pham/chi-tiet-san-pham/${item.slug}`} className="title" style={{ fontSize: "14px" }}>{item.name}</Link>
                                    <div className="price mt-1 text-danger">{item.price_sale ? formatPrice(item.price_sale) : formatPrice(item.price)}</div>
                                    <div className="price mt-1 text-black"><del style={{fontSize:"13px"}}>{item.price_sale ? formatPrice(item.price) : ''}</del></div>
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
            <ul className="pagination mb-2">
                <li className="page-item">
                    {page > 1 ? (
                        <Link className="page-link" to={`/san-pham/${limit}/${page - 1}/0`}>Previous</Link>
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
                            to={`/san-pham/${limit}/${index + 1}/0`}
                        >
                            {index + 1}
                        </Link>
                    </li>
                ))}
                <li className="page-item">
                    {page < pages ? (
                        <Link className="page-link" to={`/san-pham/${limit}/${Number(page) + 1}/0`}>
                            Next
                        </Link>) : (
                        <span className="page-link disabled">Next</span>
                    )}
                </li>
            </ul>

        </div>

    );
}

export default Product_All;