import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiStaff from "../../../api/apiStaff";

function ListStaff() {

    const [staff, setStaff] = useState([]);

    const [name, setName] = useState('');
    const [user_name, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(2);

    const [qty_user, setQtyUser] = useState(0);
    const [qty_trash, setQtyTrash] = useState(0);

    const [tamp, setTamp] = useState();
    const [trash, setTrash] = useState();

    useEffect(() => {
        apiStaff.getAll().then((res) => {
            try {
                const data = res.data;
                const userData = data.map((item) => {
                    // if(item.status === 2){
                    //     setNameButton('Hien')
                    // }
                    return {
                        id: item.id,
                        name: item.name,
                        email: item.email,
                        role_name: item.role_name,
                        phone: item.phone,
                        status: item.status
                    }
                });
                setStaff(userData);
                setQtyUser(res.qty_user);
                setQtyTrash(res.qty_trash);
            } catch (e) {
                console.log(e);
            }
            setTamp();
        })
    }, [tamp, trash])


    // const handleSubmit = async (e) => {
    //     if (name !== '' && email !== '' && password !== '' && phone !== '') {
    //         e.preventDefault();
    //         const data = {
    //             name: name,
    //             user_name: user_name,
    //             email: email,
    //             phone: phone,
    //             password: password,
    //             roles: 'admin',
    //             status: status
    //         };

    //         await apiMember.createMember(data).then((res) => {
    //             if (res.data != null) {
    //                 alert("Thêm dữ liệu thành công !")
    //                 setTamp(res.data.id);

    //                 setName('');
    //                 setUserName('');
    //                 setEmail('');
    //                 setPassword('');
    //                 setPhone('');
    //             }
    //             else {
    //                 alert("Không thành công !")
    //             }
    //         })
    //     }
    //     else {
    //         e.preventDefault();
    //         alert('Vui lòng nhập đầu đủ thông tin !')
    //     }
    // }

    // trash cat
    function trashUser(id) {
        apiStaff.trashStaff(id).then(function (result) {
            alert(result.data.message);
            setTamp(id)

        })
    }

    // hien thi
    // function displayUser(id) {
    //     apiMember.displayMember(id).then(function (result) {
    //         if (result.data !== null) {
    //             alert("Cập nhật thành công !");
    //             setTamp(result.data.id);
    //         }
    //         else {
    //             alert("Không tìm thấy dữ liệu !");
    //         }
    //     })
    // }

    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-10">
                            <h1 className="d-inline">Tất cả nhân viên <sup>({qty_user})</sup></h1>
                        </div>
                        <div className="col-sm-2  text-right">
                            <Link class="action-btn" to="/admin/list-staff/list-trash" style={{ color: "red" }}>
                                <i class="fa fa-trash" aria-hidden="true"></i>
                                <sup class="count ms-1">{qty_trash}</sup>
                            </Link>
                        </div>

                    </div>
                </div>
            </section>
            <section className="content">
                <div className="card">
                    <div className="text-right pt-2 pe-4">
                        <Link class="btn btn-success btn-sm" to="/admin/list-staff/create">Thêm</Link>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {/* <div className="col-md-4">
                                <form onSubmit={handleSubmit} >

                                    <div className="mb-3">
                                        <label>Họ tên (*)</label>
                                        <input type="text" name="name" placeholder="Nhập họ tên" className="form-control"
                                            value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label>User name</label>
                                        <input type="text" name="name" placeholder="Nhập user name" className="form-control"
                                            value={user_name} onChange={(e) => setUserName(e.target.value)} />
                                    </div>
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

                            </div> */}
                            <div className="col-md-1"></div>
                            <div className="col-md-10">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ width: "30px" }}>
                                                <input type="checkbox" />
                                            </th>
                                            <th>Id</th>
                                            {/* <th className="text-center" style={{ width: "130px" }}>Hình ảnh</th> */}
                                            <th>Họ tên</th>
                                            <th>Vai trò</th>
                                            <th>Email</th>
                                            <th>Số điện thoại</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {staff.map((item, index) => {
                                            return (
                                                <tr className="datarow" key={index}>
                                                    <td>
                                                        <input type="checkbox" />
                                                    </td>
                                                    <td>{item.id}</td>
                                                    {/* <td>
                                                        <img src="../public/images/category.jpg" alt="category.jpg" />
                                                    </td> */}
                                                    <td style={{ width: "" }}>
                                                        <div className="name">
                                                            {item.name}
                                                        </div>
                                                        <div className="function_style">
                                                            <Link to={`/admin/list-staff/update/${item.id}`} className="btn btn-sm"><i className="fa fa-edit me-1" ></i>Chỉnh sửa</Link> |
                                                            <Link to={`/admin/list-staff/show/${item.id}`} className="btn btn-sm"><i className="fa fa-eye me-1"></i>Chi tiết</Link> |
                                                            <button onClick={() => trashUser(item.id)} className="btn btn-sm"><i className="fa fa-trash me-1"></i>Xoá</button>
                                                        </div>
                                                    </td>
                                                    <td>{item.role_name}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.phone}</td>
                                                    <td>{item.status === 2 ? "Khóa" : "Hoạt động"}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    );
}

export default ListStaff;