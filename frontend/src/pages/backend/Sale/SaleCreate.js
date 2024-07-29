import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiRotateCcw } from "react-icons/fi";
import sellService from "../../../services/SaleService";
import Notification, { showNotification } from '../Notificatio'; // Import Notification và hàm showNotification

function SaleCreate() {
    const navigate = useNavigate(); // chuyển trang

    const [title, setTitle] = useState('');
    const [percent_sale, setPercentSale] = useState(0);
    const [status, setStatus] = useState(1);

    async function saleStore(event) {
        event.preventDefault();

        // Kiểm tra tiêu đề có ít nhất 6 ký tự
        if (title.length < 6) {
            showNotification('Tiêu đề phải có ít nhất 6 ký tự!', 'warning');
            return;
        }

        var data = new FormData();
        data.append("title", title);
        data.append("percent_sale", percent_sale);
        data.append("status", status);

        try {
            const res = await sellService.create(data);
            if (res.data.success) {
                showNotification(res.data.message, 'success');
                setTimeout(() => {
                    navigate('/admin/list-sale-be', { replace: true });
                }, 3000);
            } else {
                showNotification(res.data.message, 'error');
            }
        } catch (error) {
            console.error('Error creating sale:', error);
            showNotification('Có lỗi xảy ra khi thêm chủ đề giảm giá!', 'error');
        }
    }

    return (
        <form onSubmit={saleStore}>
            <Notification />
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6">
                            <strong className="text-danger">
                                THÊM CHỦ ĐỀ GIẢM GIÁ
                            </strong>
                        </div>
                        <div className="col-md-6 text-end">
                            <button type="submit" className="btn btn-sm btn-success me-2">
                                Lưu
                            </button>
                            <Link to="/admin/list-sale-be" className="btn btn-sm btn-info"><FiRotateCcw />Quay lại</Link>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4"></div>
                        <div className="col-md-4">
                            <div className="md-3">
                                <label htmlFor="name">Chủ đề</label>
                                <input
                                    onChange={(e) => setTitle(e.target.value)}
                                    type="text"
                                    name="name"
                                    value={title}
                                    className="form-control"
                                />
                            </div>
                            <div className="md-3">
                                <label htmlFor="percent_sale">Phần trăm giảm giá</label>
                                <input
                                    onChange={(e) => setPercentSale(e.target.value)}
                                    type="number"
                                    name="percent_sale"
                                    value={percent_sale}
                                    className="form-control"
                                />
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
    );
}

export default SaleCreate;
