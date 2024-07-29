import { Link } from "react-router-dom";
import { FaPlus, FaRegEye, FaRegEdit, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';// thêm thông báo
import 'react-toastify/dist/ReactToastify.css';// thêm thông báo
import categoryServices from "../../../services/CategoryService";
import '../../../assets/frontend/css/CategoryList.css';
function CategoryList() {
    const [tamp, setTamp] = useState(0);
    const [qty, setQty] = useState(0);
    const [qty_trash, setQtyTrash] = useState(0);
    const [categories, setCategories] = useState([]);

    useEffect(function () {
        (async function () {
            await categoryServices.getBackend().then(function (result) {
                setCategories(result.data.categories)
                setQty(result.data.count_cat);
                setQtyTrash(result.data.count_trash);
            });
        })();
        setTamp(0);
    }, [tamp])

    function catTrash(id) {
        categoryServices.getTrash(id).then(function (result) {
            if (result.data.success === true) {
                showTrashNotification(result.data.message);// thêm thông báo
                setTamp(id);
                setTimeout(() => {// thêm thông báo
                    setTamp(0);// thêm thông báo
                }, 3000); // Hiển thị thông báo trong 5 giây
            } else {
                showTrashNotification(result.data.message);// thêm thông báo
            }
        }).catch(error => {
            console.error('Error trashing category:', error);
        });
    }

    const showTrashNotification = (message) => {// thêm thông báo
        toast.success(message, {// thêm thông báo
            position: 'top-right',// thêm thông báo
            autoClose: 3000, // Đóng tự động sau 5 giây
            hideProgressBar: false,// thêm thông báo
            closeOnClick: true,// thêm thông báo
            pauseOnHover: true,// thêm thông báo
            draggable: true,// thêm thông báo
            progress: undefined,// thêm thông báo
            className: "toast-container"// thêm thông báo
        });
    };

    return (
        <div className="card" style={{ paddingLeft: "40px" }}>
            <ToastContainer /> {/* Đảm bảo ToastContainer được đặt trong phần render của component */}
            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <strong className="text-primary">TẤT CẢ DANH MỤC<sup style={{ fontSize: "14px" }}>({qty})</sup></strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link className="btn btn-sm btn-success" to={"/admin/list-categories/create"}>
                            <FaPlus />Thêm
                        </Link>
                        <Link className=" btn text-danger" to={"/admin/list-categories/list-trash"}>
                            <FaTrash /><sup>{qty_trash}</sup>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>name</th>
                            <th>slug</th>
                            <th>Danh mục cha</th>
                            <th>Ngày tạo</th>
                            <th>Chức năng</th>
                            <th>ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((item, index) => {
                            return (
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
                                        <Link className="btn btn-sm btn-primary me-1" to={"/admin/list-categories/update/" + item.id}>
                                            <FaRegEdit />
                                        </Link>
                                        <button onClick={() => catTrash(item.id)} className="btn btn-sm btn-danger">
                                            <FaTrash />
                                        </button>
                                    </td>
                                    <td>{item.id}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CategoryList;
