import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../component/Provider/AuthProvider";
import { useEffect, useState } from "react";
import Menu_Account from "../../../component/frontend/Menu_Account";
import customerServices from "../../../services/CustomerService";
import { toast, ToastContainer } from 'react-toastify';// thêm thông báo
import 'react-toastify/dist/ReactToastify.css';// thêm thông báo


function CreateAddress() {


    const navigate = useNavigate(); // chuyen trang

    const [address_1, setAddress1] = useState('');
    const [address_2, setAddress2] = useState('');
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
        if (address_1 != "") {

            const data = {
                address_1: address_1,
                address_2: address_2,
                customer_id: user_id
            }

            await customerServices.createCustomerAddress(data).then(res => {
                if (res.data.success === true) {
                    showNotification('Đã thêm địa chỉ thành công !', 'success');
                    navigate('/tai-khoan', { replace: true });
                }
                else {
                    alert(res.data.message);
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
                                                    <label>Địa chỉ mặc định :</label>
                                                    <div className="password-input-wrapper">
                                                        <input
                                                            value={address_1}
                                                            onChange={(e) => setAddress1(e.target.value)}
                                                            type='text'
                                                            className="form-control"
                                                            style={{ paddingRight: "35px" }}
                                                            placeholder="Hãy nhập địa chỉ giao hàng..."
                                                        />
                                                    </div>
                                                </div>

                                            </div>

                                            <br /><br />

                                        </div>
                                        <div className="col-md-9 row">
                                            <div className="col-1"></div>
                                            <div className="col-11">
                                                <div className="col-12 form-group">
                                                    <label>Địa chỉ 2 (Không bắt buộc):</label>
                                                    <div className="password-input-wrapper">
                                                        <input
                                                            value={address_2}
                                                            onChange={(e) => setAddress2(e.target.value)}
                                                            type='text'
                                                            className="form-control"
                                                            style={{ paddingRight: "35px" }}
                                                            placeholder="Hãy nhập địa chỉ giao hàng thứ 2..."
                                                        />
                                                    </div>
                                                </div>

                                                <button className="btn btn-primary mr-2">Lưu</button>
                                            </div>

                                            <br /><br /><br /><br /><br /><br />

                                        </div>

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
export default CreateAddress;
