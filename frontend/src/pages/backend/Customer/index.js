import Notification, { showNotification } from '../Notificatio'; // Import Notification và hàm showNotification


import { Link, useParams } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from "react";
import customerServices from "../../../services/CustomerService";
import { IoLockOpenOutline } from "react-icons/io5";
import { TbLock } from "react-icons/tb";

function CustomerList() {
    const [stamp, setTamp] = useState(0);
    const [qty, setQty] = useState(0);
    const [qty_trash, setQtyTrash] = useState(0);
    const [data, setData] = useState([]);

    // Chuyển đổi giá trị từ chuỗi sang số nguyên
    const { page: pageParam, limit: limitParam } = useParams();
    const page = parseInt(pageParam) || 1; // Mặc định là 1 nếu không có giá trị
    const limit = parseInt(limitParam) || 10; // Mặc định là 10 nếu không có giá trị

    const [pages, setPages] = useState(1);

    useEffect(function () {
        (async function () {
            await customerServices.getAll(limit, page).then(function (result) {
                setData(result.data.users);
                setQtyTrash(result.data.qty_trash);
                setQty(result.data.qty_user);
                setPages(result.data.end_page);
            });
        })();
        setTamp();
    }, [stamp, page, limit]);

    function trashCustomer(id) {
        customerServices.trash(id).then(function (result) {
            if (result.data.success === true) {
                showNotification(result.data.message, 'success');
                setTamp(id);
            } else {
                showNotification(result.data.message, 'error');
            }
        });
    }

    function rescoverTrashCustomer(id) {
        customerServices.rescoverTrash(id).then(function (result) {
            if (result.data.success === true) {
                showNotification(result.data.message, 'success');
                setTamp(id);
            } else {
                showNotification(result.data.message, 'error');
            }
        });
    }

    return (
        <div className="Card">
            <Notification />
            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <strong className="text-primary">KHÁCH HÀNG <sup>({qty})</sup></strong>
                    </div>
                    <div className="col-6 text-end">
                        {/* <Link className="btn btn-success me-2" to={"/admin/customer/create"}>
                            <FaPlus />Thêm
                        </Link> */}
                        {/* <Link className="btn text-danger" to={"/admin/customer/list-trash/10/1"}>   
                            <FaTrash /><sup>{qty_trash}</sup>
                        </Link> */}
                    </div>
                </div>
                <div className="card-body">
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: 30 }} className="text-center">#</th>
                                <th style={{ width: 30 }} className="text-center">Id</th>
                                <th style={{ width: 250 }}>Họ tên</th>
                                <th style={{ width: 250 }}>Email</th>
                                <th style={{ width: 250 }}>Số điện thoại</th>
                                <th style={{ width: 250 }}>Phương thức đăng nhập</th>
                                <th style={{ width: 130 }} className="text-center">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="text-center">{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td className="">{item.phone_number}</td>
                                    <td className="">{item.provider}</td>
                                    <td className="text-center">
                                        <Link className="btn btn-sm btn-success me-1" to={"/admin/list-customer/show/" + item.id}>
                                            <FaEye />
                                        </Link>
                                        {/* <Link className="btn btn-sm btn-primary me-1" to={"/admin/list-customer/update/" + item.id}>
                                            <FaEdit />
                                        </Link> */}
                                        {item.active === 1 ? (
                                            <button onClick={() => trashCustomer(item.id)} className="btn btn-sm btn-danger">
                                                <TbLock />
                                            </button>

                                        ) : (
                                            <button onClick={() => rescoverTrashCustomer(item.id)} className="btn btn-sm btn-info">
                                                <IoLockOpenOutline />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ul className="pagination">
                        <li className="page-item">
                            {page > 1 ? (
                                <Link className="page-link" to={`/admin/customer/${page - 1}/${limit}`}>Previous</Link>
                            ) : (
                                <span className="page-link disabled">Previous</span>
                            )}
                        </li>
                        {Array.from(Array(pages).keys()).map((index) => (
                            <li
                                key={index}
                                className={`page-item ${index + 1 === page ? "active" : ""}`}
                            >
                                <Link
                                    className="page-link"
                                    to={`/admin/customer/${index + 1}/${limit}`}
                                >
                                    {index + 1}
                                </Link>
                            </li>
                        ))}
                        <li className="page-item">
                            {page < pages ? (
                                <Link className="page-link" to={`/admin/customer/${page + 1}/${limit}`}>
                                    Next
                                </Link>
                            ) : (
                                <span className="page-link disabled">Next</span>
                            )}

                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CustomerList;
