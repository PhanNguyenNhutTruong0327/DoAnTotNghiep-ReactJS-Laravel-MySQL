// BannerCreate.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiRotateCcw } from "react-icons/fi";
import bannerServices from '../../../services/BannerServiec';
import Notification, { showNotification } from '../Notificatio';

function BannerCreate() {
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);
    useEffect(() => {
        async function fetchBanners() {
            try {
                const result = await bannerServices.getAll();
                setBanners(result.data.data);
            } catch (error) {
                console.error('Error fetching banners:', error);
            }
        }
        fetchBanners();
    }, []);

    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [description, setDescription] = useState('');
    const [sort_order, setSortOrder] = useState(0);
    const [position, setPosition] = useState('slider-main');
    const [status, setStatus] = useState(1);

    async function bannerStore(event) {
        event.preventDefault();
        const image = document.querySelector("#image");

        if (name !== '' && description !== '' && position !== '' && image.files.length > 0) {
            var banner = new FormData();
            banner.append("name", name);
            banner.append("link", link);
            banner.append("sort_order", sort_order);
            banner.append("description", description);
            banner.append("position", position);
            banner.append("status", status);
            banner.append("image", image.files[0]);

            try {
                const res = await bannerServices.create(banner);
                if(res.data.success == true){
                    showNotification(res.data.message, 'success');
                    setTimeout(() => {
                        navigate('/admin/list-banners', { replace: true });
                    }, 3000);    
                }
                else{
                    showNotification('Có lỗi xảy ra khi thêm banner!', 'error');
                }
            } catch (error) {
                console.error('Error creating banner:', error);
                showNotification('Có lỗi xảy ra khi thêm banner!', 'error');
            }
        } else {
            showNotification('Vui lòng nhập đầy đủ thông tin và chọn hình ảnh!', 'error');
        }
    }

    return (
        <>
            <Notification />
            <form onSubmit={bannerStore}>
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-md-6">
                                <strong className="text-danger">THÊM BANNER</strong>
                            </div>
                            <div className="col-md-6 text-end">
                                <button type="submit" className="btn btn-sm btn-success me-2">
                                    Lưu
                                </button>
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
                                    <label htmlFor="link">Mô tả ngắn</label>
                                    <input onChange={(e) => setDescription(e.target.value)} type="text" name="link" value={description} className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="md-3">
                                    <label htmlFor="sort-order">Vị trí</label>
                                    <select onChange={(e) => setPosition(e.target.value)} value={position} name="sort-order" className="form-control">
                                        <option value="slider-main">Slider</option>
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
            </form>
        </>
    );
}

export default BannerCreate;
