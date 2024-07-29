import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiRotateCcw } from "react-icons/fi";
import sellService from "../../../services/SaleService";
import Notification, { showNotification } from '../Notificatio'; // Import Notification và hàm showNotification

function SaleUpdate() {
    const { id } = useParams();
    const navigate = useNavigate(); // chuyển trang

    const [title, setTitle] = useState('');
    const [percent_sale, setPercentSale] = useState(0);
    const [status, setStatus] = useState(1);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await sellService.getById(id);
                const { title, percent_sale, status } = result.data.sale;
                setTitle(title);
                setPercentSale(percent_sale);
                setStatus(status);
            } catch (error) {
                console.error("Error fetching sale:", error);
            }
        }
        fetchData();
    }, [id]);

    async function saleUpdate(event) {
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
            const res = await sellService.update(data, id);
            if (res.data.success) {
                showNotification(res.data.message, 'success');
                setTimeout(() => {
                    navigate('/admin/list-sale-be', { replace: true });
                }, 3000);
            } else {
                showNotification('Cập nhật dữ liệu thất bại. Hãy thử lại sau.', 'warning');
            }
        } catch (error) {
            console.error('Error updating sale:', error);
            showNotification('Có lỗi xảy ra khi cập nhật chủ đề giảm giá!', 'error');
        }
    }

    return (
        <form onSubmit={saleUpdate}>
            <Notification />
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6">
                            <strong className="text-danger">
                                CẬP NHẬT CHỦ ĐỀ GIẢM GIÁ
                            </strong>
                        </div>
                        <div className="col-md-6 text-end">
                            <button type="submit" className="btn btn-sm btn-success me-2">
                                Lưu
                            </button>
                            <Link to="/admin/list-sale-be" className="btn btn-sm btn-info">
                                <FiRotateCcw /> Quay lại
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4"></div>
                        <div className="col-md-4">
                            <div className="md-3">
                                <label htmlFor="title">Chủ đề</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="md-3">
                                <label htmlFor="percent_sale">Phần trăm giảm giá</label>
                                <input
                                    type="number"
                                    name="percent_sale"
                                    value={percent_sale}
                                    onChange={(e) => setPercentSale(e.target.value)}
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

export default SaleUpdate;
