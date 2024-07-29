import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [config, setConfig] = useState([]);

  // useEffect(() => {
  //   try{
  //     apiConfig.getConfig().then(res => {
  //       setConfig(res.data);
  //     })  
  //   }catch(e){console.log(e)};
  // }, [])


  return (
    <div className="footer">
      <footer className="section-footer bg-secondary" style={{ backgroundColor: "white", border: "1px grey", paddingLeft: "200px" }} >
        <div className="container">
          <section className="footer-top padding-y-lg text-white">
            <div className="row">
              {Object.keys(config).length !== 0 > 0 ? (
                <aside className="col-md col-6">
                  {/* <h6 className="title">{config.author}</h6> */}
                  <h6 className="title">Tổng đài hỗ trợ</h6>
                  <ul className="list-unstyled">
                    <li>Gọi mua:<text ><strong> 1900 232 460</strong> </text>(7:30 - 22:00)</li>
                    <li>Khiếu nại:<text ><strong> 1800.1062</strong> </text>(8:00 - 21:30)</li>
                    <li>Bảo hành:<text><strong> 1900 232 464</strong> </text>(8:00 - 21:00)</li>
                    {/* <li> <a href="#"><i className="fas fa-phone-alt"></i> {config.phone}</a></li>
                    <li> <a href="#"><i className="fa fa-envelope"></i> {config.email}</a></li>
                    <li> <a href=""><i className="fas fa-map-marker-alt"></i> {config.address}</a></li> */}
                  </ul>
                </aside>

              ) : (<></>)}

              <aside className="col-md col-6">
                <h6 className="title">Chính sách</h6>
                <ul className="list-unstyled">
                  <li> <Link to="/chinh-sach/chinh-sach-bao-hanh">Chính sách bảo hành</Link></li>
                  <li> <Link to="/chinh-sach/ch-nh-s-ch-b-o-m-t">Chính Sách bảo mật</Link></li>
                  <li> <Link to="/chinh-sach/ch-nh-s-ch-b-n-h-ng">Chính sách bán hàng</Link></li>
                  {/* <li> <Link to="/chinh-sach/chinh-sach-doi-tra">Chính sách đổi trả</Link></li> */}
                </ul>
              </aside>
              {/* <aside className="col-md col-6">
                <h6 className="title">Liên hệ</h6>
                <ul className="list-unstyled">
                  <li> <a href="#">Giới thiệu</a></li>
                  <li> <a href="#">Liên hệ 1</a></li>
                  <li> <a href="#">Liên hệ 1</a></li>
                </ul>
              </aside> */}
              {/* <aside className="col-md col-6">
                <h6 className="title">Hỗ trợ khách hàng</h6>
                <ul className="list-unstyled">
                  <li> <a href="#"> User Login </a></li>
                  <li> <a href="#"> User register </a></li>
                  <li> <a href="#"> Account Setting </a></li>
                  <li> <a href="#"> My Orders </a></li>
                </ul>
              </aside> */}
              <aside className="col-md col-6">
                <h6 className="title">Xã hội</h6>
                <ul className="list-unstyled">
                  <li><a href="#"> <i className="fab fa-facebook"></i> Facebook </a></li>
                  <li><Link to={`https://zalo.me/${config.zalo}`}> <i className="fab fa-twitter"></i> Zalo </Link></li>
                  <li><a href="#"> <i className="fab fa-instagram"></i> Instagram </a></li>
                  <li><a href="#"> <i className="fab fa-youtube"></i> Youtube </a></li>
                </ul>
              </aside>
            </div>
          </section>

        </div>
      </footer>
      

    </div>
  );
}

export default Footer;