import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiRotateCcw } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import sliderservices from '../../../services/BannerServiec';

function SliderUpdate() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [sliders, setSliders] = useState([]);
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [description, setDescription] = useState('');
    const [sort_order, setSortOrder] = useState(0);
    const [position, setPosition] = useState('slider-main');
    const [status, setStatus] = useState(1);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await sliderservices.getById(id);
                setName(result.data.banner.name);
                setLink(result.data.banner.link);
                setDescription(result.data.banner.description);
                setSortOrder(result.data.banner.sort_order);
                setPosition(result.data.banner.position);
                setStatus(result.data.banner.status);
            } catch (error) {
                console.error("Error fetching slider:", error);
            }
        }
        fetchData();
    }, [id]);

    useEffect(() => {
        async function fetchAllSliders() {
            try {
                const result = await sliderservices.getAll();
                if (result.data && result.data.banner) {
                    setSliders(result.data.banner);
                }
            } catch (error) {
                console.error("Error fetching sliders:", error);
            }
        }
        fetchAllSliders();
    }, []);

    async function sliderUpdate(event) {
        event.preventDefault();
        const image = document.querySelector("#image");

        if (name !== '' && description !== '' && position !== '') {
            var slider = new FormData();
            slider.append("name", name);
            slider.append("link", link);
            slider.append("sort_order", sort_order);
            slider.append("description", description);
            slider.append("position", position);
            slider.append("status", status);
            slider.append("image", image.files.length === 0 ? "" : image.files[0]);

            try {
                const res = await sliderservices.update(id, slider);
                if (res.data.slider !== null) {
                    showSuccessNotification(res.data.message);
                    setTimeout(() => {
                        navigate('/admin/list-banners', { replace: true });
                    }, 2000); // Chuyển hướng sau khi hiển thị thông báo thành công trong 5 giây

                } else {
                    showErrorNotification("Cập nhật không thành công !");
                }
            } catch (error) {
                console.error("Error updating slider:", error);
                showErrorNotification("Có lỗi xảy ra khi cập nhật slider.");
            }
        } else {
            showErrorNotification("Vui lòng nhập đầy đủ thông tin !");
        }
    }

    const showSuccessNotification = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 2000,
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
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <form onSubmit={sliderUpdate}>
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6">
                            <strong className="text-danger">Cập nhật slider</strong>
                        </div>
                        <div className="col-md-6 text-end">
                            <button type="submit" className="btn btn-sm btn-success me-2">Lưu</button>
                            <Link to="/admin/list-banners" className="btn btn-sm btn-info"><FiRotateCcw />Quay lại</Link>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="md-3">
                                <label htmlFor="name">Tên</label>
                                <input onChange={(e) => setName(e.target.value)} type="text" name="name" value={name} className="form-control" />
                            </div>
                            <div className="md-3">
                                <label htmlFor="link">Link</label>
                                <input onChange={(e) => setLink(e.target.value)} type="text" name="link" value={link} className="form-control" />
                            </div>
                            <div className="md-3">
                                <label htmlFor="description">Mô tả ngắn</label>
                                <input onChange={(e) => setDescription(e.target.value)} type="text" name="description" value={description} className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-3">
                            {/* <div className="md-3">
                                <label htmlFor="sort-order">Sắp xếp</label>
                                <select onChange={(e) => setSortOrder(e.target.value)} value={sort_order} name="sort-order" className="form-control">
                                    <option value="0">None</option>
                                    {sliders.map((sli, index) => (
                                        <option key={index} value={sli.sort_order + 1}>Sau: {sli.name}</option>
                                    ))}
                                </select>
                            </div> */}
                            <div className="md-3">
                                <label htmlFor="position">Vị trí</label>
                                <select onChange={(e) => setPosition(e.target.value)} value={position} name="position" className="form-control">
                                    <option value="slider-main">Slider main</option>
                                    <option value="banner">Banner</option>
                                </select>
                            </div>
                            <div className="md-3">
                                <label htmlFor="image">Hình ảnh</label>
                                <input type="file" id="image" className="form-control" />
                            </div>
                            <div className="md-3">
                                <label htmlFor="status">Trạng thái</label>
                                <select name="status" value={status} onChange={(e) => setStatus(e.target.value)} className="form-control">
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

export default SliderUpdate;
