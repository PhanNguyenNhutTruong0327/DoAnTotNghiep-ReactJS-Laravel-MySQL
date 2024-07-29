import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import customerServices from "../../../services/CustomerService";
import { ToastContainer, toast } from "react-toastify";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeat_password, setRepeatPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name.length < 5) {
            setError('Họ tên phải có ít nhất 5 ký tự.');
            return;
        }
        if (password.length < 6 || repeat_password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }
        if (password !== repeat_password) {
            setError('Mật khẩu và mật khẩu xác nhận không khớp.');
            return;
        }

        // Nếu các điều kiện trên đều hợp lệ, tiến hành gọi API đăng ký
        const data = {
            name: name,
            phone: phone,
            email: email,
            password: password,
            active: 1,
        };

        await customerServices.register(data).then((res) => {
            if (res.data.data != null) {
                showNotification(res.data.message, 'success');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
            else {
                showNotification(res.data.message, 'warning');
            }
        }).catch((error) => {
            console.error('Đã xảy ra lỗi khi đăng ký:', error);
            showNotification('Đã xảy ra lỗi khi đăng ký.', 'error');
        });
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
        <section className="section-content padding-y">
            <ToastContainer />

            <div className="card mx-auto" style={{ maxWidth: "520px", marginTop: "40px" }}>
                <label className="card-title text-center pt-3">Đăng ký</label>

                <article className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="col form-group">
                                <label>Họ tên *</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    placeholder=""
                                    required
                                />
                            </div>
                            <div className="col form-group">
                                <label>Số điện thoại *</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder=""
                                    inputMode="numeric"
                                    pattern="[0-9]{10}"
                                    title="Vui lòng nhập số điện thoại gồm 10 chữ số."
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className="form-control"
                                placeholder=""
                                required
                            />
                            <small className="form-text text-muted">Chúng tôi sẽ không bao giờ chia sẻ email của bạn với bất kỳ ai khác</small>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Mật khẩu *</label>
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control"
                                    type="password"
                                    minLength="6"
                                    required
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label>Nhập lại mật khẩu *</label>
                                <input
                                    value={repeat_password}
                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                    className="form-control"
                                    type="password"
                                    minLength="6"
                                    required
                                />
                            </div>
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary btn-block"> Đăng ký  </button>
                        </div>
                    </form>
                </article>
            </div>
            <p className="text-center mt-4">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
            <br /><br />
        </section>
    );
}

export default Register;
