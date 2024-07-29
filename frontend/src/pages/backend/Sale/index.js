import { Link } from "react-router-dom";
import { FiPlus, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import sellService from "../../../services/SaleService";
import Notification, { showNotification } from '../Notificatio'; // Import Notification và hàm showNotification

function SaleList() {

    const [sales, setSales] = useState([]);
    const [qty, setQty] = useState(0);
    const [qty_trash, setQtyTrash] = useState(0);
    const [tamp, setTamp] = useState();


    useEffect(function () {
        (async function () {
            try {
                await sellService.getListSaleBE().then(function (result) {
                    setSales(result.data.sells);
                    setQty(result.data.qty_sells);
                    setQtyTrash(result.data.qty_trash);
                });
            } catch (e) { console.log(e) }
        })();
        setTamp();
    }, [tamp])
    // function topicDelete(id) {
    //     topicservices.remove(id).then(function (result) {
    //         alert(result.data.message);
    //         setStatusDelete(result.data.id)
    //     })
    // }
    function sellTrash(id) {
        sellService.trash(id).then(function (result) {
            if (result.data.success) {
                showNotification(result.data.message,'success');
                setTamp(id);
            }
            else {
                showNotification(result.data.message,'warning');
            }
        })
    }

    return (
        <div className="card" style={{ paddingLeft: "40px" }}>
            <Notification/>
            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <strong className="text-primary">CHƯƠNG TRÌNH GIẢM GIÁ <sup style={{ fontSize: "1rem" }}>({qty})</sup></strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link to="/admin/list-sale-be/create" className="btn btn-sm btn-success"><FiPlus />Thêm</Link>
                        <Link className=" btn text-danger" to={"/admin/list-sale/list-trash"}>
                            <FaTrash /><sup>{qty_trash}</sup>
                        </Link>

                    </div>


                </div>
            </div>
            <div className="card-body">
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: "30" }} className="text-center">#</th>
                            <th style={{ width: "100" }} className="text-center">Tiêu đề</th>
                            <th className="text-center">Phần trăm sale</th>
                            <th style={{ width: "100" }} className="text-center">Ngày tạo</th>
                            <th style={{ width: "30" }} className="text-center">Status</th>
                            <th style={{ width: "140" }} className="text-center">Chức năng</th>
                            <th style={{ width: "30" }} className="text-center">ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map(function (topic, index) {
                            return (
                                <tr key={index}>
                                    <td className="text-center">
                                        <input type="checkbox"></input>
                                    </td>
                                    <td style={{ width: "30" }} className="text-center">{topic.title}</td>
                                    <td className="text-center">{topic.percent_sale}%</td>
                                    <td className="text-center">{topic.created_at}</td>
                                    <td className="text-center">{topic.status === 1 ? "Hiển thị" : "Ẩn"}</td>
                                    <td className="text-center">
                                        <Link className="btn btn-sm btn-info me-1" to={"/admin/list-sale/show/" + topic.id}><FiEye /></Link>
                                        <Link className="btn btn-sm btn-primary me-1" to={"/admin/list-sale/update/" + topic.id}><FiEdit /></Link>
                                        <button onClick={() => sellTrash(topic.id)} className="btn btn-sm btn-danger">
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                    <td className="text-center">{topic.id}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default SaleList;
