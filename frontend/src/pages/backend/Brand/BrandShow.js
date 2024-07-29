import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// import { imageURL } from "../../../api/config";
import brandServices from "../../../services/BrandService";
import { urlImage } from "../../../config";

function BrandShow() {

    const { id } = useParams();
    const [brand, setBrand] = useState([]);

    useEffect(() => {
        brandServices.getById(id).then((res) => {
            try {
                setBrand(res.data.brand);
            } catch (e) {
                console.log(e);
            }
        })
    }, [])

    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">

                </div>
            </section>

            <section className="content">
                <div className="card" style={{ paddingLeft: "40px" }}>
                    <div className="row">
                    <div className="col-md-10 card-header">
                        <h5 className="d-inline text-danger">CHI TIẾT THƯƠNG HIỆU</h5>
                    </div>
                    <div className="col-md-2 card-header text-right">
                        <Link to="/admin/list-brands" className="btn btn-sm btn-info">
                            <i className="fa fa-reply me-1" aria-hidden="true"></i>
                            Quay lại
                        </Link>
                    </div>
                    </div>
                    <div className="card-body p-2">
                        <table className="table table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: "30%" }}>Tên trường</th>
                                    <th>Giá trị</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>ID</th>
                                    <td>{brand.id}</td>
                                </tr>
                                <tr>
                                    <th>Tên thương hiệu</th>
                                    <td>{brand.name}</td>
                                </tr>
                                <tr>
                                    <th>Slug</th>
                                    <td>{brand.slug}</td>
                                </tr>
                                <tr>
                                    <th>Icon</th>
                                    <td>
                                        <img className="img-fluid" style={{ width: 150, height: 150 }} src={urlImage + 'brand/' + brand.image} alt="Logo" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>{brand.status == 1 ? "Hiển thị" : "Ẩn"}</td>
                                </tr>
                                <tr>
                                    <th>Ngày thêm</th>
                                    <td>{brand.created_at}</td>
                                </tr>
                                {/* <tr>
                                    <th>Nhân viên thêm</th>
                                    <td>{brand.created_name}</td>
                                </tr> */}
                                <tr>
                                    <th>Ngày cập nhật</th>
                                    <td>{brand.updated_at}</td>
                                </tr>
                                {/* <tr>
                                    <th>Nhân viên cập nhật</th>
                                    <td>{brand.updated_name}</td>
                                </tr> */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>

    );
}

export default BrandShow;