import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../component/Provider/AuthProvider";
import { useEffect, useState } from "react";
import customerServices from "../../../services/CustomerService";
import loginServices from "../../../services/LoginServiec";
import { toast, ToastContainer } from 'react-toastify';// thêm thông báo
import 'react-toastify/dist/ReactToastify.css';// thêm thông báo
import queryString from "query-string";


function Login() {

    const { setToken } = useAuth();
    const navigation = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const location = useLocation();

    //login thuong
    async function login(event) {
        event.preventDefault();
        if (email !== '' && password !== '') {
            const data = {
                email: email,
                password: password
            };
            try {
                const res = await customerServices.checkLogin(data);
                if (res.data.data != null) {
                    showNotification(res.data.message, 'success');
                    const data = res.data.data;
                    const tamp = JSON.stringify({ jwt: data.token, user: data.user, token_expires_at: data.token_expires_at })
                    setToken(tamp);
                    // window.location.reload();
                } else {
                    showNotification(res.data.message, 'error');
                }
            } catch (error) {
                console.error(error);
                showNotification('Đăng nhập thất bại!');
            }
        } else {
            showNotification('Vui lòng nhập đầy đủ thông tin!', 'warning');
        }
    }

    // login google
    const loginGoogle = async (e) => {
        e.preventDefault();
        try {
            const response = await loginServices.login_google();
            await window.location.replace(response.data.url);

        } catch (error) {
            console.error('Lỗi đăng nhập Google:', error);
        }
    }


    // login fb
    const loginFacebook = async (e) => {
        e.preventDefault();
        try {
            const response = await loginServices.login_facebook();
            await window.location.replace(response.data.url);

        } catch (error) {
            console.error('Lỗi đăng nhập Facebook:', error);
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

    // login success gg
    useEffect(() => {
        (async () => {
            const parsed = await queryString.parse(window.location.search);
            const login_success = await parsed.token;
            if (typeof login_success !== 'undefined') {
                const id = await parseInt(parsed.user_id);
                const name = await parsed.user_name;
                const data_user = {
                    name: name,
                    id: id
                };
                const token_expires_at = await parsed.token_expires_at;
                const tamp = JSON.stringify({ jwt: login_success, user: data_user, token_expires_at: token_expires_at })
                console.log(tamp);
                setToken(tamp);
                // await showTrashNotification('Đã thanh toán thành công. Hãy theo dỗi đơn hàng !');
                // await userItems.forEach(item => {
                //     removeItem(item.id);
                // });
                // await navigation('/');
                // window.location.reload();    
            }
        })();
    }, []);



    return (
        <section className="section-conten padding-y" style={{ minHeight: "84vh" }}>
            <ToastContainer />
            <div className="card mx-auto" style={{ maxWidth: "380px", marginTop: "100px" }}>
                <label className="card-title mb-2 mt-2 text-center">ĐĂNG NHẬP</label>

                <div className="card-body">
                    <form onSubmit={login}>
                        <div className="row" style={{ margin: 0 }}>
                            <button onClick={loginFacebook} className="btn mb-2 text-white" style={{ backgroundColor: "#0d6efd" }}> <i className="fab fa-facebook-f"></i>  Facebook</button>
                            <button onClick={loginGoogle} className="btn btn-block mb-4 text-white" style={{ backgroundColor: "#af0000" }}> <i className="fab fa-google"></i> Google</button>
                            {/* <FacebookLogin
                                appId="2771402919692532"
                                fields="name,email"
                                cssClass="btnFacebook"
                                typeButton="button"
                                disableMobileRedirect={true}
                                icon={iconFacebook}
                                // Hàm callback trả về dữ liệu
                                callback={(data) => handleLogin(data)}
                            /> */}
                        </div>
                        <div className="form-group">
                            <input value={email} onChange={(e) => setEmail(e.target.value)} name="" className="form-control" placeholder="Nhập email..." type="email" />
                        </div>
                        <div className="form-group">
                            {/* <input value={password} onChange={(e) => setPassword(e.target.value)} name="" className="form-control" placeholder="Password" type="password" /> */}
                            <input
                                type="password"
                                id="password"
                                name="password"
                                minLength="6"
                                maxLength="20"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                className="form-control"
                                placeholder="Nhập mật khẩu..."
                                required
                            />
                        </div>

                        <div className="form-group">
                            <Link to={`/login/forgot-password`} className="float-right">Quên mật khẩu ?</Link>
                            {/* <label className="float-left custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" /> */}
                            {/* <div className="custom-control-label"> Remember </div> </label> */}
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block"> Đăng nhập  </button>
                        </div>
                    </form>
                </div>
            </div>

            <p className="text-center mt-4">Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
            <br /><br />
        </section>

    );
}
export default Login;