import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import brandServices from "../../../services/BrandService";

function BrandUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [sort_order, setSortOrder] = useState(0);
    const [status, setStatus] = useState(1);
    const [brands, setBrands] = useState([]);
    const [errors, setErrors] = useState({}); // Lưu lỗi

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await brandServices.getById(id);
                const tmp = result.data.brand;
                setName(tmp.name);
                setDescription(tmp.description);
                setSortOrder(tmp.sort_order);
                setStatus(tmp.status);
            } catch (error) {
                console.error("Error fetching brand:", error);
            }
        }
        fetchData();
    }, [id]);

    useEffect(() => {
        async function fetchAllBrands() {
            try {
                const result = await brandServices.getAll();
                setBrands(result.data.brands);
            } catch (error) {
                console.error("Error fetching brands:", error);
            }
        }
        fetchAllBrands();
    }, []);

    const infoUser = JSON.parse(localStorage.getItem('adminToken'));

    const validateForm = () => {
        const errors = {};

        if (name.length < 2) {
            errors.name = 'Tên phải có ít nhất 2 ký tự.';
        }

        if (description.length < 6) {
            errors.description = 'Mô tả phải có ít nhất 6 ký tự.';
        }

        return errors;
    };

    async function brandEdit(event) {
        event.preventDefault();
        const image = document.querySelector("#image");
        const errors = validateForm();
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            var brand = new FormData();
            brand.append("name", name);
            brand.append("sort_order", sort_order);
            brand.append("description", description);
            brand.append("status", status);
            brand.append("updated_by", infoUser.user.id);
            brand.append("image", image.files.length === 0 ? "" : image.files[0]);
            try {
                const res = await brandServices.update(id, brand);
                if (res.data.success === true) {
                    showSuccessNotification(res.data.message);
                    setTimeout(() => {
                        navigate('/admin/list-brands', { replace: true });
                    }, 5000); // Chuyển hướng sau khi hiển thị thông báo thành công trong 5 giây
                } else {
                    showErrorNotification("Cập nhật thất bại !");
                }
            } catch (error) {
                console.error("Error updating brand:", error);
                showErrorNotification("Có lỗi xảy ra khi cập nhật thương hiệu.");
            }
        } else {
            showErrorNotification("Vui lòng nhập đầy đủ và chính xác thông tin!");
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
        <form onSubmit={brandEdit} method="post">
            <div className="card">
                <ToastContainer />
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6">
                            <strong className="text-danger">CẬP NHẬT THƯƠNG HIỆU</strong>
                        </div>
                        <div className="col-md-6 text-end">
                            <Link to="/admin/list-brands" className="btn btn-sm btn-info me-3">
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
                                <label htmlFor="name">Cập nhật thương hiệu</label>
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
                                <label htmlFor="metakey">Mô tả ngắn</label>
                                <textarea
                                    name="metakey"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                ></textarea>
                                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="md-3">
                                <label htmlFor="sort_order">Sort Order</label>
                                <select
                                    name="parent_id"
                                    className="form-control"
                                    value={sort_order}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="0">None</option>
                                    {brands.map((brand, index) => (
                                        <option key={index} value={brand.sort_order + 1}>
                                            Sau: {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="md-3">
                                <label htmlFor="image">Logo</label>
                                <input type="file" id="image" className="form-control"></input>
                            </div>
                            <div className="md-3">
                                <label htmlFor="status">Status</label>
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
        </form>
    );
}

export default BrandUpdate;
