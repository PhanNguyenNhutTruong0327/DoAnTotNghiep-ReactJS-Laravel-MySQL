import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Menu_Item from "../../component/frontend/Menu_Item";
import { useAuth } from "../../component/Provider/AuthProvider";
import { useCart } from "react-use-cart";
import { urlImage } from "../../config";
import categoryServices from "../../services/CategoryService";
import { FaUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import LogoHome from '../../../src/assets/frontend/images/icons/logo-thế-giới-di-động-removebg-preview.png';
import './stylefe.css';

function Header() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [key, setKey] = useState('');
  const { token, setToken } = useAuth();
  const [qty_order, setQuyOrder] = useState(0);
  const { items } = useCart();
  const [searchParams] = useSearchParams();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const idGoogle = searchParams.get('id_google');
      const userId = searchParams.get('user_id');
      console.log(idGoogle, userId);
      try {
        await categoryServices.getListCategories(0).then(res => {
          setCategories(res.data.data);
        });
        const user = await JSON.parse(localStorage.getItem('token'));
        if (user !== null) {
          setQuyOrder(items.filter(item => item.user_id === user.user.id).length);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [items, token]);

  const handleSearch = (e) => {
    setKey(e.target.value);
    if (e.target.value.length > 0) {
      navigate(`/tim-kiem/${e.target.value}/12/1`);
    } else {
      navigate(`/`);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.reload();
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const user = JSON.parse(localStorage.getItem('token'));

  return (
    <div>
      <header className="section-header">
        <section className="header-main border-bottom">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-3 col-lg-3 col-md-12">
                <Link to="/" className="brand-wrap">
                  <img className="logo" src={LogoHome} alt="logo" style={{ paddingLeft: "50px", minHeight: "100px" }} />
                </Link>
              </div>
              <div className="col-xl-6 col-lg-5 col-md-6">
                <form action="#" className="search-header">
                  <div className="input-group w-100">
                    <input type="text" className="form-control" placeholder="Search" style={{ height: "40px", borderColor: "#ff6a00" }} value={key} onChange={handleSearch} />
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="submit">
                        <i className="fa fa-search"></i> Tìm kiếm
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="widgets-wrap float-md-right">
                  <div className="widget-header mr-3">
                    {token ? (
                      <div className="my-auto" onClick={toggleDropdown} style={{ cursor: 'pointer', textAlign: 'center' }}>
                        <div className="widget-header mr-3">
                          <FaUser size={26} />
                        </div>
                        <small className="text" style={{ marginRight: "17px" }}>{user ? user.user.name : "Tài khoản"}</small>
                        <div className={`dropdown-menu-custom ${isDropdownVisible ? 'show' : ''}`}>
                          <Link className="dropdown-item" to="/tai-khoan">Thông tin khách hàng</Link>
                          <button className="dropdown-item" onClick={logout}>Đăng xuất</button>
                        </div>
                      </div>
                    ) : (
                      <div className="widget-header mr-3">

                        <Link className="nav-link" to="/login" style={{ textAlign: 'center' }}>
                          <FaUser size={28} />
                          <div>
                            <small className="text">Tài Khoản</small>
                          </div>
                        </Link>
                      </div>

                    )}
                  </div>
                  {/* <div className="widget-header mr-3">
                    <a href="#" className="widget-view">
                      <div className="icon-area">
                        <i className="fa fa-comment-dots"></i>
                      </div>
                      <small className="text"> Thông báo </small>
                    </a>
                  </div> */}
                  <div className="widget-header">
                    <Link to="/cart" className="widget-view">
                      <div className="icon-area">
                        <i className="fa fa-shopping-cart"></i>
                        <span className="notify">{qty_order}</span>
                      </div>
                      <small className="text"> Giỏ hàng </small>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <nav className="navbar navbar-main navbar-expand-lg border-bottom">
          <div className="container">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main_nav" aria-controls="main_nav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-center" id="main_nav">
              <ul className="navbar-nav">
                {categories.map((menu, index) => (
                  <Menu_Item menu={menu} key={index} />
                ))}
              </ul>
            </div>
          </div>
        </nav>

      </header>
    </div>
  );
}

export default Header;
