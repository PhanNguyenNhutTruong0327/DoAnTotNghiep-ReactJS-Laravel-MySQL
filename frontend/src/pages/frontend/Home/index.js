import { useEffect, useState, startTransition, Suspense, lazy } from "react";
import { useAuth } from "../../../component/Provider/AuthProvider";
import categoryServices from "../../../services/CategoryService";
import zalo from '../../../assets/frontend/images/Remove-bg.ai_1717924670872.png';
import mess from '../../../assets/frontend/images/logo-messenger-inkythuatso-2-01-30-15-47-51.png';
import insta from '../../../assets/frontend/images/Instagram_icon.png';
import fixedImage from '../../../assets/frontend/images/Screenshot 2024-06-10 015846.png'; // Thêm đường dẫn tới hình ảnh cố định
import "../../../assets/frontend/css/style.css";

const Brand = lazy(() => import('./Brand'));
const List_New = lazy(() => import('./List_New'));
const New = lazy(() => import('./New'));
const Product_Home = lazy(() => import('./Product_Home'));
const Sale = lazy(() => import('./Sale'));
const Slider = lazy(() => import('./Slider'));
const Suggested_Products = lazy(() => import('./Suggested_Products'));
const ProductBestSeller = lazy(() => import('./ProductBestSeller'));

function Home() {
    const { token } = useAuth();
    const [product_category, setProductCategory] = useState([]);
    const [showIcons, setShowIcons] = useState(false);

    // Hàm để hiển thị / ẩn các icon
    const toggleIcons = () => {
        setShowIcons(!showIcons);
    };

    useEffect(() => {
        const handleScroll = () => {
            const chatIcons = document.querySelector(".chat-icons");
            if (chatIcons) {
                if (window.scrollY > 100) {
                    chatIcons.classList.add("show");
                } else {
                    chatIcons.classList.remove("show");
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Check if the current path is the home page
    const isHomePage = window.location.pathname === '/';

    useEffect(() => {
        // Lấy dữ liệu danh mục sản phẩm
        const fetchData = async () => {
            try {
                const res = await categoryServices.getListCategories(0);
                startTransition(() => {
                    setProductCategory(res.data.data);
                });
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container">
            {console.log(token)}
            <section className="section-main padding-y">
                <main className="card">
                    <div className="card-body">
                        <div className="row">
                            <Suspense fallback={<div>Loading...</div>}>
                                <Brand />
                                <Slider />
                                <New />
                            </Suspense>
                        </div>
                    </div>
                </main>
            </section>
            <div style={{ padding: "0 60px" }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Sale />
                    {product_category.map((item, index) => (
                        <Product_Home item={item} key={index} />
                    ))}
                    <ProductBestSeller />
                    <Suggested_Products />
                    <List_New />
                </Suspense>
            </div>
            {isHomePage && (
                <div className={`chat-icons ${showIcons ? "show" : ""}`} style={{ paddingBottom: 200, minHeight: 200, paddingLeft: 20 }}>
                    <div className="contact-us">
                        <p>Liên hệ chúng tôi</p>
                    </div>
                    <div className="icon facebook-icon">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <img src={mess} style={{ width: 50, height: 50, marginBottom: 10 }} className="animated-image" alt="Messenger" />
                        </a>
                    </div>
                    <div className="icon zalo-icon">
                        <a href="https://zalo.me" target="_blank" rel="noopener noreferrer">
                            <img src={zalo} style={{ width: 50, height: 50, marginBottom: 10 }} className="animated-image" alt="Zalo" />
                        </a>
                    </div>
                    <div className="icon instagram-icon">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <img src={insta} style={{ width: 50, height: 50 }} className="animated-image" alt="Instagram" />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
