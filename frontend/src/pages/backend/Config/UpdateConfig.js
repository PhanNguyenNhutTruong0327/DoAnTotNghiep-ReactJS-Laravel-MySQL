import { add } from "date-fns";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiConfig from "../../../api/apiConfig";
import axiosInstance from "../../../api/axios";
import apiUploadFile from "../../../api/apiUploadFile";

function UpdateConfig() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [author, setAuthor] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [facebook, setFacebook] = useState('');
    const [zalo, setZalo] = useState('');
    const [youtobe, setYoutobe] = useState('');
    const [address, setAddress] = useState('');
    const [logo, setLogo] = useState('');


    useEffect(() => {
        apiConfig.getOneConfig(id).then(res => {
            setAuthor(res.data.author);
            setPhone(res.data.phone);
            setEmail(res.data.email);
            setAddress(res.data.address);
            setFacebook(res.data.facebook);
            setZalo(res.data.zalo);
            setYoutobe(res.data.youtobe);
            setLogo(res.data.logo);
        })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const image = document.querySelector("#image");
        if (author !== '' && address !== '' && phone !== '' && email !== '') {
            const data = {
                author: author,
                phone: phone,
                email: email,
                zalo: zalo,
                facebook: facebook,
                youtobe: youtobe,
                address: address,
                logo: logo,
                status: 1
            }
            if (image.files.length > 0) {

                let file = new FormData();
                file.append("files", image.files[0]);

                axiosInstance.enableUploadFile();

                await apiUploadFile.uploadFile(file)
                    .then(async (res) => {
                        let filename = res.data.filename;
                        data.logo = filename;

                    })
                    .catch(e => console.log(e))
            }

            axiosInstance.enableJson();
            await apiConfig.updateConfig(data, id).then(res => {
                if (res.data !== null) {
                    alert('Cập nhật dữ liệu thành công !');
                    navigate('/admin/config', { replace: true });
                } else {
                    alert('Cập nhật dữ liệu thất bại !');
                }
            })

        }
        else {
            alert('Vui lòng nhập các trường bắt buộc !')
        }
    }


    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-10">
                            <h1 className="d-inline">Cập nhật</h1>
                        </div>
                        <div className="col-sm-2  text-right">
                            <Link to="/admin/config" className="btn btn-sm btn-info">
                                <i className="fa fa-reply me-1" aria-hidden="true"></i>
                                Quay lại
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-2"></div>
                            <div className="col-md-8">
                                <form onSubmit={handleSubmit} >

                                    <div className="mb-3">
                                        <label>Tên shop (*)</label>
                                        <input type="text" name="name" placeholder="Nhập tên bài viết" className="form-control"
                                            value={author} onChange={(e) => setAuthor(e.target.value)} />
                                    </div>

                                    <div className="mb-3">
                                        <label>Logo</label>
                                        <input id="image" type="file" name="image" className="form-control" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Số điện thoại (*)</label>
                                        <input type="text" name="name" placeholder="Nhập tên bài viết" className="form-control"
                                            value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Zalo </label>
                                        <input type="text" name="name" placeholder="Nhập tên bài viết" className="form-control"
                                            value={zalo} onChange={(e) => setZalo(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Facebook</label>
                                        <input type="text" name="name" placeholder="Nhập tên bài viết" className="form-control"
                                            value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Email (*)</label>
                                        <input type="text" name="name" placeholder="Nhập tên bài viết" className="form-control"
                                            value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Youtobe </label>
                                        <input type="text" name="name" placeholder="Nhập tên bài viết" className="form-control"
                                            value={youtobe} onChange={(e) => setYoutobe(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Địa chỉ (*)</label>
                                        <input type="text" name="name" placeholder="Nhập tên bài viết" className="form-control"
                                            value={address} onChange={(e) => setAddress(e.target.value)} />
                                    </div>
                                    <div className="card-header text-right">
                                        <button className="btn btn- btn-success">
                                            <i className="fa fa-save me-2" aria-hidden="true"></i>
                                            Lưu
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    );
}

export default UpdateConfig;