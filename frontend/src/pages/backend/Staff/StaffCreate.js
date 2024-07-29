import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRole from "../../../api/apiRole";
import apiStaff from "../../../api/apiStaff";

function StaffCreate() {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(2);
    const [role_id, setRoleId] = useState(1);
    const [roles, setRoles] = useState([]);



    useEffect(() => {
        apiRole.getAllRole().then(res=>{
            setRoles(res.data);
        })
    }, [])


    const handleSubmit = async (e) => {
        if (name !== '' && email !== '' && password !== '' && phone !== '') {
            e.preventDefault();
            const data = {
                name: name,
                email: email,
                phone: phone,
                password: password,
                role_id: role_id,
                status: status,
                created_by: 1
            };

            await apiStaff.createStaff(data).then((res) => {
                if (res.data != null) {
                    alert("Thêm dữ liệu thành công !")

                    setName('');
                    setEmail('');
                    setPassword('');
                    setPhone('');
                    navigate('/admin/list-staff', { replace: true });

                }
                else {
                    alert("Không thành công !")
                }
            })
        }
        else {
            e.preventDefault();
            alert('Vui lòng nhập đầu đủ thông tin !')
        }
    }


    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-10">
                            <h1 className="d-inline">Thêm nhân viên</h1>
                        </div>
                        <div className="col-sm-2  text-right">
                            <Link to="/admin/list-staff" className="btn btn-sm btn-info">
                                <i className="fa fa-reply me-1" aria-hidden="true"></i>
                                Quay lại
                            </Link>
                        </div>

                    </div>
                </div>
            </section>
            <section className="content">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4"></div>
                            <div className="col-md-4">
                                <form onSubmit={handleSubmit} >

                                    <div className="mb-3">
                                        <label>Họ tên (*)</label>
                                        <input type="text" name="name" placeholder="Nhập họ tên" className="form-control"
                                            value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    {/* <div className="mb-3">
                                        <label>User name</label>
                                        <input type="text" name="name" placeholder="Nhập user name" className="form-control"
                                            value={user_name} onChange={(e) => setUserName(e.target.value)} />
                                    </div> */}
                                    <div className="mb-3">
                                        <label>Số điện thoại (*)</label>
                                        <input type="text" name="name" placeholder="Nhập số điện thoại" className="form-control"
                                            value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Email (*)</label>
                                        <input type="email" name="name" placeholder="Nhập email" className="form-control"
                                            value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Password (*)</label>
                                        <input type="password" name="name" placeholder="Nhập password" className="form-control"
                                            value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Vai trò</label>
                                        <select name="status" className="form-control" value={role_id} onChange={(e) => setRoleId(e.target.value)}>
                                            {roles.map((item, index)=>(
                                                <option value={item.id}>{item.role_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label>Trạng thái</label>
                                        <select name="status" className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                                            <option value="1">Hoạt động</option>
                                            <option value="2">Khóa</option>
                                        </select>
                                    </div>
                                    <div className="card-header text-right">
                                        <button className="btn btn- btn-success">
                                            <i className="fa fa-save me-2" aria-hidden="true"></i>
                                            Lưu
                                        </button>
                                    </div>
                                </form>

                            </div>
                            <div className="col-md-4"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    );
}

export default StaffCreate;