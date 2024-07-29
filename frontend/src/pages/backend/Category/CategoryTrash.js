import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegEye, FaRedoAlt, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import categoryServices from "../../../services/CategoryService";
import '../../../assets/frontend/css/CategoryList.css';

function CategoryTrash() {
    const [trash, setTrash] = useState([]);
    const [tamp, setTamp] = useState();
    const [qty, setQty] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const res = await categoryServices.getAllTrash();
                setTrash(res.data.trash);
                setQty(res.data.count_trash);
            } catch (error) {
                console.error('Error fetching categories from trash:', error);
            }
        })();
        setTamp();
    }, [tamp]);

    function recoverTrash(id) {
        categoryServices.getRecover(id)
            .then((result) => {
                if (result.data.success === true) {
                    showTrashNotification(result.data.message);
                    setTamp(id);
                } else {
                    showTrashNotification(result.data.message);
                }
            })
            .catch(error => {
                console.error('Error recovering category from trash:', error);
                showTrashNotification('Có lỗi xảy ra khi khôi phục danh mục.');
            });
    }

    function deleteCategory(id) {
        categoryServices.remove(id)
            .then((result) => {
                showTrashNotification(result.data.message);
                setTamp(id);
            })
            .catch(error => {
                console.error('Error deleting category:', error);
                showTrashNotification('Có lỗi xảy ra khi xóa danh mục.');
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
        <div className="card" style={{ paddingLeft: "40px" }}>
            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <h6 className="text-primary">Thùng rác <sup>({qty})</sup></h6>
                    </div>
                    <div className="col-6 text-end">
                        <Link to="/admin/list-categories" className="btn btn-sm btn-info me-3">
                            Quay lại
                        </Link>
                    </div>
                </div>
            </div>

            {trash.length > 0 ? (
                <div className="card-body">
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên danh mục</th>
                                <th>Slug</th>
                                <th>Danh mục cha</th>
                                <th>Ngày tạo</th>
                                <th>Chức năng</th>
                                <th>ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trash.map((item, index) => (
                                <tr key={index}>
                                    <td><input type="checkbox" /></td>
                                    <td>{item.name}</td>
                                    <td>{item.slug}</td>
                                    <td>{item.parent_name}</td>
                                    <td>{item.created_at}</td>
                                    <td>
                                        <Link className="btn btn-sm btn-info me-1" to={`/admin/list-categories/show/${item.id}`}>
                                            <FaRegEye />
                                        </Link>
                                        <button className="btn btn-sm btn-warning me-1" onClick={() => recoverTrash(item.id)}>
                                            <FaRedoAlt />
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => deleteCategory(item.id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                    <td>{item.id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="card-body">
                    <h6 className="text-center">Hiện không có danh mục nào trong thùng rác!</h6>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}

export default CategoryTrash;
