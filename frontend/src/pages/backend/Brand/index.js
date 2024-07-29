import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import brandServices from "../../../services/BrandService";
import { urlImage } from "../../../config";
import '../../../assets/frontend/css/CategoryList.css';

function BrandList() {
    const [stamp, setTamp] = useState(0);
    const [qty, setQty] = useState(0);
    const [qty_trash, setQtyTrash] = useState(0);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        (async function () {
            try {
                const result = await brandServices.getAll();
                setBrands(result.data.brands);
                setQty(result.data.qty);
                setQtyTrash(result.data.qty_trash);
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        })();
        setTamp(0);
    }, [stamp]);

    function brandTrash(id) {
        brandServices.getTrash(id).then(function (result) {
            if (result.data.success === true) {
                showTrashNotification(result.data.message);
                setTamp(id);
                setTimeout(() => {
                    setTamp(0);
                }, 5000); // Hiển thị thông báo trong 5 giây
            } else {
                showTrashNotification(result.data.message);
            }
        }).catch(error => {
            console.error('Error trashing brand:', error);
        });
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
                        <strong className="text-primary">THƯƠNG HIỆU <sup>({qty})</sup></strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link className="btn btn-success me-2" to={"/admin/list-brands/create"}>
                            <FaPlus />Thêm
                        </Link>
                        <Link className="btn text-danger" to={"/admin/list-brands/list-trash"}>
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
                            <th style={{ width: 130 }} className="text-center">Logo</th>
                            <th style={{ width: 250 }}>Tên thương hiệu</th>
                            <th style={{ width: 250 }}>Slug</th>
                            <th style={{ width: 130 }} className="text-center">Ngày tạo</th>
                            <th style={{ width: 130 }} className="text-center">Chức năng</th>
                            <th style={{ width: 30 }} className="text-center">Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.map((brand, index) => (
                            <tr key={index}>
                                <td className="text-center">
                                    <input type="checkbox" />
                                </td>
                                <td className="text-center">
                                    <img className="img-fluid" style={{ width: 70, height: 50 }} src={urlImage + 'brand/' + brand.image} alt="Logo" />
                                </td>
                                <td>{brand.name}</td>
                                <td>{brand.slug}</td>
                                <td className="text-center">{brand.created_at}</td>
                                <td className="text-center">
                                    <Link className="btn btn-sm btn-success me-1" to={"/admin/list-brands/show/" + brand.id}>
                                        <FaEye />
                                    </Link>
                                    <Link className="btn btn-sm btn-primary me-1" to={"/admin/list-brands/update/" + brand.id}>
                                        <FaEdit />
                                    </Link>
                                    <button onClick={() => brandTrash(brand.id)} className="btn btn-sm btn-danger">
                                        <FaTrash />
                                    </button>
                                </td>
                                <td className="text-center">{brand.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BrandList;
