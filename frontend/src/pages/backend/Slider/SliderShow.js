import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import sliderservices from "../../../services/BannerServiec";
import { FiRotateCcw, FiEdit, FiTrash2 } from "react-icons/fi";
import { urlImage } from "../../../config";

function SliderShow() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [sliders, setslider] = useState([]);

    useEffect(function () {
        (async function () {
            try {
                await sliderservices.getById(id).then(function (result) {
                    setslider(result.data.banner)
                });

            } catch (e) { console.log(e) };
        })();
    }, [])

    function sliderDelete(id) {
        sliderservices.remove(id).then(function (result) {
            alert(result.data.message);
            navigate("/admin/list-banners", { replace: true });

        })
    }
    return (
        <div className="card"style={{ paddingLeft: "40px" }}>
            {console.log(id)}
            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <strong className="text-primary">CHI TIẾT SLIDER</strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link className="btn btn-sm btn-primary me-1" to={"/admin/list-banners/update/" + sliders.id}><FiEdit />Sửa</Link>
                        {/* <button onClick={() => sliderDelete(sliders.id)} className="btn btn-sm btn-danger me-1">
                            <FiTrash2 />
                        </button> */}
                        <Link to="/admin/list-banners" className="btn btn-sm btn-info"><FiRotateCcw />Quay lại</Link>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: 200 }}>Tên trường</th>
                            <th>Giá trị</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Id</th>
                            <td>{sliders.id}</td>
                        </tr>
                        <tr>
                            <th>Tên slider</th>
                            <td>{sliders.name}</td>
                        </tr>
                        <tr>
                            <th>Link</th>
                            <td>{sliders.link}</td>
                        </tr>
                        <tr>
                            <th>Sắp xếp</th>
                            <td>{sliders.sort_order}</td>
                        </tr>
                        <tr>
                            <th>Vị trí</th>
                            <td>{sliders.position}</td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>{sliders.status}</td>
                        </tr>
                        <tr>
                            <th>Hình ảnh</th>
                            <img src={urlImage + "banner/" + sliders.image} alt="hinh" className="img_fluid" style={{ width: 100 }} />
                        </tr>
                        <tr>
                            <th>Ngày thêm</th>
                            <td>{sliders.created_at}</td>
                        </tr>
                        <tr>
                            <th>Ngày cập nhật</th>
                            <td>{sliders.updated_at}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default SliderShow;