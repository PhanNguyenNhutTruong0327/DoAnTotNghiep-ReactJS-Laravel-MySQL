import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { urlImage } from "../../../config";
import productServices from "../../../services/ProductService";
import "../../../assets/frontend/css/style.css";

function Sale() {
	const [data, setData] = useState([]);

	const formatPrice = (price) => {
		const roundedPrice = Math.round(price);
		const formattedPrice = new Intl.NumberFormat("vi-VN").format(roundedPrice);
		return formattedPrice.replace(/,/g, ".") + ".000";
	};

	useEffect(() => {
		try {
			(async () => {
				const res = await productServices.getProductSale(4);
				setData(res.data.products);
			})();
		} catch (e) {
			console.log(e);
		}
	}, []);

	if (data.length > 0) {
		return (
			<section className="padding-bottom">
				<div className="card card-deal">
					<div className="col-heading content-body" style={{ backgroundColor: "#ffb3b3", border: "none" }}>
						<header className="section-heading">
							<h3 className="section-title animated-text" data-text="GIÁ SỐC SINH NHẬT">
								<span>GIÁ SỐC SINH NHẬT</span>
								<span className="icon icon-left"></span>
								<span className="icon icon-right"></span>
							</h3>
							<p className="text-white">
								<strong>Kết thúc trong:</strong>
							</p>
						</header>
						<div className="timer">
							<div> <span className="num">04</span> <small>Ngày</small></div>
							<div> <span className="num">12</span> <small>Giờ</small></div>
							<div> <span className="num">58</span> <small>Phút</small></div>
							<div> <span className="num">02</span> <small>Giây</small></div>
						</div>
					</div>
					<div className="row no-gutters items-wrap">
						{data.map((item, index) => (
							<div className="col-lg-3 col-md-4 col-6" key={index}>
								<figure className="card-product-grid card-sm pt-3">
									<Link to={`/san-pham/chi-tiet-san-pham/${item.slug}`} className="img-wrap">
										<img
											src={urlImage + "product/" + item.image.split(";")[0]}
											style={{ maxHeight: "140px", width: "auto", border: "none" }}
											alt={item.name}
										/>
									</Link>
									<small className="label-rating text-success">
										<i className="fa fa-clipboard-check"></i> Số lượng: {item.qty_sold}/{item.qty_sale}
									</small>
									<div className="text-wrap pb-3">
										<a href="#" className="title p-1">{item.name}</a>
										<br />
										<span style={{ color: "red" }}>{formatPrice(item.price_sale)}<sup>đ</sup></span>
										<br />
										<span style={{ color: "black" }}>
											<del>{formatPrice(item.price)}<sup>đ</sup></del>
										</span>
										<span className="badge badge-danger" style={{ position: "absolute", top: 0, left: 0, margin: "5px 5px 10px 10px" }} > Khuyến mãi lớn </span>
										<br/>
										<span className="badge badge-danger" style={{ fontSize: "11px" }} > -{item.percent_sale}% </span>
									</div>
								</figure>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	} else {
		return null; // Handle case when data is not available
	}
}

export default Sale;
