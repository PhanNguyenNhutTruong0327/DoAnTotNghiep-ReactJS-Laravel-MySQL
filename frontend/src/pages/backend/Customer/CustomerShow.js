import { Link, useParams } from "react-router-dom";
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from "react";
import customerServices from "../../../services/CustomerService";


function CustomerShow() {

    const { id } = useParams("id")
    const [data, setData] = useState([]);

    useEffect(function () {
        (async function () {
            await customerServices.show(id).then(function (result) {
                setData(result.data.customer);
            });
        })();
    }, [])

    function brandTrash(id) {
        // brandservice.trash(id).then(function (result) {
        //     alert(result.data.message);
        //     navigate("/admin/brand", { replace: true });
        // })
    }

    return (
        <div className="card" style={{ paddingLeft: "40px" }}>
            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <strong className="text-primary">Chi tiết khách hàng</strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link className="btn btn-sm btn-success me-1" to="/admin/list-customer/1/10">
                            Quay lại
                        </Link>
                        {/* <Link className="btn btn-sm btn-primary me-1" to={"/admin/customer/update/" + data.id}>
                            <FaRegEdit /> Sửa
                        </Link>
                        <button onClick={() => brandTrash(data.id)} className="btn btn-sm btn-danger">
                            <FaTrash /> Xóa
                        </button> */}

                    </div>
                </div>
            </div>
            <div className="card-body">
                <table className="table table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: 200 }}>Tên Trường</th>
                            <th>Gía Trị</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Id</th>
                            <th>{data.id}</th>
                        </tr>
                        <tr>
                            <th>Họ tên</th>
                            <th>{data.name}</th>
                        </tr>
                        <tr>
                            <th>Số điện thoại</th>
                            <th>{data.phone_number}</th>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <th>{data.email}</th>
                        </tr>
                        <tr>
                            <th>Password</th>
                            <th>{data.password_hash}</th>
                        </tr>
                        <tr>
                            <th>Địa chỉ 1</th>
                            <th>{data.address_1}</th>
                        </tr>
                        <tr>
                            <th>Địa chỉ 2</th>
                            <th>{data.address_2}</th>
                        </tr>
                        <tr>
                            <th>Ngày thêm</th>
                            <th>{data.created_at}</th>
                        </tr>
                        <tr>
                            <th>Trạng thái</th>
                            <th>{data.active === 1 ? "Hoạt động" : "Khóa"}</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default CustomerShow;