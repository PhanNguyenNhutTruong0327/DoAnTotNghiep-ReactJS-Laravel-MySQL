import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../component/Provider/AuthProvider";
import { useEffect, useState } from "react";
import Menu_Account from "../../../component/frontend/Menu_Account";
import customerServices from "../../../services/CustomerService";
import { ToastContainer, toast } from "react-toastify";
import { error } from "jquery";


function SettingAddress() {

    const { code } = useParams();

    const { token } = useAuth();

    const navigate = useNavigate(); // chuyen trang

    const [address, setAddress] = useState('');
    const [user_id, setUserId] = useState();

    useEffect(() => {
        (async () => {
            await customerServices.getDetailAccount().then((res) => {
                code == 1 ? setAddress(res.data.address.address_1) : setAddress(res.data.address.address_2);
                setUserId(res.data.data.id);
            });

        })()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (address.length >= 6) {

            const data = {
                address: address,
                code: code
            }

            await customerServices.updataCustomerAddress(data, user_id).then(res => {
                if (res.data.success === true) {
                    showNotification(res.data.message, 'success');
                    // navigate('/tai-khoan', { replace: true });
                }
                else {
                    showNotification(res.data.message, 'error');
                }
            })

        }
        else {
            showNotification('Vui lòng nhập ít nhất 6 ký tự !','warning');
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
                                            <div className="col-1"></div>
                                            <div className="col-11">
                                                <div className="col-12 form-group">
                                                    <label>Địa chỉ :</label>
                                                    <div className="password-input-wrapper">
                                                        <input
                                                            value={address}
                                                            onChange={(e) => setAddress(e.target.value)}
                                                            type='text'
                                                            className="form-control"
                                                            style={{ paddingRight: "35px" }}
                                                        />
                                                    </div>
                                                </div>

                                                <button className="btn btn-primary mr-2">Lưu</button>
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
export default SettingAddress;
