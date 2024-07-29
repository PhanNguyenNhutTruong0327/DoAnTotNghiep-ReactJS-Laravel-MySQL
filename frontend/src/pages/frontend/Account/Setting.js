import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../component/Provider/AuthProvider";
import { useEffect, useState } from "react";
import customerServices from "../../../services/CustomerService";
import { toast, ToastContainer } from 'react-toastify';// thêm thông báo
import 'react-toastify/dist/ReactToastify.css';// thêm thông báo
import Menu_Account from "../../../component/frontend/Menu_Account";

function Setting() {

    const { token, setToken } = useAuth();
    const navigate = useNavigate(); // chuyen trang

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({}); // Lưu lỗi

    useEffect(() => {
        (async () => {
            await customerServices.getDetailAccount().then((res) => {
                const data = res.data.data;
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone_number);
                setPassword(data.password);
            });
        })();
    }, []);

    const validateForm = () => {
        const errors = {};

        if (name.length < 6) {
            errors.name = 'Tên phải có ít nhất 6 ký tự.';
        }
        if (!/^\d{10}$/.test(phone)) {
            errors.phone = 'Số điện thoại phải là số và có độ dài 10 ký tự.';
        }
        if (email === '') {
            errors.email = 'Email không được để trống.';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            const user = JSON.parse(localStorage.getItem('token'));
            const user_id = user.user.id;
            const data = {
                name: name,
                email: email,
                phone: phone,
                active: 1,
                password: ''
            };

            await customerServices.updateInfoCustomer(data, user_id).then(res => {
                if (res.data.success === true) {
                    navigate('/tai-khoan', { replace: true });
                    showNotification('Cập nhật tài khoản thành công!', 'success');
                } else {
                    showNotification('Đã xảy ra lỗi vui lòng thử lại sau!', 'error');
                }
            });
        } else {
            showNotification('Vui lòng nhập đầy đủ và chính xác thông tin!', 'warning');
        }
    };

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
        };

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
    };

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
                        <Menu_Account />
                        <main className="col-md-9">
                            <div className="card">
                                <div className="card-body">
                                    <form className="row" onSubmit={handleSubmit}>
                                        <div className="col-md-9">
                                            <div className="form-row">
                                                <div className="col form-group">
                                                    <label>Họ tên (*)</label>
                                                    <input
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        type="text"
                                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                    />
                                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                                </div>
                                                <div className="col form-group">
                                                    <label>Số điện thoại (*)</label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                    />
                                                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="col form-group">
                                                    <label>Email (*)</label>
                                                    <input
                                                        type="email"
                                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                                </div>
                                            </div>

                                            <button className="btn btn-primary mr-2">Lưu</button>
                                            <Link to={`/tai-khoan/mat-khau`} className="btn btn-light">Thay đổi mật khẩu</Link>

                                            <br /><br /><br /><br /><br /><br />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Setting;
