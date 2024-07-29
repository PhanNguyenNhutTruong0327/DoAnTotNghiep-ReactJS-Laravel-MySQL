import { Link } from "react-router-dom";
import { useAuth } from "../Provider/AuthProvider";

function Menu_Account() {

    const { token, setToken } = useAuth();

    const handleLogout = () => {
        setToken(null);
        window.location.reload();

    }

    return (
        <aside className="col-md-3">
            <nav className="list-group">
                <Link className="list-group-item active text-white" style={{ background: "#ff6a00", borderColor: "#ff6a00" }} to="/tai-khoan">Tổng quan</Link>
                <Link className="list-group-item" to={`/tai-khoan/don-hang/5/1`}> Đơn hàng</Link>
                <Link className="list-group-item" to={`/tai-khoan/cai-dat`}> Cài đặt tài khoản </Link>
                <button className="list-group-item text-left" onClick={handleLogout}> Đăng xuất </button>
            </nav>
        </aside>

    );
}

export default Menu_Account;