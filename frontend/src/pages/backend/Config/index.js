import { useEffect, useState } from "react";
import apiConfig from "../../../api/apiConfig";
import { imageURL } from "../../../api/config";
import { Link } from "react-router-dom";

function Config() {
    const [config, setConfig] = useState([]);

    useEffect(()=>{
        apiConfig.getConfig().then(res => {
            setConfig(res.data);
        })
    },[])



    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-12">
                            <h1 className="d-inline">Cấu hình</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="card">
                    <div className="card-header text-right">
                        <Link to={`/admin/config/update/${config.id}`} className="btn btn-sm btn-info">
                           Cập nhật
                        </Link>
                    </div>
                    <div className="card-body p-2">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th style={{ width: "30%" }}>Tên trường</th>
                                    <th>Giá trị</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>ID</th>
                                    <td>{config.id}</td>
                                </tr>
                                <tr>
                                    <th>Tên shop</th>
                                    <td>{config.author}</td>
                                </tr>
                                <tr>
                                    <th>Logo</th>
                                    <td ><img style={{ width: "250px" }} src={imageURL + config.logo} alt="anh" /></td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{config.email}</td>
                                </tr>
                                <tr>
                                    <th>Số điện thoại </th>
                                    <td>{config.phone}</td>
                                </tr>
                                <tr>
                                    <th>Zalo</th>
                                    <td>{config.zalo}</td>
                                </tr>
                                <tr>
                                    <th>Youtobe</th>
                                    <td>{config.youtobe}</td>
                                </tr>
                                <tr>
                                    <th>Facebook</th>
                                    <td>{config.facebook}</td>
                                </tr>
                                <tr>
                                    <th>Địa chỉ</th>
                                    <td>{config.address}</td>
                                </tr>
                                <tr>
                                    <th>Ngày thêm</th>
                                    <td>{config.created_at}</td>
                                </tr>
                                <tr>
                                    <th>Ngày cập nhật</th>
                                    <td>{config.updated_at}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>

    );
}

export default Config;