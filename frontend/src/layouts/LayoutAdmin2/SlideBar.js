import { FaSmile } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { Link } from 'react-router-dom';

import './style.css';
function SliderBar() {
    return (
        <>
            <section id="sidebar">
                <a href="#" class="brand">
                    <div style={{ padding: "0 0 5px 20px" }}>

                        <FaSmile size={20} />
                    </div>

                    <span class="text" style={{ padding: "0 10px" }}>Admin</span>
                </a>
                <ul class="side-menu top">
                    <li class="active">
                        <Link to="/admin">
                            <div style={{ padding: "0 0 5px 13px" }}>
                                <MdDashboard />
                            </div>
                            <span class="text" style={{ padding: "0 10px" }}>Dashboard</span>
                        </Link>
                    </li>
                    <li className="active">
                        <Link to={`/admin/list-products/10/1`} className="nav-link">
                            <i className="far fa-circle nav-icon" style={{ padding: "0 10px 5px 0" }}></i>
                            <p>Tất cả sản phẩm</p>
                        </Link>
                    </li>
                    <li className="active">
                        <Link to={`/admin/product-sale/10/1`} className="nav-link">
                            <i className="far fa-circle nav-icon" style={{ padding: "0 10px 5px 0" }}></i>
                            <p>Sản phẩm giảm giá</p>
                        </Link>
                    </li>
                    <li className="active">
                        <Link to={`/admin/orders/1/10`} className="nav-link">
                            <i className="far fa-circle nav-icon" style={{ padding: "0 10px 5px 0" }}></i>
                            <p>Tất cả đơn hàng</p>
                        </Link>
                    </li>
                    <li className="active">
                        <Link to={`/admin/list-banners`} className="nav-link">
                            <i className="far fa-circle nav-icon" style={{ padding: "0 10px 5px 0" }}></i>
                            <p>Banner</p>
                        </Link>

                    </li>
                    <li className="active">
                        <Link to="/admin/list-categories" className="nav-link">
                            <i className="far fa-circle nav-icon" style={{ padding: "0 10px 5px 0" }}></i>
                            <p>Danh mục</p>
                        </Link>
                    </li>
                    <li className="active">
                        <Link to={`/admin/list-post/1/10`} className="nav-link">
                            <i className="far fa-circle nav-icon" style={{ padding: "0 10px 5px 0" }}></i>
                            <p>Tất cả bài viết</p>
                        </Link>
                    </li>
                    <li className="active">
                        <Link to={`/admin/list-topic`} className="nav-link">
                            <i className="far fa-circle nav-icon" style={{ padding: "0 10px 5px 0" }}></i>
                            <p>Chủ đề</p>
                        </Link>
                    </li>
                    {/* <li className="active">
                            <Link to={`/admin/pages/1/10`} className="nav-link">
                                <i className="far fa-circle nav-icon" style={{ padding: "0 10px 5px 0" }}></i>
                                <p>Trang đơn</p>
                            </Link>
                        </li> */}
                    <li className="active">
                        <Link to={"/admin/list-sale-be"} className="nav-link">
                            <i className="far fa-circle nav-icon" style={{ padding: "0 10px 5px 0" }}></i>
                            <p>Quản lý sale</p>
                        </Link>
                    </li>
                    {/* <li className="active">
                        <Link to={`/admin/orders/1/10`} className="nav-link">
                            <i className="far fa-circle nav-icon" style={{ padding: "0 10px 5px 0" }}></i>
                            <p>Tất cả đơn hàng</p>
                        </Link>
                    </li> */}
                    {/* <li className="active">
                            <Link to={`/admin/product-import/1/10`} className="nav-link">
                                <i className="far fa-circle nav-icon" style={{ padding: "0 10px 5px 0" }}></i>
                                <p>Nhập hàng</p>
                            </Link>
                        </li> */}
                    <li className="active">
                        <Link to={`/admin/list-customer/1/10`} className="nav-link">
                            <i className="nav-icon far fa-circle" style={{ padding: "0 10px 5px 0" }}></i>
                            <p className="text"> Khách hàng</p>
                        </Link>
                    </li>

                    <li className="active">
                        <Link to={"/admin/list-brands"} className="nav-link">
                            <i className="far fa-circle nav-icon" style={{ padding: "0 10px 5px 0" }}></i>
                            <p>Thương hiệu</p>
                        </Link>
                    </li>
                    <li className="active">
                        <Link to={"/admin/list-brands"} className="nav-link">
                            <i className="far fa-circle nav-icon" style={{ padding: "0 10px 5px 0" }}></i>
                            <p>Quản lý đánh giá</p>
                        </Link>
                    </li>

                </ul>
                {/* <ul class="side-menu">
                    <li>
                        <a href="#">
                            <i class='bx bxs-cog' ></i>
                            <span class="text">Settings</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="logout">
                            <i class='bx bxs-log-out-circle' ></i>
                            <span class="text">Logout</span>
                        </a>
                    </li>
                </ul> */}
            </section>

        </>);
}

export default SliderBar;