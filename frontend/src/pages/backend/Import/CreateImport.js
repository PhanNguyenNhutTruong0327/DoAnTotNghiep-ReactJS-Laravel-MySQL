import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import apiProduct from "../../../api/apiProduct";
import { imageURL } from "../../../api/config";
import apiStore from "../../../api/apiStore";

function CreateImport() {

    const { id } = useParams();

    const navigate = useNavigate(); // chuyen trang


    const [qty, setQty] = useState(1);

    const [product, setProduct] = useState([]);

    useEffect(() => {
        apiProduct.getProductById(id).then((res) => {
            setProduct(res.data.data)
        })

    }, [])

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (qty !== 0) {
            const data = {
                product_id: id,
                qty: parseInt(qty) + parseInt(product.qty)
            }
            console.log(data);
            await apiStore.createStore(data).then((res) => {
                if (res.data.success === 'true') {
                    alert(res.data.message)
                    navigate('/admin/product-import/1/10', { replace: true });
                }
                else {
                    alert(res.data.message)
                }
            })

        }
        else {
            alert("Vui lòng nhập đầy đủ thông tin !");
        }

    }

    return (
        <div className="content-wrapper">
            {console.log(product)}
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-10">
                            <h1 className="d-inline">Nhập hàng</h1>
                        </div>
                        <div className="col-sm-2  text-right">
                            <Link to="/admin/product-import/1/10" className="btn btn-sm btn-info">
                                <i className="fa fa-reply me-1" aria-hidden="true"></i>
                                Quay lại
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                <div className="card">
                    <br />
                    {product.product_id ? (<div className="card-body">
                        <div className="row">
                            <div className="col-md-2"></div>
                            <div className="col-md-8">
                                <form onSubmit={handleSubmit} >

                                    <div className="mb-3">
                                        <label>Sản phẩm:</label>
                                        <span className="ps-2">{product.name}</span>
                                        <br />
                                        <div className="text-center">
                                            <img style={{ width: "auto", height: "150px" }} src={imageURL + product.image} alt="anh" />

                                        </div>
                                        <br />
                                        <label>Số lượng nhập ban đầu: </label>
                                        <span className="ms-2">{product.qty}</span>
                                        <br />
                                        <label>Số lượng còn lại: </label>
                                        <span className="ms-2">{product.qty - product.qty_sold}</span>

                                    </div>
                                    <div className="mb-3">
                                        <label>Số lượng nhập thêm (*)</label>
                                        <input type="number" name="description" className="form-control"
                                            value={qty} onChange={(e) => setQty(e.target.value)} min={1} />
                                    </div>
                                    <div className="card-header text-right">
                                        <button className="btn btn- btn-success">
                                            <i className="fa fa-save me-2" aria-hidden="true"></i>
                                            Lưu
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                    ) : (
                        <div>
                            <p className="text-center">Không tìm thấy dữ liệu !</p>
                            <br />
                        </div>
                    )}
                </div>
            </section>
        </div>

    );
}

export default CreateImport;