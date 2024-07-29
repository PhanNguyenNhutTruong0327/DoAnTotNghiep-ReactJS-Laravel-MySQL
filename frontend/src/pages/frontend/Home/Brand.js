import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import brandServices from "../../../services/BrandService";
import { urlImage } from "../../../config";

function Brand() {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        try {
            (async () => {
                await brandServices.getListBrands().then(res => {
                    setBrands(res.data.brands);
                })
            })()
        } catch (e) { console.log(e) }
    }, [])

    return (
        <aside className="col-lg col-md-3 flex-lg-grow-0">
            <nav className="nav-home-aside">
                <h6 className="title-category">THƯƠNG HIỆU <i className="d-md-none icon fa fa-chevron-down"></i>
                </h6>
                <ul className="menu-category pt-3">
                    {brands.map((item, index) => {
                        return (
                            <li className="d-flex" key={index}>
                                <img className="pt-2" src={urlImage + 'brand/' + item.image} alt="icon" style={{ width: "40%", height: "40%" }} />
                                <Link to={`/thuong-hieu/${item.slug}/10/1`} className="ps-3">{item.name}</Link>
                            </li>

                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
export default Brand;