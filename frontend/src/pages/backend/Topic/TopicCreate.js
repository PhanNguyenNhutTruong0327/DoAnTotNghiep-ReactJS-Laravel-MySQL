import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import topicservices from "../../../services/TopicService";
import Notification, { showNotification } from '../Notificatio'; // Import Notification và hàm showNotification

import { FiRotateCcw } from "react-icons/fi";

function TopicCreate() {
    const navigate = useNavigate(); // Hook để chuyển hướng đến trang khác

    const [topics, setTopics] = useState([]);
    const [name, setName] = useState('');
    const [parent_id, setParentId] = useState(0);
    const [sort_order, setSortOrder] = useState('0');
    const [status, setStatus] = useState(1);

    useEffect(() => {
        async function fetchTopics() {
            try {
                const result = await topicservices.getAll();
                setTopics(result.data.topics);
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        }
        fetchTopics();
    }, []);

    async function topicStore(event) {
        event.preventDefault();

        // Kiểm tra độ dài của name
        if (name.length < 6) {
            showNotification('Tên topic phải có ít nhất 6 ký tự!', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("parent_id", parent_id);
        formData.append("sort_order", sort_order);
        formData.append("status", status);

        try {
            const res = await topicservices.create(formData);
            if (res.data.success) {
                showNotification(res.data.message, 'success');
                setTimeout(() => {
                    navigate('/admin/list-topic', { replace: true });
                }, 3000);
            } else {
                showNotification(res.data.message, 'warning');
            }
        } catch (error) {
            console.error('Error creating topic:', error);
            showNotification('Có lỗi xảy ra khi thêm topic!', 'error');
        }
    }

    return (
        <>
            <Notification />
            <form onSubmit={topicStore}>
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <strong className="text-danger">
                                    THÊM MỚI TOPIC
                                </strong>
                            </div>
                            <div className="col-md-6 text-end">
                                <button type="submit" className="btn btn-sm btn-success me-2">
                                    Lưu
                                </button>
                                <Link to="/admin/list-topic" className="btn btn-sm btn-info">
                                    <FiRotateCcw /> Quay lại
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">



                            </div>
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <label htmlFor="name">Tên</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="sort_order">Sắp xếp</label>
                                    <select
                                        name="sort_order"
                                        value={sort_order}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="0">Chọn vị trí</option>
                                        {topics.map((top, index) => (
                                            <option key={index} value={top.id}>
                                                Sau: {top.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="parent_id">Danh mục cha</label>
                                    <select
                                        name="parent_id"
                                        value={parent_id}
                                        onChange={(e) => setParentId(e.target.value)}
                                        className="form-control"
                                    >
                                        <option value="0">Danh mục cha</option>
                                        {topics.map((top, index) => (
                                            <option key={index} value={top.id}>{top.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
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

export default TopicCreate;
