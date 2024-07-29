import { Link, useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { urlImage } from '../../../config';
import postServices from "../../../services/PostService";

function PageShow() {

  const navigate = useNavigate();
  const { id } = useParams("id");
  const [post, setPost] = useState([]);

  useEffect(function () {
    (async function () {
      await postServices.getById(id)
        .then(function (result) {
          setPost(result.data.post);
        });
    })();
  }, []);

  function postDelete(id) {
    postServices.trash(id).then(function (result) {
      alert(result.data.message);
      navigate("/admin/pages", { replace: true });
    });
  }


  return (
    <div className="card">
      <div className="card-header">
        <div className="row">
          <div className="col-md-6">
            <strong className="text-danger">CHI TIẾT BÀI ĐĂNG</strong>
          </div>
          <div className="col-md-6 text-end">
            <Link to={"/admin/pages/1/10"}
              className="btn btn-sm btn-success me-1"
            >
              Về danh sách
            </Link>
            <Link
              to={"/admin/page/update/" + post.id}
              className="btn btn-sm btn-primary me-1"
            >
              <FaEdit />Sửa
            </Link>
            <button onClick={() => postDelete(post.id)} className="btn btn-sm btn-danger">
              <FaRegTrashAlt />Xóa
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <table className=" table table-bordered">
          <thead>
            <tr>
              <th style={{ width: 300 }}>Tên trường</th>
              <th>Gía trị</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Mã bài đăng</th>
              <td>{post.id}</td>
            </tr>
            <tr>
              <th>Tiêu đề</th>
              <td>{post.title}</td>
            </tr>

            <tr>
              <th>Slug</th>
              <td>{post.slug}</td>
            </tr>
            <tr>
              <th>Hình ảnh</th>
              <td className="d-flex">
                <img src={urlImage + "post/" + post.image_1} style={{ width: 150 }} className="me-3" alt="anh" />
                <img src={urlImage + "post/" + post.image_2} style={{ width: 150 }} className="me-3" alt="anh" />
                <img src={urlImage + "post/" + post.image_3} style={{ width: 150 }} className="me-3" alt="anh" />

              </td>
            </tr>
            <tr>
              <th>Mô tả ngắn</th>
              <td>{post.short_description}</td>
            </tr>
            <tr>
              <th rowSpan={3}>Mô tả chi tiết</th>
              <td>{post.description_1}</td>
            </tr>
            <tr>
              <td>{post.description_2}</td>
            </tr>
            <tr>
              <td>{post.description_2}</td>
            </tr>

            <tr>
              <th>Ngày tạo</th>
              <td>{post.created_at}</td>
            </tr>
            <tr>
              <th>Ngày cập nhật</th>
              <td>{post.updated_at}</td>
            </tr>
            <tr>
              <th>Trạng thái</th>
              <td>{post.status === 1 ? "Hiển thị" : "Ẩn"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PageShow;
