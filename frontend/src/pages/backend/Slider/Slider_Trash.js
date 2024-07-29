// SliderTrash.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { FaRedoAlt } from "react-icons/fa";
import Notification, { showNotification } from '../Notificatio';
import bannerServices from '../../../services/BannerServiec';
import { urlImage } from "../../../config";

function SliderTrash() {
    const [sliders, setSliders] = useState([]);
    const [countTrash, setCountTrash] = useState(0);
    const [tamp, setTamp] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const result = await bannerServices.getAllTrash();
                setSliders(result.data.trash);
                setCountTrash(result.data.count_trash);
            } catch (error) {
                console.error('Error fetching sliders from trash:', error);
            }
        })();
        setTamp();
    }, [tamp]);

    function recoverTrash(id) {
        bannerServices.getRecover(id)
            .then((result) => {
                if (result.data.success === true) {
                    showNotification(result.data.message, 'success');
                    setTamp(id);
                } else {
                    showNotification(result.data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error recovering slider from trash:', error);
                showNotification('Có lỗi xảy ra khi khôi phục slider.', 'error');
            });
    }

    function deleteSlider(id) {
        bannerServices.remove(id)
            .then((result) => {
                showNotification(result.data.message, 'success');
                setTamp(id);
            })
            .catch(error => {
                console.error('Error deleting slider:', error);
                showNotification('Có lỗi xảy ra khi xóa slider.', 'error');
            });
    }

    return (
        <div className="card"style={{ paddingLeft: "40px" }}>
            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <strong className="text-primary">Thùng rác<sup style={{ fontSize: "14px" }}>({countTrash})</sup></strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link className="btn btn-sm btn-success me-1" to="/admin/list-banners">
                            Quay lại
                        </Link>
                    </div>
                </div>
            </div>

            {sliders.length > 0 ? (
                <div className="card-body">
                    <table className="table table-striped table-border table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "30" }} className="text-center">#</th>
                                <th style={{ width: "30" }} className="text-center">ID</th>
                                <th className="text-center">Tên</th>
                                <th className="text-center">Hình ảnh</th>
                                <th className="text-center">Vị trí</th>
                                <th style={{ width: "100" }} className="text-center">Ngày tạo</th>
                                <th style={{ width: "140" }} className="text-center">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sliders.map((slider, index) => (
                                <tr key={index}>
                                    <td className="text-center">
                                        <input type="checkbox"></input>
                                    </td>
                                    <td className="text-center">{slider.id}</td>
                                    <td className="text-center">{slider.name}</td>
                                    <td className="">
                                        <img src={urlImage + 'banner/' + slider.image} alt="anh" style={{ width: "250px" }} />
                                    </td>
                                    <td className="text-center">{slider.position}</td>
                                    <td className="text-center">{slider.created_at}</td>
                                    <td className="text-center">
                                        <Link className="btn btn-sm btn-info me-1" to={`/admin/list-banners/show/${slider.id}`}><FiEye /></Link>
                                        <button onClick={() => recoverTrash(slider.id)} className="btn btn-sm btn-warning me-1">
                                            <FaRedoAlt />
                                        </button>
                                        <button onClick={() => deleteSlider(slider.id)} className="btn btn-sm btn-danger">
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="card-body">
                    <section className="content">
                        <div className="card">
                            <div className="card-header text-center">
                                <h6>Hiện không có slider nào trong thùng rác!</h6>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            <Notification />
        </div>
    );
}

export default SliderTrash;
