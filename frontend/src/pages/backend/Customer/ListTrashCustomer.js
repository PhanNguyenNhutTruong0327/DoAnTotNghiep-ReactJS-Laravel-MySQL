import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiCustomer from "../../../api/apiCustomer";

function ListTrashCustomer() {

    const [listTrash, setListTrash] = useState([]);
    const [qty_trash, setQtyTrash] = useState(0);
    const [tamp, setTamp] = useState();

    useEffect(() => {
        apiCustomer.getListTrash('customer').then((res) => {
            setListTrash(res);
            setQtyTrash(res.qty_trash);
        })
    }, [tamp])

    // rescover trash brand
    function rescoverTrash(id) {
        apiCustomer.rescoverTrash(id).then(function (result) {
            alert("Phục hồi thành công !");
            setTamp(result.data.id);
        })
    }

    const delCustomer = async (id) => {
        apiCustomer.delCustomerById(id).then((res) => {
            try {
                alert("Xóa dữ liệu thành công !");
                setTamp(id);
            }
            catch (e) {
                console.log(e);
            }
        })
    }

    if (listTrash.length !== 0) {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-10">
                                <h1 className="d-inline">Thùng rác <sup>{qty_trash}</sup></h1>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <div className="card">
                        <div className="card-header text-right">
                            <Link to="/admin/list-customer" className="btn btn-sm btn-info">
                                <i className="fa fa-reply me-1" aria-hidden="true"></i>
                                Quay lại
                            </Link>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-2"></div>
                                <div className="col-md-8">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th className="text-center" style={{ width: "30px" }}>
                                                    <input type="checkbox" />
                                                </th>
                                                <th>Id</th>
                                                {/* <th className="text-center" style={{ width: "130px" }}>Hình ảnh</th> */}
                                                <th>Họ tên</th>
                                                <th>Email</th>
                                                <th>Số điện thoại</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listTrash.map((item, index) => {
                                                return (
                                                    <tr className="datarow" key={index}>
                                                        <td>
                                                            <input type="checkbox" />
                                                        </td>
                                                        <td>{item.id}</td>
                                                        {/* <td>
                                                                <img src="../public/images/category.jpg" alt="category.jpg" />
                                                            </td> */}
                                                        <td>
                                                            <div className="name">
                                                                {item.name}
                                                            </div>
                                                            <div className="function_style" style={{ fontSize: "14px" }}>
                                                                <Link to={`/admin/list-sale/show/${item.id}`} className="btn btn-sm"><i className="fa fa-eye me-1"></i>Chi tiết</Link> |
                                                                <button onClick={() => rescoverTrash(item.id)} className="btn btn-sm"><i className="fa fa-history me-1" aria-hidden="true"></i>Phục hồi</button> |
                                                                <button onClick={() => delCustomer(item.id)} className="btn btn-sm"><i className="fa fa-trash me-1"></i>Xoá</button>
                                                            </div>
                                                        </td>
                                                        <td>{item.email}</td>
                                                        <td>{item.phone}</td>
                                                        {/* <td>{item.icon}</td>
                                                        <td>{item.description}</td> */}
                                                    </tr>

                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        );
    }
    else {
        return (
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-10">
                                <h1 className="d-inline">Thùng rác</h1>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <div className="card">
                        <div className="card-header text-right">
                            <Link to="/admin/list-customer" className="btn btn-sm btn-info">
                                <i className="fa fa-reply me-1" aria-hidden="true"></i>
                                Quay lại
                            </Link>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    <p>Hiện tại không có rác !</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        );

    }

}

export default ListTrashCustomer;