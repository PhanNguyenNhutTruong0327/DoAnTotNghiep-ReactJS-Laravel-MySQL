import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import productServices from "../../../services/ProductService";
import categoryServices from "../../../services/CategoryService";
import brandServices from "../../../services/BrandService";
import Notification, { showNotification } from '../Notificatio'; // Import Notification và hàm showNotification

function ProductCreate() {
    const navigate = useNavigate();

    const [categorys, setCategorys] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const categoryResponse = await categoryServices.getBackend();
                setCategorys(categoryResponse.data.categories);

                const brandResponse = await brandServices.getAll();
                setBrands(brandResponse.data.brands);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    const [errors, setErrors] = useState({});

    const [category_id, setCategoryid] = useState(0);
    const [brand_id, setBrandId] = useState(0);
    const [name, setName] = useState("");
    const [price, setPrice] = useState('');
    const [qty, setQty] = useState('');
    const [description_1, setDescription1] = useState("");
    const [description_2, setDescription2] = useState("");
    const [status, setStatus] = useState(1);

    const [chip, setChip] = useState('Không có');
    const [screen, setScreen] = useState('Không có');
    const [rear_camera, setRearCamera] = useState('Không có');
    const [front_camera, setFrontCamera] = useState('Không có');
    const [operating_system, setOperatingSystem] = useState('Không có');
    const [ram, setRam] = useState('Không có');
    const [rom, setRom] = useState('Không có');
    const [pin, setPin] = useState('Không có');
    const [size, setSize] = useState('Không có');
    const [connect, setConnect] = useState('Không có');

    const validateForm = () => {
        const errors = {};

        if (name.length < 6) {
            errors.name = "Tên sản phẩm phải có ít nhất 6 ký tự.";
        }
        if (description_1.length < 10) {
            errors.description_1 = "Mô tả sản phẩm phải có ít nhất 10 ký tự.";
        }
        if (price === '') {
            errors.price = "Vui lòng nhập giá sản phẩm.";
        }
        if (qty === '') {
            errors.qty = "Vui lòng nhập số lượng sản phẩm.";
        }

        return errors;
    };

    const productStore = async (event) => {
        event.preventDefault();

        const errors = validateForm();
        setErrors(errors);

        const image = document.querySelector("#image");
        const image_detail = document.querySelector("#image_detail");
        const image_related_1 = document.querySelector("#image_related_1");
        const image_related_2 = document.querySelector("#image_related_2");

        if (Object.keys(errors).length === 0) { // Only submit if there are no errors
            const product = new FormData();
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

            product.append("image", image.files[0]);
            image_detail.files[0] ? product.append("image_detail", image_detail.files[0]) : product.append("image_detail", "");
            image_related_1.files[0] ? product.append("image_related_1", image_related_1.files[0]) : product.append("image_related_1", "");
            image_related_2.files[0] ? product.append("image_related_2", image_related_2.files[0]) : product.append("image_related_2", "");

            try {
                const res = await productServices.create(product);
                if (res.data.success === true) {
                    showNotification(res.data.message, 'success');
                    setTimeout(() => {
                        navigate("/admin/list-products/10/1", { replace: true });
                    }, 3000);
                } else {
                    showNotification(res.data.message, 'warning');
                }
            } catch (error) {
                console.error('Error creating product:', error);
                showNotification('Có lỗi xảy ra khi thêm sản phẩm!', 'error');
            }
        } else {
            showNotification("Vui lòng nhập đầy đủ thông tin.", 'warning');
        }
    };

    return (
        <form onSubmit={productStore} method="post">
            <Notification />
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <div className="col-md-6">
                            <strong className="text-danger">Thêm sản phẩm</strong>
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
                            <div className={`mb-3 ${errors.name && 'has-error'}`}>
                                <label htmlFor="name">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`form-control ${errors.name && 'is-invalid'}`}
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
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
                                    {brands.map((bra, index) => (
                                        <option key={index} value={bra.id}>{bra.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="category_id">Danh mục</label>
                                <select
                                    name="category_id"
                                    className="form-control"
                                    value={category_id}
                                    onChange={(e) => setCategoryid(e.target.value)}
                                >
                                    <option value="0">None</option>
                                    {categorys.map((cat, index) => (
                                        <option key={index} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={`mb-3 ${errors.description_1 && 'has-error'}`}>
                                <label htmlFor="description_1">Mô tả sản phẩm</label>
                                <textarea
                                    name="description_1"
                                    value={description_1}
                                    onChange={(e) => setDescription1(e.target.value)}
                                    className={`form-control ${errors.description_1 && 'is-invalid'}`}
                                    rows="6"
                                />
                                {errors.description_1 && <div className="invalid-feedback">{errors.description_1}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="description_2">Mô tả sản phẩm chi tiết</label>
                                <textarea
                                    name="description_2"
                                    value={description_2}
                                    onChange={(e) => setDescription2(e.target.value)}
                                    className="form-control"
                                    rows="6"
                                />
                            </div>

                            {category_id == 1 || category_id == 2 || category_id == 3 ? (
                                <>
                                    <h6>Thông số kĩ thuật</h6>

                                    <div className="mb-3">
                                        <label htmlFor="chip">Chip xử lý</label>
                                        <input
                                            type="text"
                                            name="chip"
                                            value={chip}
                                            onChange={(e) => setChip(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="screen">Màng hình</label>
                                        <input
                                            type="text"
                                            name="screen"
                                            value={screen}
                                            onChange={(e) => setScreen(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="rear_camera">Camera sau</label>
                                        <input
                                            type="text"
                                            name="rear_camera"
                                            value={rear_camera}
                                            onChange={(e) => setRearCamera(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="front_camera">Camera trước</label>
                                        <input
                                            type="text"
                                            name="front_camera"
                                            value={front_camera}
                                            onChange={(e) => setFrontCamera(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="operating_system">Hệ điều hành</label>
                                        <input
                                            type="text"
                                            name="operating_system"
                                            value={operating_system}
                                            onChange={(e) => setOperatingSystem(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="ram">Ram</label>
                                        <input
                                            type="text"
                                            name="ram"
                                            value={ram}
                                            onChange={(e) => setRam(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="rom">Dung lượng lưu trữ</label>
                                        <input
                                            type="text"
                                            name="rom"
                                            value={rom}
                                            onChange={(e) => setRom(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="pin">Pin</label>
                                        <input
                                            type="text"
                                            name="pin"
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="size">Kích thước</label>
                                        <input
                                            type="text"
                                            name="size"
                                            value={size}
                                            onChange={(e) => setSize(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="connect">Kết nối</label>
                                        <input
                                            type="text"
                                            name="connect"
                                            value={connect}
                                            onChange={(e) => setConnect(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                </>
                            ) : null}

                        </div>
                        <div className="col-md-3">
                            <div className={`mb-3 ${errors.price && 'has-error'}`}>
                                <label htmlFor="price">Giá</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className={`form-control ${errors.price && 'is-invalid'}`}
                                />
                                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                            </div>
                            <div className={`mb-3 ${errors.qty && 'has-error'}`}>
                                <label htmlFor="qty">Số lượng</label>
                                <input
                                    type="text"
                                    name="qty"
                                    value={qty}
                                    onChange={(e) => setQty(e.target.value)}
                                    className={`form-control ${errors.qty && 'is-invalid'}`}
                                />
                                {errors.qty && <div className="invalid-feedback">{errors.qty}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image">Hình ảnh</label>
                                <input type="file" id="image" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image_detail">Hình ảnh chi tiết</label>
                                <input type="file" id="image_detail" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image_related_1">Hình ảnh liên quan 1</label>
                                <input type="file" id="image_related_1" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="image_related_2">Hình ảnh liên quan 2</label>
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

export default ProductCreate;
