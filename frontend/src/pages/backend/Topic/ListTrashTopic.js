import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import topicservices from '../../../services/TopicService';
import { FaHistory, FaTimesCircle } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function List_Trash() {
    const [trash, setTrash] = useState([]);
    const [countTrash, setCountTrash] = useState(0);

    useEffect(() => {
        (async () => {
            await topicservices.listTrash().then((res) => {
                setTrash(res.data.trash || []); // Đảm bảo trash là một mảng
            }).catch(error => {
                console.error('Lỗi khi lấy chủ đề trong thùng rác:', error);
                setTrash([]);
            });
        })();
    }, [countTrash]);

    function RescoverTrash(id) {
        topicservices.getRecover(id).then(function (result) {
            showNotification(result.data.message, result.data.success);
            setCountTrash(prevCount => prevCount + 1);
        }).catch(error => {
            console.error('Lỗi khi khôi phục chủ đề:', error);
        });
    }

    function deleted(id) {
        topicservices.remove(id).then(function (result) {
            showNotification(result.data.message, result.data.success);
            setCountTrash(prevCount => prevCount + 1);
        }).catch(error => {
            console.error('Lỗi khi xóa chủ đề:', error);
        });
    }

    const showNotification = (message, success) => {
        if (success) {
            toast.success(message, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: "toast-container"
            });
        } else {
            toast.error(message, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: "toast-container"
            });
        }
    };

    if (trash.length === 0) {
        return (
            <div className="content-wrapper" style={{ paddingLeft: "40px" }}>
                <ToastContainer />
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-12">
                                <div className="row">
                                    <div className="col-sm-9">
                                        <h1 className="d-inline">Thùng rác</h1>
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="text-right ms-5">
                                            <Link to="/admin/list-topic" className="btn btn-sm btn-info me-3">
                                                <i className="fa fa-reply me-1" aria-hidden="true"></i>
                                                Quay lại
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <div className="card">
                        <div className="card-header">
                            <h6>Hiện không có chủ đề nào!</h6>
                        </div>
                    </div>
                </section>
            </div>
        );
    } else {
        return (
            <div className="content-wrapper">
                <ToastContainer />
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-12">
                                <div className="row">
                                    <div className="col-sm-9">
                                        <h1 className="d-inline">Thùng rác</h1>
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="text-right ms-5">
                                            <Link to="/admin/list-topic" className="btn btn-sm btn-info me-3">
                                                <i className="fa fa-reply me-1" aria-hidden="true"></i>
                                                Quay lại
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-9 d-flex">
                                    <select name="" id="" className="form-control d-inline" style={{ width: "100px" }}>
                                        <option value="">Xoá</option>
                                    </select>
                                    <button className="btn btn-sm btn-success ms-2">Áp dụng</button>
                                </div>
                                <div className="col-3">
                                    <div className="d-flex float-right">
                                        <input type="text" className="form-control" style={{ width: "100%", height: "70%" }} />
                                        <button className="btn"><i className="fa fa-search"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered" id="mytable">
                                <thead>
                                    <tr>
                                        <th className="text-center" style={{ width: "30px" }}>
                                            <input type="checkbox" />
                                        </th>
                                        <th style={{ width: "300px" }}>Tên chủ đề</th>
                                        <th>Slug</th>
                                        <th>Ngày xóa</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trash.map((tra, index) => (
                                        <tr className="datarow" key={index}>
                                            <td>
                                                <input type="checkbox" />
                                            </td>
                                            <td>
                                                <div className="name">{tra.name}</div>
                                            </td>
                                            <td>{tra.slug}</td>
                                            <td>{tra.updated_at}</td>
                                            <td className="text-center">
                                                <button onClick={() => RescoverTrash(tra.id)} className="btn btn-outline-success me-2">
                                                    <FaHistory />
                                                </button>
                                                <button onClick={() => deleted(tra.id)} className="btn btn-outline-danger">
                                                    <FaTimesCircle />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="pagination justify-content-center">
                            {/* <Pagination page={page} count={end_page} onChange={handleChange} /> */}
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default List_Trash;
