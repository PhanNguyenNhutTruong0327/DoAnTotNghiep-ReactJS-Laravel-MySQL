import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import categoryServices from '../../../services/CategoryService';
import Notification, { showNotification } from '../Notificatio';

function CategoryCreate() {
    const navigate = useNavigate();
    const [categorys, setCategorys] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [parent_id, setParentId] = useState(0);
    const [sort_order, setSortOrder] = useState(0);
    const [status, setStatus] = useState(1);
    const [errors, setErrors] = useState({}); // Lưu lỗi

    useEffect(() => {
        async function fetchCategories() {
            try {
                const result = await categoryServices.getBackend();
                setCategorys(result.data.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchCategories();
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

    async function categoryStore(event) {
        event.preventDefault();
        const errors = validateForm();
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            var category = new FormData();
            category.append('name', name);
            category.append('description', description);
            category.append('parent_id', parent_id);
            category.append('sort_order', sort_order);
            category.append('status', status);

            try {
                const res = await categoryServices.create(category);
                if (res.data.success) {
                    showNotification(res.data.message, 'success');
                    setTimeout(() => {
                        navigate('/admin/list-categories', { replace: true });
                    }, 5000);
                } else {
                    showNotification(res.data.message, 'warning');
                }
            } catch (error) {
                console.error('Error creating category:', error);
                showNotification('Có lỗi xảy ra khi thêm danh mục!. Hãy thử lại sau', 'error');
            }
        } else {
            showNotification('Vui lòng nhập đầy đủ và chính xác thông tin!', 'error');
        }
    }

    return (
        <>
            <Notification />
            <form onSubmit={categoryStore}>
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <strong className="text-danger">THÊM MỚI DANH MỤC</strong>
                            </div>
                            <div className="col-md-6 text-end">
                                <button type="submit" className="btn btn-sm btn-success me-2">
                                    Lưu
                                </button>
                                <Link to="/admin/list-categories" className="btn btn-sm btn-info">
                                    Quay lại
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-9">
                                <div className="md-3">
                                    <label htmlFor="name">Tên danh mục</label>
                                    <input
                                        onChange={(e) => setName(e.target.value)}
                                        type="text"
                                        name="name"
                                        value={name}
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>

                                <div className="md-3">
                                    <label htmlFor="metakey">Mô tả ngắn</label>
                                    <input
                                        onChange={(e) => setDescription(e.target.value)}
                                        name="metakey"
                                        value={description}
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                    />
                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="md-3">
                                    <label htmlFor="parent_id">Danh mục cha</label>
                                    <select
                                        onChange={(e) => setParentId(e.target.value)}
                                        value={parent_id}
                                        name="parent_id"
                                        className="form-control"
                                    >
                                        <option value="0">Danh mục cha</option>
                                        {categorys.map((cat, index) => (
                                            <option key={index} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md-3">
                                    <label htmlFor="sort-order">Sắp xếp</label>
                                    <select
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        value={sort_order}
                                        name="sort-order"
                                        className="form-control"
                                    >
                                        <option value="0">None</option>
                                        {categorys.map((cat, index) => (
                                            <option key={index} value={cat.sort_order + 1}>
                                                Sau: {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md-3">
                                    <label htmlFor="status">Trạng thái</label>
                                    <select
                                        name="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="form-control"
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

export default CategoryCreate;
