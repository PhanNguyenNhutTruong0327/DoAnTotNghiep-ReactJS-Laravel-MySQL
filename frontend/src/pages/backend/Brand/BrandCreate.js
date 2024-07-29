import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import brandServices from "../../../services/BrandService";
import Notification, { showNotification } from '../Notificatio'; // Import Notification và hàm showNotification

function BrandCreate() {
    const navigate = useNavigate();

    const [brands, setBrand] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [sort_order, setSort_Order] = useState(0);
    const [status, setStatus] = useState(1);
    const [errors, setErrors] = useState({}); // Lưu lỗi
    const image = document.querySelector("#image");

    useEffect(() => {
        async function fetchBrands() {
            try {
                const result = await brandServices.getAll();
                setBrand(result.data.brands);
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        }
        fetchBrands();
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

        if (image.files.length === 0) {
            errors.image = 'Vui lòng chọn ảnh.';
        }

        return errors;
    };

    async function brandStore(event) {
        event.preventDefault();
        const errors = validateForm();
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            var brand = new FormData();
            brand.append("name", name);
            brand.append("sort_order", sort_order);
            brand.append("description", description);
            brand.append("status", status);
            brand.append("image", image.files[0]);
            brand.append("created_by", infoUser.user.id);

            try {
                const res = await brandServices.create(brand);
                if(res.data.success === true) {
                    showNotification(res.data.message, 'success');
                    setTimeout(() => {
                        navigate('/admin/list-brands', { replace: true });
                    }, 5000);    
                }
                else{
                    showNotification(res.data.message, 'warning');
                }
            } catch (error) {
                console.error('Error creating brand:', error);
                showNotification('Có lỗi xảy ra khi thêm thương hiệu!', 'error');
            }
        } else {
            showNotification('Vui lòng nhập đầy đủ và chính xác thông tin!', 'error');
        }
    }

    return (
        <>
            <Notification />
            <form onSubmit={brandStore} method="post">
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <strong className="text-danger">THÊM THƯƠNG HIỆU</strong>
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
                                    <label htmlFor="name">Tên thương hiệu</label>
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
                                        onChange={(e) => setSort_Order(e.target.value)}
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
                                    <input type="file" id="image" className={`form-control ${errors.image ? 'is-invalid' : ''}`}></input>
                                    {errors.image && <div className="invalid-feedback">{errors.image}</div>}
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
        </>
    );
}

export default BrandCreate;
