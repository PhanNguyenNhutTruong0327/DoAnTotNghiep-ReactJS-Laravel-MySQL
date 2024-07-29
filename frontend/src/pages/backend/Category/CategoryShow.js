import { Link, useNavigate, useParams } from "react-router-dom";
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from "react";
import categoryServices from "../../../services/CategoryService";
import Notification, { showNotification } from '../Notificatio'; // Import Notification và hàm showNotification

// import { urlImage } from "../../../config";
function CategoryShow() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [category, setCategory] = useState([]);

    useEffect(function () {
        (async function () {
            await categoryServices.getById(id).then(function (result) {
                setCategory(result.data.category)
            });
        })();
    }, []);


    function categoryDelete(id) {
        categoryServices.remove(id).then(function (result) {
            if(result.data.success){
                showNotification(result.data.message, 'success');
                setTimeout(()=>{
                    navigate("/admin/list-categories", { replace: true });
                },3000)
            }
            else{
                showNotification(result.data.message, 'error');
            }
        });
    }

    return (
        <div className="card" style={{ paddingLeft: "40px" }}>
                        <Notification />

            <div className="card-header">
                <div className="row">
                    <div className="col-6">
                        <strong className="text-primary">CHI TIẾT DANH MỤC</strong>
                    </div>
                    <div className="col-6 text-end">
                        <Link className="btn btn-sm btn-success me-1" to="/admin/list-categories">
                            Quay lại
                        </Link>
                        <Link className="btn btn-sm btn-primary me-1" to={`/admin/list-categories/update/${category.id}`}>
                            <FaRegEdit /> Sửa
                        </Link>
                        {/* <button onClick={() => categoryDelete(category.id)} className="btn btn-sm btn-danger">
                            <FaTrash />
                        </button> */}

                    </div>
                </div>
            </div>
            <div className="card-body">
                <table className="table table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th style={{ width: 200 }}>Tên Trường</th>
                            <th>Gía Trị</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Id</th>
                            <th>{category.id}</th>
                        </tr>
                        <tr>
                            <th>Tên danh mục</th>
                            <th>{category.name}</th>
                        </tr>
                        <tr>
                            <th>Danh mục cha</th>
                            <th>{category.parent_name}</th>
                        </tr>
                        <tr>
                            <th>Mô tả ngắn</th>
                            <th>{category.description}</th>
                        </tr>
                        <tr>
                            <th>Ngày tạo</th>
                            <th>{category.created_at}</th>
                        </tr>
                        <tr>
                            <th>Ngày cập nhật</th>
                            <th>{category.updated_at}</th>
                        </tr>
                        <tr>
                            <th>Trạng thái</th>
                            <th>{category.status == 1 ? 'Hiển thị' : 'Ẩn'}</th>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default CategoryShow;