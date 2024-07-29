import { Link, useParams } from "react-router-dom";
import { FaRegEye, FaRegTrashAlt, FaRedoAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import postServices from "../../../services/PostService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { urlImage } from "../../../config";

function Trash_Post() {
    const page = parseInt(useParams().page);
    const limit = parseInt(useParams().limit);

    const [posts, setPosts] = useState([]);
    const [qty, setQty] = useState(0);
    const [pages, setPages] = useState(1);
    const [tamp, setTamp] = useState(0);

    useEffect(() => {
        fetchPosts();
    }, [tamp, page]);

    const fetchPosts = async () => {
        try {
            const result = await postServices.getListTrash("news", limit, page);
            setPosts(result.data.trash);
            setQty(result.data.qty_trash);
            setPages(result.data.page);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const rescoverTrash = (id) => {
        postServices.rescoverTrash(id)
            .then((result) => {
                if (result.data.success === true) {
                    toast.success(result.data.message);
                    setTamp(id);
                } else {
                    toast.error("Phục hồi không thành công !");
                }
            })
            .catch((error) => {
                console.error("Error recovering post:", error);
                toast.error("Có lỗi xảy ra khi phục hồi bài viết.");
            });
    };

    const deletePost = (id) => {
        postServices.remove(id)
            .then((result) => {
                if (result.data.success === true) {
                    toast.success(result.data.message);
                    setTamp(id);
                } else {
                    toast.error("Xóa không thành công !");
                }
            })
            .catch((error) => {
                console.error("Error deleting post:", error);
                toast.error("Có lỗi xảy ra khi xóa bài viết.");
            });
    };

    return (
        <div className="card" style={{ paddingLeft: "40px" }}>
            <ToastContainer />
            <div className="card-header">
                <div className="row">
                    <div className="col-md-6">
                        <strong className="text-danger">
                            Thùng rác <sup style={{ fontSize: "14px" }}>({qty})</sup>
                        </strong>
                    </div>
                    <div className="col-md-6 text-end">
                        <Link to="/admin/list-post/1/10" className="btn btn-sm btn-success me-1">
                            Về Danh Sách
                        </Link>
                    </div>
                </div>
            </div>
            {posts.length > 0 ? (
                <>
                    <div className="card-body">
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: 30 }} className="text-center">#</th>
                                    <th style={{ width: 30 }} className="text-center">ID</th>
                                    <th style={{ width: 130 }} className="text-center">Hình ảnh</th>
                                    <th className="text-center" style={{ width: 250 }}>Tiêu đề</th>
                                    <th style={{ width: 130 }} className="text-center">Chủ đề</th>
                                    <th style={{ width: 130 }} className="text-center">Ngày tạo</th>
                                    <th style={{ width: 140 }} className="text-center">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post, index) => (
                                    <tr key={index}>
                                        <td className="text-center">
                                            <input type="checkbox" />
                                        </td>
                                        <td className="text-center">{post.id}</td>
                                        <td className="text-center">
                                            <img
                                                className="img-fluid"
                                                src={urlImage + 'post/' + post.image_1}
                                                alt="Hình ảnh"
                                                style={{ width: 70, height: 50 }}
                                            />
                                        </td>
                                        <td>{post.title}</td>
                                        <td className="text-center">{post.topicname}</td>
                                        <td className="text-center">{post.created_at}</td>
                                        <td className="text-center">
                                            <Link to={`/admin/list-post/show/${post.id}`} className="btn btn-sm btn-success me-2">
                                                <FaRegEye />
                                            </Link>
                                            <button onClick={() => rescoverTrash(post.id)} className="btn btn-sm btn-warning me-1">
                                                <FaRedoAlt />
                                            </button>
                                            <button onClick={() => deletePost(post.id)} className="btn btn-sm btn-danger">
                                                <FaRegTrashAlt />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <ul className="pagination">
                        <li className="page-item">
                            {page > 1 ? (
                                <Link className="page-link" to={`/admin/list-post/list-trash/${limit}/${page - 1}`}>
                                    Previous
                                </Link>
                            ) : (
                                <span className="page-link disabled">Previous</span>
                            )}
                        </li>
                        {Array.from(Array(pages).keys()).map((index) => (
                            <li key={index} className={`page-item ${index + 1 === page ? "active" : ""}`}>
                                <Link className="page-link" to={`/admin/list-post/list-trash/${limit}/${index + 1}`}>
                                    {index + 1}
                                </Link>
                            </li>
                        ))}
                        <li className="page-item">
                            <Link className="page-link" to={`/admin/list-post/list-trash/${limit}/${page + 1}`}>
                                Next
                            </Link>
                        </li>
                    </ul>
                </>
            ) : (
                <section class="content">
                    <div class="card">
                        <div class="card-header text-center">
                            <h6>Hiện không có bài viết nào !</h6>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

export default Trash_Post;
