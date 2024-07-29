import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import topicService from "../../../services/TopicService";
import postServices from "../../../services/PostService";
import Notification, { showNotification } from "../Notificatio";

function PostCreate() {
    const navigate = useNavigate();

    const [topics, setTopics] = useState([]);
    const [topic_id, setTopicId] = useState(1);
    const [title, setTitle] = useState("");
    const [short_description, setShortDescription] = useState("");
    const [description_1, setDescription1] = useState("");
    const [description_2, setDescription2] = useState("");
    const [description_3, setDescription3] = useState("");
    const [status, setStatus] = useState(2);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchTopics() {
            try {
                const result = await topicService.getListTopic();
                setTopics(result.data.topics);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        }
        fetchTopics();
    }, []);

    const validateForm = () => {
        const errors = {};

        if (title.length < 6) {
            errors.title = 'Tên bài viết phải có ít nhất 6 ký tự.';
        }

        if (short_description.length < 6) {
            errors.short_description = 'Mô tả ngắn phải có ít nhất 6 ký tự.';
        }

        if (description_1.length < 10) {
            errors.description_1 = 'Mô tả chi tiết 1 phải có ít nhất 10 ký tự.';
        }

        // if (description_2.length < 10) {
        //     errors.description_2 = 'Mô tả chi tiết 2 phải có ít nhất 10 ký tự.';
        // }

        // if (description_3.length < 10) {
        //     errors.description_3 = 'Mô tả chi tiết 3 phải có ít nhất 10 ký tự.';
        // }

        return errors;
    };

    async function postStore(event) {
        event.preventDefault();
        const errors = validateForm();
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            const image = document.querySelector("#image");
            const image_related_1 = document.querySelector("#image_related_1");
            const image_related_2 = document.querySelector("#image_related_2");

            if (image.files.length > 0 && image_related_1.files.length > 0) {
                var post = new FormData();
                post.append("topic_id", topic_id);
                post.append("title", title);
                post.append("short_description", short_description);
                post.append("description_1", description_1);
                post.append("description_2", description_2);
                post.append("description_3", description_3);
                post.append("type", "news");
                post.append("status", status);

                post.append("image", image.files[0]);
                post.append("image_related_1", image_related_1.files[0]);
                post.append("image_related_2", image_related_2.files[0]);

                try {
                    const res = await postServices.create(post);
                    if (res.data.success) {
                        showNotification(res.data.message, "success");
                        setTimeout(() => {
                            navigate("/admin/list-post/1/10", { replace: true });
                        }, 3000);
                    } else {
                        showNotification("Thêm dữ liệu không thành công! Hãy thử lại sau.", "error");
                    }
                } catch (error) {
                    console.error("Error creating post:", error);
                    showNotification("Có lỗi xảy ra khi thêm bài viết!", "error");
                }
            } else {
                showNotification("Vui lòng tải lên hình ảnh chính và ít nhất một hình ảnh liên quan!", "error");
            }
        } else {
            showNotification("Vui lòng nhập đầy đủ và chính xác thông tin!", "error");
        }
    }

    return (
        <>
            <Notification />
            <form onSubmit={postStore} method="post">
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <strong className="text-danger">THÊM BÀI VIẾT</strong>
                            </div>
                            <div className="col-md-6 text-end">
                                <button type="submit" className="btn btn-sm btn-success me-2">
                                    Lưu
                                </button>
                                <Link to="/admin/list-post/1/10" className="btn btn-sm btn-info">
                                    Quay lại
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-9">
                                <div className="mb-3">
                                    <label htmlFor="name">Tên bài viết</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                    />
                                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="metakey">Mô tả ngắn</label>
                                    <textarea
                                        name="metakey"
                                        value={short_description}
                                        onChange={(e) => setShortDescription(e.target.value)}
                                        className={`form-control ${errors.short_description ? 'is-invalid' : ''}`}
                                    />
                                    {errors.short_description && <div className="invalid-feedback">{errors.short_description}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="metakey">Mô tả chi tiết 1</label>
                                    <textarea
                                        name="metakey"
                                        value={description_1}
                                        onChange={(e) => setDescription1(e.target.value)}
                                        className={`form-control ${errors.description_1 ? 'is-invalid' : ''}`}
                                        rows="8"
                                    />
                                    {errors.description_1 && <div className="invalid-feedback">{errors.description_1}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="metadesc">Mô tả chi tiết 2</label>
                                    <textarea
                                        name="metadesc"
                                        value={description_2}
                                        onChange={(e) => setDescription2(e.target.value)}
                                        className={`form-control ${errors.description_2 ? 'is-invalid' : ''}`}
                                        rows="8"
                                    />
                                    {/* {errors.description_2 && <div className="invalid-feedback">{errors.description_2}</div>} */}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="metadesc">Mô tả chi tiết 3</label>
                                    <textarea
                                        name="metadesc"
                                        value={description_3}
                                        onChange={(e) => setDescription3(e.target.value)}
                                        className={`form-control ${errors.description_3 ? 'is-invalid' : ''}`}
                                        rows="8"
                                    />
                                    {/* {errors.description_3 && <div className="invalid-feedback">{errors.description_3}</div>} */}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mb-3">
                                    <label htmlFor="brand_id">Chủ đề bài viết</label>
                                    <select
                                        name="brand_id"
                                        className="form-control"
                                        value={topic_id}
                                        onChange={(e) => setTopicId(e.target.value)}
                                    >
                                        <option value="0">None</option>
                                        {topics.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image">Hình ảnh</label>
                                    <input type="file" id="image" className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image_related_1">Hình ảnh liên quan 1</label>
                                    <input type="file" id="image_related_1" className="form-control" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image_related_2">Hình ảnh liên quan 2</label>
                                    <input type="file" id="image_related_2" className="form-control" />
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
        </>
    );
}

export default PostCreate;
