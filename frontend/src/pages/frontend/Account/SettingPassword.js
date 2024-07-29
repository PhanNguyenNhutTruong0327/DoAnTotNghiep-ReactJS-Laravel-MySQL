import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Menu_Account from "../../../component/frontend/Menu_Account";
import customerServices from "../../../services/CustomerService";
import { toast, ToastContainer } from 'react-toastify';// thêm thông báo
import 'react-toastify/dist/ReactToastify.css';// thêm thông báo


function SettingPassword() {


    const navigate = useNavigate(); // chuyen trang

    const [password, setPassword] = useState('');
    const [password_new, setPasswordNew] = useState('');
    const [password_confirm, setPasswordConfirm] = useState('');
    const [user_id, setUserId] = useState();


    useEffect(() => {
        (async () => {
            await customerServices.getDetailAccount().then((res) => {
                setUserId(res.data.data.id);
            });

        })()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== '' && password_new !== '' && password_confirm !== '') {
            if (password_confirm === password_new) {
                const data = {
                    password: password,
                    password_new: password_new
                }
                await customerServices.updatePassword(data, user_id).then(res => {
                    if (res.data.success === true) {
                        showNotification(res.data.message, 'success');
                        setTimeout(()=>{
                            navigate('/tai-khoan')
                        },3000);
                    }
                    else {
                        showNotification(res.data.message, 'warning');
                    }
                })
            }
            else {
                showNotification('Mật khẩu mới không trùng khớp !', 'warning');
            }
        }
        else {
            showNotification('Vui lòng nhập đầy đủ thông tin !', 'warning');
        }
    }
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // thong bao
    const showNotification = (message, type = 'success') => {
        let options = {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "toast-container"
        }


        switch (type) {
            case 'success':
                toast.success(message, options);
                break;
            case 'error':
                toast.error(message, options);
                break;
            case 'warning':
                toast.warn(message, options);
                break;
            case 'info':
                toast.info(message, options);
                break;
            default:
                toast(message, { ...options, type: 'custom' });
        }
    }
    return (
        <div className="">
            <ToastContainer />

            <section className="section-pagetop bg-gray" >
                <div className="container">
                    <h3 className="title-page">Tài khoản của tôi</h3>
                </div>
            </section>
            <section className="section-content padding-y">
                <div className="container">

                    <div className="row">
                        {/* <aside className="col-md-3">
                            <nav className="list-group">
                                <Link className="list-group-item active text-white" style={{ background: "#ff6a00", borderColor: "#ff6a00" }} to="/tai-khoan">Tổng quan</Link>
                                <Link className="list-group-item" to={`/tai-khoan/don-hang`}> Đơn hàng</Link>
                                <Link className="list-group-item" to={`/tai-khoan/cai-dat`}> Cài đặt tài khoản </Link>
                                <Link className="list-group-item" href="page-index-1.html"> Đăng xuất </Link>
                            </nav>
                        </aside> */}
                        <Menu_Account />

                        <main className="col-md-9">
                            <div className="card">

                                <div className="card-body">
                                    <form className="row" onSubmit={handleSubmit}>
                                        <div className="col-md-9 row">
                                            <div className="col-6"></div>
                                            <div className="col-5">

                                                <div className="col-12 form-group">
                                                    <label>Mật khẩu hiện tại (*)</label>
                                                    <div className="password-input-wrapper">
                                                        <input
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            type={showPassword ? 'text' : 'password'}
                                                            className="form-control"
                                                            style={{ paddingRight: "35px" }}
                                                            minLength="6" maxLength="20"
                                                        />
                                                        <div
                                                            className="password-toggle-icon"
                                                            onClick={togglePasswordVisibility}
                                                            style={{ position: "absolute", top: "50%", right: "10px", cursor: "pointer" }}
                                                        >
                                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col form-group">
                                                    <label>Mật khẩu mới (*)</label>
                                                    <div className="password-input-wrapper">
                                                        <input
                                                            value={password_new}
                                                            onChange={(e) => setPasswordNew(e.target.value)}
                                                            type={showPassword ? 'text' : 'password'}
                                                            className="form-control"
                                                            style={{ paddingRight: "35px" }}
                                                            minLength="6" maxLength="20"
                                                        />
                                                        <div
                                                            className="password-toggle-icon"
                                                            onClick={togglePasswordVisibility}
                                                            style={{ position: "absolute", top: "50%", right: "10px", cursor: "pointer" }}
                                                        >
                                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col form-group">
                                                    <label>Mật khẩu vừa nhập (*)</label>
                                                    <div className="password-input-wrapper">
                                                        <input
                                                            value={password_confirm}
                                                            onChange={(e) => setPasswordConfirm(e.target.value)}
                                                            type={showPassword ? 'text' : 'password'}
                                                            className="form-control"
                                                            style={{ paddingRight: "35px" }}
                                                            minLength="6" maxLength="20"
                                                        />
                                                        <div
                                                            className="password-toggle-icon"
                                                            onClick={togglePasswordVisibility}
                                                            style={{ position: "absolute", top: "50%", right: "10px", cursor: "pointer" }}
                                                        >
                                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="btn btn-primary mr-2">Cập nhật</button>


                                            </div>

                                            <br /><br /><br /><br /><br /><br />

                                        </div>
                                        {/* <div className="col-md">
                            <img src="images/avatars/avatar1.jpg" className="img-md rounded-circle border" />
                        </div> */}
                                    </form>
                                </div>
                            </div>
                        </main>

                    </div>

                </div>
            </section>
            {/* <section className="section-content padding-y">
                    <div className="container">
                        <div className="text-center">
                            <h6>Vui lòng đăng nhập tài khoản !</h6>
                        </div>
                    </div>
                </section> */}

        </div>
    );

}
export default SettingPassword;
