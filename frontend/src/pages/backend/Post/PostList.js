import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaPlus, FaRegEye, FaEdit, FaRegTrashAlt, FaTrash } from "react-icons/fa";
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import postServices from "../../../services/PostService";
import { urlImage } from "../../../config";
import Notification, { showNotification } from '../Notificatio'; // Import Notification và hàm showNotification


function PostList() {
    const { type } = useParams();
    const page = parseInt(useParams().page);
    const limit = parseInt(useParams().limit);
    const [pages, setPages] = useState(1);
    const [posts, setPosts] = useState([]);
    const [qty, setQty] = useState(0);
    const [qty_trash, setQtyTrash] = useState(0);
    const [tamp, setTamp] = useState(0);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const result = await postServices.getAll(limit, page);
                setPosts(result.data.posts);
                setQty(result.data.qty_post);
                setQtyTrash(result.data.qty_trash);
                setPages(result.data.page);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        }
        fetchPosts();
        setTamp(0);
    }, [tamp, page, limit]);

    function postTrash(id) {
        postServices.trash(id)
            .then((result) => {
                if (result.data.success === true) {
                    showNotification(result.data.message, 'success');
                    setTamp(id);
                } else {
                    showNotification('Xoá không thành công !', 'warning');
                }
            })
            .catch(error => {
                console.error('Error trashing post:', error);
                showNotification('Có lỗi xảy ra khi xoá bài đăng!', 'error');
            });
    }



    return (
        <div className="card" style={{ paddingLeft: "40px" }}>
            <Notification />

            <div className="card-header">
                <div className="row">
                    <div className="col-md-6">
                        <strong className="text-danger">DANH SÁCH BÀI ĐĂNG <sup>({qty})</sup></strong>
                    </div>
                    <div className="col-md-6 text-end">
                        <Link to="/admin/list-post/create" className="btn btn-sm btn-success">
                            <FaPlus /> Thêm
                        </Link>
                        <Link className="btn text-danger" to={`/admin/list-post/list-trash/news/1/10`}>
                            <FaTrash /><sup>{qty_trash}</sup>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: 30 }} className="text-center">#</th>
                            <th style={{ width: 30 }} className="text-center">ID</th>
                            <th style={{ width: 130 }} className="text-center">Hình ảnh</th>
                            <th className="text-center">Tiêu đề</th>
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
                                    <img className="img-fluid" src={urlImage + 'post/' + post.image_1} alt="hinh" />
                                </td>
                                <td>{post.title}</td>
                                <td className="text-center">{post.topicname}</td>
                                <td className="text-center">{post.created_at}</td>
                                <td className="text-center">
                                    <Link to={"/admin/list-post/show/" + post.id} className="btn btn-sm btn-success me-2">
                                        <FaRegEye />
                                    </Link>
                                    <Link to={"/admin/list-post/update/" + post.id} className="btn btn-sm btn-primary me-2">
                                        <FaEdit />
                                    </Link>
                                    <button onClick={() => postTrash(post.id)} className="btn btn-sm btn-danger">
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
                        <Link className="page-link" to={`/admin/list-post/${page - 1}/${limit}`}>Previous</Link>
                    ) : (
                        <span className="page-link disabled">Previous</span>
                    )}
                </li>
                {Array.from(Array(pages).keys()).map((index) => (
                    <li key={index} className={`page-item ${index + 1 === page ? "active" : ""}`}>
                        <Link className="page-link" to={`/admin/list-post/${index + 1}/${limit}`}>
                            {index + 1}
                        </Link>
                    </li>
                ))}
                <li className="page-item">
                    {page < pages ? (
                        <Link className="page-link" to={`/admin/list-post/${page + 1}/${limit}`}>
                            Next
                        </Link>
                    ) : (
                        <span className="page-link disabled">Next</span>
                    )}

                </li>
            </ul>
            {/* <ToastContainer /> */}
        </div>
    );
}

export default PostList;
