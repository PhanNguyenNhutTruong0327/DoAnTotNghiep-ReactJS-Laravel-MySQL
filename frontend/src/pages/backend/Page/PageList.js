import { Link } from "react-router-dom";
import { FaPlus, FaRegEye, FaEdit, FaRegTrashAlt, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify'; // import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // import toast styles
import { urlImage } from '../../../config';
import pageService from "../../../services/PageService";
import postServices from "../../../services/PostService";

function PageList() {
    const [pages, setPages] = useState([]);
    const [qty, setQty] = useState(0);
    const [qty_trash, setQtyTrash] = useState(0);
    const [tamp, setTamp] = useState(0);

    useEffect(function () {
        (async function () {
            try {
                await pageService.getAll().then(function (result) {
                    setPages(result.data.page);
                    setQty(result.data.count_page);
                    setQtyTrash(result.data.count_trash);
                });
            } catch (e) {
                console.log(e);
            }
        })();
        setTamp();
    }, [tamp]);

    function postTrash(id) {
        postServices.trash(id).then(function (result) {
            if (result.data.success === true) {
                showTrashNotification(result.data.message); // show success notification
                setTamp(id);
                setTimeout(() => {
                    setTamp(0);
                }, 3000);
            } else {
                showTrashNotification('Xoá không thành công!'); // show failure notification
            }
        }).catch(error => {
            console.error('Error trashing post:', error);
            showTrashNotification('Có lỗi xảy ra!'); // show error notification
        });
    }

    const showTrashNotification = (message) => {
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
    };

    return (
        <div className="card">
            <ToastContainer /> {/* Ensure ToastContainer is rendered in the component */}
            <div className="card-header">
                <div className="row">
                    <div className="col-md-6">
                        <strong className="text-danger">Danh sách trang đơn<sup style={{ fontSize: "14px" }}>({qty})</sup></strong>
                    </div>
                    <div className="col-md-6 text-end">
                        <Link to="/admin/page/create" className="btn btn-sm btn-success">
                            <FaPlus /> Thêm
                        </Link>
                        <Link className=" btn text-danger" to={"/admin/page/list-trash/1/10"}>
                            <FaTrash /><sup>{qty_trash}</sup>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: 30 }} className="text-center">
                                #
                            </th>
                            <th style={{ width: 30 }} className="text-center">
                                ID
                            </th>
                            <th style={{ width: 130 }} className="text-center">
                                Hình ảnh
                            </th>
                            <th className="text-center" style={{ width: 250 }}>Tiêu đề</th>
                            <th style={{ width: 130 }} className="text-center">
                                Ngày tạo
                            </th>
                            <th style={{ width: 140 }} className="text-center">
                                Chức năng
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map(function (post, index) {
                            return (
                                <tr key={index}>
                                    <td className="text-center">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="text-center">{post.id}</td>
                                    <td className="text-center">
                                        <img className="img-fluid"
                                            src={urlImage + 'post/' + post.image_1} alt="hinh" />
                                    </td>
                                    <td>{post.title}</td>
                                    <td className="text-center">{post.created_at}</td>
                                    <td className="text-center">
                                        <Link
                                            to={"/admin/page/show/" + post.id}
                                            className="btn btn-sm btn-success me-2"
                                        >
                                            <FaRegEye />
                                        </Link>
                                        <Link
                                            to={"/admin/page/update/" + post.id}
                                            className="btn btn-sm btn-primary me-2"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => postTrash(post.id)} className="btn btn-sm btn-danger">
                                            <FaRegTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PageList;
