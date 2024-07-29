//import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import productServices from "../../../services/ProductService";
import categoryServices from "../../../services/CategoryService";
import brandServices from "../../../services/BrandService";
import Notification, { showNotification } from '../Notificatio'; // Import Notification và hàm showNotification




function ProductUpdate() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [categorys, setCategorys] = useState([]);
    const [brands, setBrands] = useState([]);

    const [category_id, setCategoryid] = useState(0);
    const [brand_id, setBrandId] = useState(0);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [qty, setQty] = useState(0);
    const [description_1, setDescription1] = useState("");
    const [description_2, setDescription2] = useState("");
    const [status, setStatus] = useState(1);

    const [chip, setChip] = useState('');
    const [screen, setScreen] = useState('');
    const [rear_camera, setRearCamera] = useState('');
    const [front_camera, setFrontCamera] = useState('');
    const [operating_system, setOperatingSysem] = useState('');
    const [ram, setRam] = useState('');
    const [rom, setRom] = useState('');
    const [pin, setPin] = useState('');
    const [size, setSize] = useState('');
    const [connect, setConnect] = useState('');

    useEffect(function () {
        (async function () {

            await productServices.getById(id).then(function (result) {
                setName(result.data.products.name);
                setCategoryid(result.data.products.category_id);
                setBrandId(result.data.products.brand_id);
                setDescription1(result.data.products.description_1);
                setDescription2(result.data.products.description_2);
                setChip(result.data.products.chip);
                setScreen(result.data.products.screen);
                setFrontCamera(result.data.products.front_camera);
                setRearCamera(result.data.products.rear_camera);
                setOperatingSysem(result.data.products.operating_system);
                setRam(result.data.products.ram);
                setRom(result.data.products.rom);
                setPin(result.data.products.pin);
                setSize(result.data.products.size);
                setConnect(result.data.products.connect);
                setPrice(result.data.products.price);
                setQty(result.data.products.qty);

            });

            await categoryServices.getBackend().then(function (result) {
                setCategorys(result.data.categories);
            });

            await brandServices.getAll().then(function (result) {
                setBrands(result.data.brands);
            });
        })();

    }, []);




    async function productUpdate(event) {
        event.preventDefault();

        const image = document.querySelector("#image");
        const image_detail = document.querySelector("#image_detail");
        const image_related_1 = document.querySelector("#image_related_1");
        const image_related_2 = document.querySelector("#image_related_2");

        if (name !== '' && price !== '' && qty !== '' && description_1 !== '' && description_2 !== '') {
            var product = new FormData();
            product.append("category_id", category_id);
            product.append("brand_id", brand_id);
            product.append("name", name);
            product.append("price", price);
            product.append("qty", qty);
            product.append("description_1", description_1);
            product.append("description_2", description_2);
            product.append("status", status);

            product.append("chip", chip);
            product.append("screen", screen);
            product.append("rear_camera", rear_camera);
            product.append("front_camera", front_camera);
            product.append("operating_system", operating_system);
            product.append("ram", ram);
            product.append("rom", rom);
            product.append("pin", pin);
            product.append("size", size);
            product.append("connect", connect);

            product.append("image", image.files.length === 0 ? "" : image.files[0]);
            product.append("image_detail", image_detail.files.length === 0 ? "" : image_detail.files[0]);
            product.append("image_related_1", image_related_1.files.length === 0 ? "" : image_related_1.files[0]);
            product.append("image_related_2", image_related_2.files.length === 0 ? "" : image_related_2.files[0]);


            await productServices.update(product, id).then(function (res) {
                if (res.data.success === true) {
                    showNotification(res.data.message, 'success');
                    setTimeout(() => {
                        navigate("/admin/list-products/10/1", { replace: true });
                        window.location.reload();
                    }, 3000)
                }
                else {
                    showNotification(res.data.message, 'warning');
                }
            });

        } else {
            showNotification("Vui lòng nhập đầy đủ thông tin.", 'error');
        }
    }



    return (
        <form onSubmit={productUpdate} method="post">
            <Notification />
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6">
                            <strong className="text-danger">Cập nhật sản phẩm</strong>
                        </div>
                        <div className="col-md-6 text-end">
                            <button type="submit" className="btn btn-sm btn-success me-2">
                                Lưu
                            </button>
                            <Link to="/admin/list-products/10/1" className="btn btn-sm btn-info">Quay lại</Link>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="mb-3">
                                <label htmlFor="name">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-control"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="brand_id">Thương hiệu</label>
                                <select
                                    name="brand_id"
                                    className="form-control"
                                    value={brand_id}
                                    onChange={(e) => setBrandId(e.target.value)}
                                >
                                    <option value="0">None</option>
                                    {brands.map(function (bra, index) {
                                        return (
                                            <option key={index} value={bra.id}>
                                                {bra.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="sort_order">Danh mục</label>
                                <select
                                    name="category_id"
                                    className="form-control"
                                    value={category_id}
                                    onChange={(e) => setCategoryid(e.target.value)}
                                >
                                    <option value="0">None</option>
                                    {categorys.map(function (cat, index) {
                                        return (
                                            <option key={index} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="metakey">Mô tả sản phẩm</label>
                                <textarea
                                    name="metakey"
                                    value={description_1}
                                    onChange={(e) => setDescription1(e.target.value)}
                                    className="form-control"
                                    rows="6"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="metadesc">Mô tả sản phẩm</label>
                                <textarea
                                    name="metadesc"
                                    value={description_2}
                                    onChange={(e) => setDescription2(e.target.value)}
                                    className="form-control"
                                    rows="6"
                                />
                            </div>
                            <h6>Thông số kĩ thuật</h6>

                            <div className="mb-3">
                                <label htmlFor="name">Chip xử lý</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={chip}
                                    onChange={(e) => setChip(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name">Màng hình</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={screen}
                                    onChange={(e) => setScreen(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name">Camera sau</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={rear_camera}
                                    onChange={(e) => setRearCamera(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name">Camera trước</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={front_camera}
                                    onChange={(e) => setFrontCamera(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name">Hệ điều hành</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={operating_system}
                                    onChange={(e) => setOperatingSysem(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name">Ram</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={ram}
                                    onChange={(e) => setRam(e.target.value)}
                                    className="form-control"
                                />
                            </div><div className="mb-3">
                                <label htmlFor="name">Dung lượng lưu trữ</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={rom}
                                    onChange={(e) => setRom(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name">Pin</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name">Kích thước</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name">Kết nối</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={connect}
                                    onChange={(e) => setConnect(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="mb-3">
                                <label htmlFor="price">Gía</label>
                                <input
                                    name="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="qty">Số lượng</label>
                                <input
                                    name="qty"
                                    value={qty}
                                    onChange={(e) => setQty(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image">Hình ảnh</label>
                                <input type="file" id="image" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image">Hình ảnh chi tiết</label>
                                <input type="file" id="image_detail" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image">Hình ảnh liên quan</label>
                                <input type="file" id="image_related_1" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image">Hình ảnh liên quan</label>
                                <input type="file" id="image_related_2" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="status">Trạng thái</label>
                                <select
                                    name="status"
                                    className="form-control"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="1">Xuất bản</option>
                                    <option value="2">Chưa xuất bản</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default ProductUpdate;