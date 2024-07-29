import { useEffect, useState } from "react";
import apiCategory from "../../../api/apiCategory";
import { Link } from "react-router-dom";
import apiTag from "../../../api/apiTag";

function ListTag() {

    const [categories, setCategoies] = useState([]);
    const [tags, setTags] = useState([]);
    const [data, setData] = useState([]);


    const [cat, setCat] = useState(0);
    const [tag, setTag] = useState(0);

    const [qty_trash, setQtyTrash] = useState(0);
    const [qty_cat, setQtyCat] = useState(0);

    const [tamp, setTamp] = useState();
    const [trash, setTrash] = useState();

    useEffect(() => {
        apiCategory.getAll().then((res) => {
            try {
                console.log(res);
                const data = res.data;
                const categoryData = data.map((item) => {
                    return {
                        category_id: item.id,
                        name: item.category_name,
                    }
                });
                setCategoies(categoryData);
                setQtyCat(res.qty_categories);
                setQtyTrash(res.qty_trash);

            } catch (e) {
                console.log(e);
            }
        })

        apiTag.getAll().then((res) => {
            try {
                console.log(res);
                const data = res.data.data;
                const tagData = data.map((item) => {
                    return {
                        tag_id: item.id,
                        name_tag: item.tag_name,
                    }
                });
                setTags(tagData);

            } catch (e) {
                console.log(e);
            }
        })

        apiTag.getTagAndCategory().then((res) => {
            setData(res.data);
        })

    }, [tamp, trash])


    const handleSubmit = async (e) => {
        // if (catName !== '') {
        //     e.preventDefault();
        //     const category = {
        //     }
        //     await apiCategory.createCategory(category).then((res) => {
        //         if (res.data != null) {
        //             alert("Thêm dữ liệu thành công !")
        //             setTamp(res.data.id);
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
    function trashCategory(id) {
        //     apiCategory.trashCategory(id).then(function (result) {
        //         if (result.data !== null) {
        //             alert("Đã thêm vào thùng rác !");
        //             setTrash(result.data.id);
        //         }
        //         else {
        //             alert("Không tìm thấy dữ liệu !");
        //         }
        //     })
    }

    // hien thi
    function displayCategory(id) {
        // apiCategory.displayCat(id).then(function (result) {
        //     if (result.data !== null) {
        //         alert("Cập nhật thành công !");
        //         setTrash(result.data.id);
        //     }
        //     else {
        //         alert("Không tìm thấy dữ liệu !");
        //     }
        // })
    }

    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-10">
                            <h1 className="d-inline">Tất cả danh mục <sup>({qty_cat})</sup></h1>
                        </div>
                        <div className="col-sm-2  text-right">
                            <Link class="action-btn" to="/admin/list-categories/list-trash" style={{ color: "red" }}>
                                <i class="fa fa-trash" aria-hidden="true"></i>
                                <sup class="count ms-1">{qty_trash}</sup>
                            </Link>
                        </div>

                    </div>
                </div>
            </section>
            <section className="content">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <form onSubmit={handleSubmit} >

                                    <div className="mb-3">
                                        <label>Tiêu đề tag (*)</label>
                                        <select name="parent_id" className="form-control" onChange={(e) => setTag(e.target.value)} value={tag}>
                                            <option value="0">None</option>
                                            {tags.map((item, index) => {
                                                return (
                                                    <option value={item.tag_id} key={index}>{item.name_tag}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label>Danh mục (*)</label>
                                        <select name="parent_id" className="form-control" onChange={(e) => setCat(e.target.value)} value={cat}>
                                            <option value="0">None</option>
                                            {categories.map((item, index) => {
                                                return (
                                                    <option value={item.category_id} key={index}>{item.name}</option>
                                                )
                                            })}
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
                            <div className="col-md-8">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ width: "30px" }}>
                                                <input type="checkbox" />
                                            </th>
                                            <th>Id</th>
                                            {/* <th className="text-center" style={{ width: "130px" }}>Hình ảnh</th> */}
                                            <th>Tên danh mục</th>
                                            <th>Tên tag </th>
                                            <th>Hành động</th>
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
                                                        <img src="../public/images/category.jpg" alt="category.jpg" />
                                                    </td> */}
                                                    <td style={{ width: "38%" }}>
                                                        <div className="name">
                                                            {item.name_cat}
                                                        </div>
                                                    </td>
                                                    {/* <td>{item.slug}</td> */}
                                                    <td>{item.name_tag}</td>
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

export default ListTag;