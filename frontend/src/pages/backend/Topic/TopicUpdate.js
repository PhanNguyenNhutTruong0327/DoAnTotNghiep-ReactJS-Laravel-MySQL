import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiRotateCcw } from "react-icons/fi";
import topicservices from "../../../services/TopicService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TopicUpdate() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState("");
    const [parent_id, setParentId] = useState(0);
    const [sort_order, setSortOrder] = useState(0);
    const [status, setStatus] = useState(1);
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await topicservices.getById(id);
                const data = result.data.topic;
                setName(data.name);
                setParentId(data.parent_id);
                setStatus(data.status);
            } catch (error) {
                console.error("Error fetching topic:", error);
            }
        }
        fetchData();
    }, [id]);

    useEffect(() => {
        async function fetchAllTopics() {
            try {
                const result = await topicservices.getAll();
                setTopics(result.data.topics);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        }
        fetchAllTopics();
    }, []);

    async function topicEdit(event) {
        event.preventDefault();

        // Kiểm tra độ dài của name
        if (name.length < 6) {
            showErrorNotification('Tên topic phải có ít nhất 6 ký tự!');
            return;
        }

        var topic = new FormData();
        topic.append("name", name);
        topic.append("parent_id", parent_id);
        topic.append("sort_order", sort_order);
        topic.append("status", status);

        try {
            const res = await topicservices.update(id, topic);
            if (res.data.success === true) {
                showSuccessNotification(res.data.message);
                setTimeout(() => {
                    navigate("/admin/list-topic", { replace: true });
                }, 5000); // Redirect after showing success message for 5 seconds
            } else {
                showErrorNotification(res.data.message || "Cập nhật thất bại !");
            }
        } catch (error) {
            console.error("Error updating topic:", error);
            showErrorNotification("Có lỗi xảy ra khi cập nhật topic.");
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
        <form onSubmit={topicEdit}>
            <div className="card">
                <ToastContainer />
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6">
                            <strong className="text-danger">CẬP NHẬT TOPIC</strong>
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
                                <label htmlFor="name">Tên topic</label>
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
                                <label htmlFor="sort_order">Vị trí</label>
                                <select
                                    name="sort_order"
                                    className="form-control"
                                    value={sort_order}
                                    onChange={(e) => setSortOrder(e.target.value)}
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
                                    className="form-control"
                                    value={parent_id}
                                    onChange={(e) => setParentId(e.target.value)}
                                >
                                    <option value="0">Danh mục cha</option>
                                    {topics.map((top, index) => (
                                        <option key={index} value={top.id}>
                                            {top.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="status">Trạng thái</label>
                                <select
                                    name="status"
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

export default TopicUpdate;
