import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import staffServices from "../../../services/StaffService";
import { ToastContainer, toast } from "react-toastify";

function LoginAdmin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    async function login(event) {

        event.preventDefault();
        if (email !== '' && password !== '') {
            const data = {
                email: email,
                password: password
            };
            await staffServices.checkLogin(data).then(function (result) {
                if (result.data.success === false) {
                    showNotification(result.data.message, 'error');
                }
                else {
                    showNotification(result.data.message, 'success');
                    localStorage.setItem('adminToken', JSON.stringify({ jwt: result.data.data.token, user: result.data.data.user }));
                    setTimeout(() => {
                        navigate('/admin', { replace: true });
                    }, 3000);
                }
            })
        }
        else {
            showNotification('Vui lòng nhập đầy đủ thông tin !', 'warning');
        }

    }

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
        <section className="section-conten padding-y" style={{ minHeight: "84vh" }}>
            <ToastContainer />

            <div className="card mx-auto" style={{ maxWidth: "380px", marginTop: "100px" }}>
                <label className="card-title mb-2 mt-2 text-center">ĐĂNG NHẬP ADMIN</label>

                <div className="card-body">
                    <form onSubmit={login}>
                        <div className="row">
                            {/* <Link to="#" className="btn mb-2 text-white" style={{backgroundColor:"#0d6efd"}}> <i className="fab fa-facebook-f"></i>  Facebook</Link>
                            <Link href="#" className="btn btn-block mb-4 text-white" style={{backgroundColor:"#af0000"}}> <i className="fab fa-google"></i> Google</Link> */}
                        </div>
                        <div className="form-group">
                            <input value={email} onChange={(e) => setEmail(e.target.value)} name="" className="form-control" placeholder="Email" type="email" />
                        </div>
                        <div className="form-group">
                            <input value={password} onChange={(e) => setPassword(e.target.value)} name="" className="form-control" placeholder="Password" type="password" />
                        </div>

                        <div className="form-group">
                            <Link to={`/login/forgot-password`} className="float-right">Quên mật khẩu ?</Link>
                            <label className="float-left custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" />
                                <div className="custom-control-label"> Remember </div> </label>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block"> Đăng nhập  </button>
                        </div>
                    </form>
                </div>
            </div>

            <p className="text-center mt-4">Don't have account? <Link to="/register">Sign up</Link></p>
            <br /><br />
        </section>

    );
}
export default LoginAdmin;