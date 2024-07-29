import { Link } from "react-router-dom";
import { FiPlus, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import bannerServices from '../../../services/BannerServiec';
import { urlImage } from "../../../config";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../../assets/frontend/css/CategoryList.css';

function BannerList() {

    const [banners, setBanner] = useState([]);
    const [count_Banner, setCountBanner] = useState(0);
    const [count_trash, setCountTrash] = useState(0);
    const [tamp, setTamp] = useState(0);
    const [qty, setQty] = useState(0);

    useEffect(function () {
        (async function () {
            try {
                await bannerServices.getAll().then(function (result) {
                    setBanner(result.data.Banners)
                    setCountBanner(result.data.count_Banner);
                    setCountTrash(result.data.count_trash);
                    setQty(result.data.count_banner);

                })

            } catch (e) { console.log(e) }
        })()
        setTamp();
    }, [tamp])
    // function BannerDelete(id) {
    //     Bannerservices.remove(id).then(function (result) {
    //         alert(result.data.message);
    //         setStatusDelete(result.data.id)
    //     })
    // }
    function BannerTrash(id) {
        bannerServices.getTrash(id).then(function (result) {
            if (result.data.success === true) {
                showTrashNotification(result.data.message);
                setTamp(id);
                setTimeout(() => {
                    setTamp(0);
                }, 2000); // Hiển thị thông báo trong 5 giây
            }
            else {
                showTrashNotification(result.data.message);
            }
        })
    }
    const showTrashNotification = (message) => {
        toast.success(message, {
            position: 'top-right',
            autoClose: 3000, // Đóng tự động sau 5 giây
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
                        <strong className="text-primary">BANNER<sup style={{ fontSize: "14px" }}>({qty})</sup></strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link to="/admin/list-banners/create" className="btn btn-sm btn-success"><FiPlus />Thêm</Link>
                        <Link className=" btn text-danger" to={"/admin/list-banners/list-trash"}>
                            <FaTrash /><sup>{count_trash}</sup>
                        </Link>

                    </div>
                </div>
                {/* <div class="row mb-2">
                    <div class="col-sm-10">
                        <h1 class="d-inline">Tất cả banner <sup style={{ fontSize: "14px" }}>({count_Banner})</sup></h1>
                    </div>
                    <div class="col-sm-2 text-right ">
                        <div className="d-flex ms-5">
                            <Link to="/admin/list-banners/create" class="btn btn-sm btn-primary me-3 ">
                                <i class="fa fa-plus me-1" aria-hidden="true"></i>
                                Thêm
                            </Link>
                            <Link to="/admin/list-banners/trash" class="action-btn" style={{ color: "red" }}>
                                <i class="fa fa-trash" aria-hidden="true"></i>
                                <sup class="count ms-1">{count_trash}</sup>
                            </Link>
                        </div>
                    </div>

                </div> */}

            </div>
            <div className="card-body">
                <table className="table table-striped table-bordered table-hover">
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
                        {banners.map(function (banner, index) {
                            return (
                                <tr key={index}>
                                    <td className="text-center">
                                        <input type="checkbox"></input>
                                    </td>
                                    <td className="text-center">{banner.id}</td>

                                    <td className="text-center">{banner.name}</td>
                                    <td className="">
                                        <img src={urlImage + 'banner/' + banner.image} alt="anh" style={{ width: "250px" }} />
                                    </td>
                                    <td className="text-center">{banner.position}</td>
                                    <td className="text-center">{banner.created_at}</td>
                                    <td className="text-center">
                                        <Link className="btn btn-sm btn-info me-1" to={`/admin/list-banners/show/${banner.id}`}><FiEye /></Link>
                                        <Link className="btn btn-sm btn-primary me-1" to={"/admin/list-banners/update/" + banner.id}><FiEdit /></Link>
                                        <button onClick={() => BannerTrash(banner.id)} className="btn btn-sm btn-danger">
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default BannerList;