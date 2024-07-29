import { useEffect, useState } from "react";
import { Link, useParams} from "react-router-dom";
import apiStaff from "../../../api/apiStaff";

function StaffShow() {

    const {id} = useParams();
    const [user, setUser] = useState([]);

    const [status, setStatus] = useState('Ẩn');

    useEffect(() => {
        apiStaff.getStaffById(id).then((res) => {
            try {
                setUser(res.data);
                if(res.data.status === 1){
                    setStatus('Hiển thị');
                }
            } catch (e) {
                console.log(e);
            }
        })
    }, [])

    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-12">
                            <h1 className="d-inline">Chi tiết tài khoản nhân viên</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="card">
                    <div className="card-header text-right">
                        <Link to="/admin/list-staff" className="btn btn-sm btn-info">
                            <i className="fa fa-reply me-1" aria-hidden="true"></i>
                            Quay lại
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
                                    <td>{user.id}</td>
                                </tr>
                                <tr>
                                    <th>Họ tên</th>
                                    <td>{user.name}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{user.email}</td>
                                </tr>
                                <tr>
                                    <th>Số điện thoại</th>
                                    <td>{user.phone}</td>
                                </tr>
                                <tr>
                                    <th>Password</th>
                                    <td>{user.password}</td>
                                </tr>
                                <tr>
                                    <th>Vai trò</th>
                                    <td>{user.role_name}</td>
                                </tr>
                                <tr>
                                    <th>Đặc quyền</th>
                                    <td>{user.privileges}</td>
                                </tr>
                                <tr>
                                    <th>Trạng thái</th>
                                    <td>{status}</td>
                                </tr>
                                <tr>
                                    <th>Ngày thêm</th>
                                    <td>{user.created_at}</td>
                                </tr>
                                <tr>
                                    <th>Nhân viên thêm</th>
                                    <td>{user.created_name}</td>
                                </tr>
                                <tr>
                                    <th>Ngày cập nhật</th>
                                    <td>{user.updated_at}</td>
                                </tr>
                                <tr>
                                    <th>Nhân viên cập nhật</th>
                                    <td>{user.updated_name}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>

    );
}

export default StaffShow;