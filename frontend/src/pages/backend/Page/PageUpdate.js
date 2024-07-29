import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postServices from "../../../services/PostService";

function PageUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [short_description, setShortDescription] = useState("");
    const [description_1, setDescription1] = useState("");
    const [description_2, setDescription2] = useState("");
    const [description_3, setDescription3] = useState("");
    const [status, setStatus] = useState(2);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await postServices.getById(id);
                const data = res.data.post;
                setTitle(data.title);
                setShortDescription(data.short_description);
                setDescription1(data.description_1);
                setDescription2(data.description_2);
                setDescription3(data.description_3);
                setStatus(data.status);
            } catch (e) {
                console.error("Error fetching post:", e);
                showErrorNotification("Có lỗi xảy ra khi tải dữ liệu.");
            }
        }
        fetchData();
    }, [id]);

    async function postUpdate(event) {
        event.preventDefault();
        const image = document.querySelector("#image");
        const image_related_1 = document.querySelector("#image_related_1");
        const image_related_2 = document.querySelector("#image_related_2");

        if (title !== '' && short_description !== '' && description_1 !== '' && description_2 !== '' && description_3 !== '') {
            const post = new FormData();
            post.append("topic_id", 0);
            post.append("title", title);
            post.append("short_description", short_description);
            post.append("description_1", description_1);
            post.append("description_2", description_2);
            post.append("description_3", description_3);
            post.append("type", "page");
            post.append("status", status);
            post.append("image", image.files.length === 0 ? "" : image.files[0]);
            post.append("image_related_1", image_related_1.files.length === 0 ? "" : image_related_1.files[0]);
            post.append("image_related_2", image_related_2.files.length === 0 ? "" : image_related_2.files[0]);

            try {
                const res = await postServices.update(post, id);
                if (res.data.success === true) {
                    showSuccessNotification(res.data.message);
                    setTimeout(() => {
                        navigate('/admin/pages/1/10', { replace: true });
                    }, 5000); // Chuyển hướng sau khi hiển thị thông báo thành công trong 5 giây
                } else {
                    showErrorNotification("Cập nhật thông tin không thành công!");
                }
            } catch (e) {
                console.error("Error updating post:", e);
                showErrorNotification("Có lỗi xảy ra khi cập nhật bài viết.");
            }
        } else {
            showErrorNotification("Vui lòng nhập đầy đủ thông tin!");
        }
    }

    const showSuccessNotification = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 5000, // Thời gian hiển thị thông báo: 5000ms = 5 giây
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "toast-container"
        });
    };

    const showErrorNotification = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000, // Thời gian hiển thị thông báo: 5000ms = 5 giây
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "toast-container"
        });
    };

    return (
        <form onSubmit={postUpdate} method="post">
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6">
                            <strong className="text-danger">Cập nhật trang đơn</strong>
                        </div>
                        <div className="col-md-6 text-end">
                            <button type="submit" className="btn btn-sm btn-success me-2">
                                Lưu
                            </button>
                            <Link to={"/admin/pages/1/10"} className="btn btn-sm btn-info">Quay lại</Link>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="mb-3">
                                <label htmlFor="name">Tiêu đề</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="metakey">Mô tả ngắn</label>
                                <textarea
                                    name="metakey"
                                    value={short_description}
                                    onChange={(e) => setShortDescription(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="metakey">Mô tả chi tiết 1</label>
                                <textarea
                                    name="metakey"
                                    value={description_1}
                                    onChange={(e) => setDescription1(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="metadesc">Mô tả chi tiết 2</label>
                                <textarea
                                    name="metadesc"
                                    value={description_2}
                                    onChange={(e) => setDescription2(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="metadesc">Mô tả chi tiết 3</label>
                                <textarea
                                    name="metadesc"
                                    value={description_3}
                                    onChange={(e) => setDescription3(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label htmlFor="image">Hình ảnh</label>
                                <input type="file" id="image" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image">Hình ảnh liên quan 1</label>
                                <input type="file" id="image_related_2" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image">Hình ảnh liên quan 2</label>
                                <input type="file" id="image_related_1" className="form-control" />
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
            <ToastContainer />
        </form>
    );
}

export default PageUpdate;
