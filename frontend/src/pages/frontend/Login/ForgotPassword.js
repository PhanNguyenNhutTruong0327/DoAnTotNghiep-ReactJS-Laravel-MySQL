import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import customerServices from "../../../services/CustomerService";
import mailService from "../../../services/Mail_Service";
import { ToastContainer, toast } from "react-toastify";




function ForgotPassword() {

    const navigate = useNavigate();


    const [emailAddress, setEmailAddress] = useState("");
    const [OTP_RanDom, setOTP_RanDom] = useState("");
    const [emailCustomer, setEmailCustomer] = useState("");
    const [OTP, setOTP] = useState("");
    const [formOTP, setFormOTP] = useState(false);
    const [formPassword, setFormPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [password_confirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);


    const handleOTP = async (e) => {
        const email = new FormData();
        email.append("email", emailAddress);
        console.log(emailAddress);
        const customer = await customerServices.checkEmail(email);
        if (customer.data.success === true) {
            const otp = await Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

            const email_data = await new FormData();
            await email_data.append("to_email", emailAddress);
            await email_data.append("otp", otp);
            const getOTP = await mailService.sendMail(email_data);
            setOTP_RanDom(otp.toString());
            setEmailCustomer(email);
            resetOTP();
            setFormOTP(true)
        }
        else {
            alert(customer.data.message);
        }


    }

    const check_OTP = () => {
        if (OTP !== OTP_RanDom) {
            alert("Mã OTP không chính xác !", "error");
        } else {
            setFormPassword(true);
        }
    }

    const handlePassword = async () => {
        if (password === password_confirm) {
            const data = new FormData();
            data.append("email", emailAddress);
            data.append("password", password);
            await customerServices.forgotPassword(data).then(res => {
                if (res.data.success === true) {
                    showNotification(res.data.message, 'success');
                    setTimeout(() => {
                        navigate('/login', { replace: true });
                        window.location.reload();

                    }, 3000);
                }
                else {

                }
            })
        }
        else {
            showNotification('Mật khẩu không trùng khớp !. Hãy nhập lại.', 'error');
        }

        // else {
        //     showNotification('Mật khẩu phải tối thiểu 6 ký tự.','warning');
        // }
    }

    function resetOTP() {
        setTimeout(() => {
            setOTP_RanDom(null);
        }, 300000);
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



    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setPassword(value);
        if (value.length < 6 || value.length > 20) {
            setError('Mật khẩu phải có từ 6 đến 20 ký tự.');
            setIsButtonDisabled(true);
        } else {
            setError('');
            // setIsButtonDisabled(false);
        }
    };

    const handlePasswordConfirmChange = (e) => {
        const { value } = e.target;
        setPasswordConfirm(value);
        if (value.length < 6 || value.length > 20) {
            setError('Mật khẩu phải có từ 6 đến 20 ký tự.');
            setIsButtonDisabled(true);
        } else {
            setError('');
            setIsButtonDisabled(false);

        }
    };

    return (
        <section className="section-conten padding-y" style={{ minHeight: "84vh" }}>
            <ToastContainer />

            {formPassword ? (
                <div className="card mx-auto old-element" style={{ maxWidth: "400px", marginTop: "100px" }}>
                    <div className=" text-center border-bottom">
                        <label className=" card-title p-2">Thay đổi mật khẩu</label>
                    </div>
                    <div className="card-body">
                        <p>Nhập mật khẩu mới</p>
                        <div className="form-group">
                            <input
                                value={password}
                                onChange={handlePasswordChange}
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="Nhập mật khẩu mới"
                                type="password"
                                required
                            />
                        </div>
                        <p>Xác nhận lại mật khẩu</p>
                        <div className="form-group">
                            <input
                                value={password_confirm}
                                onChange={handlePasswordConfirmChange}
                                name="password_confirm"
                                className="form-control"
                                placeholder="Nhập lại mật khẩu mới"
                                type="password"
                                required
                            />
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="form-group d-flex ">
                            <button onClick={handlePassword} type="button" className={`btn btn-primary ${isButtonDisabled ? 'disabled' : ''}`} disabled={isButtonDisabled}>
                                Lưu
                            </button>
                            <Link to="/login" className="btn me-2">
                                Hủy
                            </Link>
                        </div>
                    </div>
                </div>

            ) : formOTP ? (
                <div className="card mx-auto" style={{ maxWidth: "400px", marginTop: "100px" }}>
                    <div className=" text-center border-bottom">
                        <label className=" card-title p-2">Nhập mã OTP</label>
                    </div>
                    <div className="card-body">
                        <p>Vui lòng nhập OTP đã được gửi qua Email của bạn.</p>
                        <div className="form-group">
                            <input value={OTP} onChange={(e) => setOTP(e.target.value)} name="" className="form-control" type="text" />
                        </div>

                        <div className="form-group d-flex ">
                            <button onClick={() => check_OTP()} type="submit" className="btn btn-primary ">Xác nhận</button>
                            <Link type="submit" to="/login" className="btn me-2"> Hủy  </Link>
                        </div>
                    </div>
                </div>

            ) : (<>
                <div className="card mx-auto" style={{ maxWidth: "400px", marginTop: "100px" }}>
                    <div className=" text-center border-bottom">
                        <label className=" card-title p-2">Quên mật khẩu</label>
                    </div>
                    <div className="card-body">
                        <p>Vui lòng nhập email để lấy mã otp.</p>
                        <div className="form-group">
                            <input value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} name="" className="form-control" placeholder="Nhập địa chỉ email đã đăng ký" type="email" />
                        </div>

                        <div className="form-group d-flex ">
                            <button onClick={() => handleOTP()} type="submit" className="btn btn-primary ">Lấy OTP</button>
                            <Link type="submit" to="/login" className="btn me-2"> Hủy  </Link>
                        </div>
                    </div>
                </div>

                <br /><br />
            </>)}
            {/* {} */}


        </section>

    );
}

export default ForgotPassword;