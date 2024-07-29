import { Link } from "react-router-dom";
import { FaRedoAlt, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { urlImage } from "../../../config"
import brandServices from "../../../services/BrandService";
function BrandTrash() {

    const [stamp, setTamp] = useState(0);
    const [qty, setQty] = useState(0);

    const [brands, setBrand] = useState([]);

    useEffect(function () {
        (async function () {
            await brandServices.getAllTrash().then(function (result) {
                setBrand(result.data.trash);
                setQty(result.data.count_trash);
            });
        })();
        setTamp();
    }, [stamp])


    function brandDelete(id) {
        brandServices.remove(id).then(function (result) {
            if (result.data.success === true) {
                alert(result.data.message);
                setTamp(id)
            }
            else {
                alert(result.data.message);
            }
        })
    }


    function rescoverTrash(id) {
        brandServices.getRecover(id).then(function (result) {
            if (result.data.success === true) {
                alert(result.data.message);
                setTamp(id)
            }
            else {
                alert(result.data.message);
            }
        })
    }

    return (
        <div className="Card">
            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <strong className="text-primary">Thùng rác <sup>({qty})</sup></strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link to="/admin/list-brands" className="btn btn-sm btn-info me-3">
                            Quay lại
                        </Link>
                    </div>
                </div>
                {brands.length > 0 ? (
                    <div className="card-body">
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: 30 }} className="text-center">#</th>
                                    <th style={{ width: 130 }} className="text-center">Logo</th>
                                    <th style={{ width: 250 }}>Tên thương hiệu</th>
                                    <th style={{ width: 250 }}>Slug</th>
                                    <th style={{ width: 130 }} className="text-center">Ngày tạo</th>
                                    <th style={{ width: 130 }} className="text-center">Chức năng</th>
                                    <th style={{ width: 30 }} className="text-center">Id</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brands.map((brand, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="text-center">
                                                <input type="checkbox" />
                                            </td>
                                            <td className="text-center">
                                                <img className="img-fluid" style={{ width: 70, height: 50 }} src={urlImage + 'brand/' + brand.image} alt="hinh" />
                                            </td>
                                            <td>{brand.name}</td>
                                            <td>{brand.slug}</td>
                                            <td className="text-center">{brand.created_at}</td>
                                            <td className="text-center">
                                                <Link className="btn btn-sm btn-success me-1" to={"/admin/brand/show/" + brand.id}>
                                                    <FaEye />
                                                </Link>
                                                <button onClick={() => rescoverTrash(brand.id)} className="btn btn-sm btn-warning me-1">
                                                <FaRedoAlt />
                                                </button>
                                                <button onClick={() => brandDelete(brand.id)} className="btn btn-sm btn-danger">
                                                    <FaTrash />
                                                </button>
                                            </td>
                                            <td className="text-center">{brand.id}</td>
                                        </tr>
                                    )
                                })}

                            </tbody>
                        </table>
                    </div>

                ) : (
                    <div className="card-body">
                        <h6 className="text-center">Hiện không có rác !</h6>
                    </div>

                )}
            </div>
        </div>
    );
}

export default BrandTrash; 