import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import topicservices from '../../../services/TopicService';

function TopicList() {
    const [cuont, setCuont] = useState(0);
    const [tamp, setTamp] = useState();
    const [dem, setDem] = useState(0);
    const [topics, setTopic] = useState([]);

    useEffect(function () {
        (async function () {
            try {
                await topicservices.getAll().then(function (result) {
                    setTopic(result.data.topics);
                    setCuont(result.data.count);
                    setDem(result.data.count_trash);
                    setTamp(false);
                });
            } catch (e) {
                console.log(e);
            }
        })();
        setTamp();
    }, [tamp]);

    function topicTrash(id) {
        topicservices.trash(id).then(function (result) {
            if (result.data.success === true) {
                showTrashNotification(result.data.message);
                setTamp(id);
                setTimeout(() => {
                    setTamp(0);
                }, 5000); //
            } else {
                showErrorNotification(result.data.message);
            }
        }).catch(error => {
            console.error('Error trashing topic:', error);
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

    const showErrorNotification = (message) => {
        toast.error(message, {
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
        <div className="card" style={{ paddingLeft: "40px" }}>
            <ToastContainer />
            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <strong className="text-primary">TOPIC <sup style={{ fontSize: "1rem" }}>({cuont})</sup></strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link to="/admin/list-topic/create" className="btn btn-sm btn-success"><FiPlus /> Thêm</Link>
                        <Link className=" btn text-danger" to={"/admin/list-topic/list-trash"}>
                            <FaTrash /><sup>{dem}</sup>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <table className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: "30" }} className="text-center">#</th>
                            <th style={{ width: "100" }} className="text-center">Tên</th>
                            <th className="text-center">Slug</th>
                            <th style={{ width: "100" }} className="text-center">Ngày tạo</th>
                            <th style={{ width: "30" }} className="text-center">Status</th>
                            <th style={{ width: "140" }} className="text-center">Chức năng</th>
                            <th style={{ width: "30" }} className="text-center">ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topics.map(function (topic, index) {
                            return (
                                <tr key={index}>
                                    <td className="text-center">
                                        <input type="checkbox"></input>
                                    </td>
                                    <td style={{ width: "30" }} className="text-center">{topic.name}</td>
                                    <td className="text-center">{topic.slug}</td>
                                    <td className="text-center">{topic.created_at}</td>
                                    <td className="text-center">{topic.status === 1 ? "Hiển thị" : "Ẩn"}</td>
                                    <td className="text-center">
                                        <Link className="btn btn-sm btn-info me-1" to={"/admin/list-topic/show/" + topic.id}><FiEye /></Link>
                                        <Link className="btn btn-sm btn-primary me-1" to={"/admin/list-topic/update/" + topic.id}><FiEdit /></Link>
                                        <button onClick={() => topicTrash(topic.id)} className="btn btn-sm btn-danger">
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                    <td className="text-center">{topic.id}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TopicList;
