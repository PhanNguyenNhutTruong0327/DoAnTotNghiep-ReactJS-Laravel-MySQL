import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import OrderServices from '../../../services/OrderService';

function OrderCancel() {

    const [data, setData] = useState([]);

    const page = parseInt(useParams().page);
    const limit = parseInt(useParams().limit);

    const [pages, setPages] = useState(1);

    const [qty_data, setQtyData] = useState(0);

    const [tamp, setTamp] = useState();



    useEffect(() => {
        OrderServices.getOrderCancel(page, limit).then((res) => {
            try {
                console.log(res.data)
                const numberOfPages = res.meta.pagination.pageCount;
                setPages(numberOfPages);
                setData(res.data);
                setQtyData(res.meta.pagination.total);


            } catch (e) {
                console.log(e);
            }
            setTamp();
        })
    }, [tamp, page])


    const handleSubmit = async (e) => {
        // if (name !== '' && email !== '' && password !== '' && phone !== '') {
        //     e.preventDefault();
        //     const data = {
        //         name: name,
        //         user_name: user_name,
        //         email: email,
        //         phone: phone,
        //         password: password,
        //         roles: 'admin',
        //         status: status
        //     };

        //     await apiMember.createMember(data).then((res) => {
        //         if (res.data != null) {
        //             alert("Thêm dữ liệu thành công !")
        //             setTamp(res.data.id);

        //             setName('');
        //             setUserName('');
        //             setEmail('');
        //             setPassword('');
        //             setPhone('');
        //         }
        //         else {
        //             alert("Không thành công !")
        //         }
        //     })
        // }
        // else {
        //     e.preventDefault();
        //     alert('Vui lòng nhập đầu đủ thông tin !')
        // }
    }

    // trash cat
    function trashPost(id) {
        // apiPost.trashPost(id).then(function (result) {
        //     if (result.data.success === 'true') {
        //         alert(result.data.message);
        //         setTamp(id)
        //     }
        //     else {
        //         alert(result.data.message);
        //     }

        // })
    }

    // hien thi
    function displayPost(id) {
        // apiPost.displayPost(id).then(function (result) {
        //     if (result.data.success === 'true') {
        //         alert(result.data.message);
        //         setTamp(id);
        //     }
        //     else {
        //         alert(result.data.message);
        //     }
        // })
    }

    return (
        <div className="content-wrapper">
            {console.log(data)}
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-10">
                            <h1 className="d-inline">Tất cả đơn hàng bị hủy <sup>({qty_data})</sup></h1>
                        </div>
                        <div className="col-sm-2  text-right">
                            <Link to="/admin/orders/1/10" className="btn btn-sm btn-info">
                                <i className="fa fa-reply me-1" aria-hidden="true"></i>
                                Quay lại
                            </Link>
                        </div>

                    </div>
                </div>
            </section>
            <section className="content">
                <div className="card">
                    <div className="text-right pt-2 pe-4">
                        {/* <Link class="btn btn-success" to="/admin/list-post/create">
                            Tạo bài viết
                        </Link> */}

                    </div>
                    <div className="card-body">
                        {data.length > 0 ? (
                            <div className="row">
                                <div className="col-md">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th className="text-center" style={{ width: "30px" }}>
                                                    <input type="checkbox" />
                                                </th>
                                                <th>Id</th>
                                                {/* <th className="text-center" style={{ width: "130px" }}>Hình ảnh</th> */}
                                                <th>Tên khách hàng</th>
                                                {/* <th>Tên slug</th> */}
                                                <th>Email</th>
                                                <th>Sđt</th>
                                                <th>Phương thức nhận hàng</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((item, index) => {
                                                return (
                                                    <tr className="datarow" key={index}>
                                                        <td>
                                                            <input type="checkbox" />
                                                        </td>
                                                        <td>{item.id}</td>
                                                        {/* <td>
                                                    <img src={imageURL + item.image} alt="product.jpg" style={{ width: "100%" }} />
                                                </td> */}
                                                        <td>
                                                            <div className="name">
                                                                {item.name}
                                                            </div>
                                                            <div className="function_style">
                                                                {/* <button onClick={() => displayPost(item.id)} className="btn btn-sm">{item.status === 2 ? "Hiện" : "Ẩn"}</button> | */}
                                                                {/* <Link to={`/admin/list-post/update/${item.id}`} className="btn btn-sm">Chỉnh sửa</Link> | */}
                                                                <Link to={`/admin/order/show/${item.id}`} className="btn btn-sm"><i className="fa fa-eye me-1"></i>Chi tiết</Link> |
                                                                <button onClick={() => trashPost(item.id)} className="btn btn-sm"><i className="fa fa-edit me-1" ></i>Cập nhật trạng thái</button>
                                                            </div>
                                                        </td>
                                                        {/* <td>{item.slug}</td> */}
                                                        <td>{item.email}</td>
                                                        <td>{item.phone}</td>
                                                        <td>{item.shipping_methods}</td>
                                                        <td>{item.status === 1 ? "Chưa giao hàng" : item.status === 2 ? "Đang giao hàng" : "Đã giao hàng"}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <ul className="pagination">
                                    <li className="page-item">
                                        {page > 1 ? (
                                            <Link className="page-link" to={`/admin/orders/${page - 1}/${limit}`}>Previous</Link>
                                        ) : (
                                            <span className="page-link disabled">Previous</span>
                                        )}
                                    </li>
                                    {Array.from(Array(pages).keys()).map((index) => (
                                        <li
                                            key={index}
                                            className={`page-item ${index + 1 === page ? "active" : ""}`}
                                        >
                                            <Link
                                                className="page-link bg-white"
                                                to={`/admin/orders/${index + 1}/${limit}`}
                                            >
                                                {index + 1}
                                            </Link>
                                        </li>
                                    ))}
                                    <li className="page-item">
                                        <Link className="page-link" to={`/admin/orders/${page + 1}/${limit}`}>
                                            Next
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                        ) : (
                            <div className="text-center">Không có đơn hàng bị hủy</div>
                        )}
                    </div>
                </div>
            </section>
        </div>

    );
}

export default OrderCancel;