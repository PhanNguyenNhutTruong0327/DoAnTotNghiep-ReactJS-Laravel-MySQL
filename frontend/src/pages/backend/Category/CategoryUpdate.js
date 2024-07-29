import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import categoryServices from "../../../services/CategoryService";
import "../../../assets/frontend/css/CategoryList.css";

function CategoryUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [parent_id, setParentId] = useState(0);
    const [sort_order, setSortOrder] = useState(0);
    const [status, setStatus] = useState(1);
    const [errors, setErrors] = useState({}); // Lưu lỗi

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await categoryServices.getById(id);
                const tmp = result.data.category;
                setName(tmp.name);
                setParentId(tmp.parent_id);
                setDescription(tmp.description);
                setSortOrder(tmp.sort_order);
                setStatus(tmp.status);
            } catch (error) {
                console.error("Error fetching category:", error);
                showErrorNotification("Có lỗi xảy ra khi tải dữ liệu danh mục.");
            }
        }
        fetchData();
    }, [id]);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function fetchAllCategories() {
            try {
                const result = await categoryServices.getBackend();
                setCategories(result.data.categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        fetchAllCategories();
    }, []);

    const validateForm = () => {
        const errors = {};

        if (name.length < 4) {
            errors.name = 'Tên phải có ít nhất 4 ký tự.';
        }

        if (description.length < 6) {
            errors.description = 'Mô tả phải có ít nhất 6 ký tự.';
        }

        return errors;
    };

    async function categoryEdit(event) {
        event.preventDefault();
        const errors = validateForm();
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            var data = new FormData();
            data.append("name", name);
            data.append("description", description);
            data.append("parent_id", parent_id);
            data.append("sort_order", sort_order);
            data.append("status", status);

            try {
                const res = await categoryServices.update(id, data);
                if (res.data.success === true) {
                    showSuccessNotification(res.data.message);
                    setTimeout(() => {
                        navigate('/admin/list-categories', { replace: true });
                    }, 5000); // Chuyển hướng sau khi hiển thị thông báo thành công trong 5 giây

                } else {
                    showErrorNotification("Cập nhật thất bại !");
                }
            } catch (error) {
                console.error("Error updating category:", error);
                showErrorNotification("Có lỗi xảy ra khi cập nhật danh mục.");
            }
        } else {
            showErrorNotification("Vui lòng nhập đầy đủ và chính xác thông tin !");
        }
    }

    const showSuccessNotification = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const showErrorNotification = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <form onSubmit={categoryEdit} method="post">
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6">
                            <strong className="text-danger">CẬP NHẬT DANH MỤC</strong>
                        </div>
                        <div className="col-md-6 text-end">
                            <Link to="/admin/list-categories" className="btn btn-sm btn-info me-3">
                                Quay lại
                            </Link>
                            <button className="btn btn-sm btn-success" type="submit">
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="mb-3">
                                <label htmlFor="name">Tên danh mục</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="metadesc">Mô tả ngắn</label>
                                <textarea
                                    name="metadesc"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                ></textarea>
                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="mb-3">
                                <label htmlFor="parent_id">Danh mục cha</label>
                                <select
                                    onChange={(e) => setParentId(e.target.value)}
                                    value={parent_id}
                                    name="parent_id"
                                    className="form-control"
                                >
                                    <option value="0">Danh mục cha</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="sort_order">Sắp xếp</label>
                                <select
                                    name="sort_order"
                                    className="form-control"
                                    value={sort_order}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="0">None</option>
                                    {categories.map((bra, index) => (
                                        <option key={index} value={bra.sort_order + 1}>
                                            Sau: {bra.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="status">Trạng thái</label>
                                <select
                                    className="form-control"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="1">Xuất bản</option>
                                    <option value="2">Chưa xuất bản</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </form>
    );
}

export default CategoryUpdate;
