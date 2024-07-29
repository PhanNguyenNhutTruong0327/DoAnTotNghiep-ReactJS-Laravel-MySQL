import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiRotateCcw, FiEdit, FiTrash2 } from "react-icons/fi";
import sellService from "../../../services/SaleService";

function SaleShow() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [sale, setSale] = useState([]);

    useEffect(function () {
        (async function () {
            await sellService.getById(id).then(function (result) {
                setSale(result.data.sale)
            });
        })();
    }, [])

    function topicTrash(id) {
        sellService.deleteSell(id).then(function (result) {
            alert(result.data.message);
            navigate("/admin/list-sale-be", { replace: true });

        })
    }
    return (
        <div className="card" style={{ paddingLeft: "40px" }}>
            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <strong className="text-primary">CHI TIẾT</strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link className="btn btn-sm btn-primary me-1" to={"/admin/list-sale/update/" + sale.id}><FiEdit />Sửa</Link>
                        {/* <button onClick={() => topicTrash(sale.id)} className="btn btn-sm btn-danger me-1">
                            <FiTrash2 />xóa
                        </button> */}
                        <Link to="/admin/list-sale-be" className="btn btn-sm btn-info"><FiRotateCcw />Quay lại</Link>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <table className="table table table-striped table-bordered table-hover ">
                    <thead>
                        <tr>
                            <th style={{ width: 200 }}>Tên trường</th>
                            <th>Giá trị</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Id</th>
                            <td>{sale.id}</td>
                        </tr>
                        <tr>
                            <th>Chủ đề</th>
                            <td>{sale.title}</td>
                        </tr>
                        <tr>
                            <th>Slug</th>
                            <td>{sale.slug}</td>
                        </tr>
                        <tr>
                            <th>Phần trăm sale</th>
                            <td>{sale.percent_sale}%</td>
                        </tr>

                        <tr>
                            <th>Ngày tạo</th>
                            <td>{sale.created_at}</td>
                        </tr>
                        <tr>
                            <th>Ngày cập nhật</th>
                            <td>{sale.updated_at}</td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>{sale.status === 1 ? "Hiển thị" : "Ẩn"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default SaleShow; 