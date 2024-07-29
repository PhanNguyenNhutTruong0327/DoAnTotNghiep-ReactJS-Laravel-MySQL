import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegEye, FaRedoAlt, FaRegTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import postService from "../../../services/PostService";
import pageService from '../../../services/PageService';
import { urlImage } from '../../../config';
import '../../../assets/frontend/css/CategoryList.css';

function ListTrash() {
    const [posts, setPosts] = useState([]);
    const [qty, setQty] = useState(0);
    const [tamp, setTamp] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const res = await pageService.getListTrash();
                setPosts(res.data.trash);
                setQty(res.data.count_trash);
            } catch (error) {
                console.error('Error fetching posts from trash:', error);
            }
        })();
        setTamp();
    }, [tamp]);

    function recoverTrash(id) {
        postService.rescoverTrash(id)
            .then((result) => {
                if (result.data.success === true) {
                    showTrashNotification(result.data.message);
                    setTamp(id);
                } else {
                    showTrashNotification(result.data.message);
                }
            })
            .catch(error => {
                console.error('Error recovering post from trash:', error);
                showTrashNotification('Có lỗi xảy ra khi khôi phục bài viết.');
            });
    }

    function deletePost(id) {
        postService.remove(id)
            .then((result) => {
                showTrashNotification(result.data.message);
                setTamp(id);
            })
            .catch(error => {
                console.error('Error deleting post:', error);
                showTrashNotification('Có lỗi xảy ra khi xóa bài viết.');
            });
    }

    const showTrashNotification = (message) => {
        toast.success(message, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "toast-container"
        });
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="row">
                    <div className="col-md-6">
                        <strong className="text-danger">Thùng rác <sup style={{ fontSize: "14px" }}>({qty})</sup></strong>
                    </div>
                    <div className="col-md-6 text-end">
                        <Link to={"/admin/pages/1/10"} className="btn btn-sm btn-success me-1">
                            Về Danh Sách
                        </Link>
                    </div>
                </div>
            </div>
            {posts.length > 0 ? (
                <div className="card-body">
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: 30 }} className="text-center">#</th>
                                <th style={{ width: 30 }} className="text-center">ID</th>
                                <th style={{ width: 130 }} className="text-center">Hình ảnh</th>
                                <th className="text-center" style={{ width: 250 }}>Tiêu đề</th>
                                <th style={{ width: 130 }} className="text-center">Ngày tạo</th>
                                <th style={{ width: 140 }} className="text-center">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post, index) => (
                                <tr key={index}>
                                    <td className="text-center"><input type="checkbox" /></td>
                                    <td className="text-center">{post.id}</td>
                                    <td className="text-center">
                                        <img className="img-fluid" src={urlImage + 'post/' + post.image_1} alt="hinh" />
                                    </td>
                                    <td>{post.title}</td>
                                    <td className="text-center">{post.created_at}</td>
                                    <td className="text-center">
                                        <Link to={"/admin/page/show/" + post.id} className="btn btn-sm btn-success me-2">
                                            <FaRegEye />
                                        </Link>
                                        <button onClick={() => recoverTrash(post.id)} className="btn btn-sm btn-warning me-1">
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
            ) : (
                <section className="content">
                    <div className="card">
                        <div className="card-header text-center">
                            <h6>Hiện không có dữ liệu nào !</h6>
                        </div>
                    </div>
                </section>
            )}
            <ToastContainer/>
        </div>
    );
}

export default ListTrash;
