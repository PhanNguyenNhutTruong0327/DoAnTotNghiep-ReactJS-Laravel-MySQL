import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { urlImage } from "../../../config";
import postServices from "../../../services/PostService";

function New() {

    const [data, setData] = useState([]);

    useEffect(() => {
        try {
            (async () => {
                await postServices.getListPostNew(3,1).then(res => {
                    setData(res.data.posts);
                })
            })()
        } catch (e) { console.log(e) }
    }, [])


    return (
        <div className="col-md d-none d-lg-block flex-grow-1">
            <aside className="special-home-right">
                <h6 className="bg-blue text-center text-white mb-0 p-2"><Link to={`/tin-tuc/5/1`} className="text-white">24h Công Nghệ</Link></h6>
                {data.map((item, index) => {
                    return (
                        <Link to={`/tin-tuc/${item.slug}`}>
                            <div key={index} className="bg-white border-bottom d-flex pt-2" style={{ height: "113px" }}>
                                <div className="py-2 align-items-center" style={{ width: "50%" }}>
                                    <img src={urlImage +'post/'+ item.image_1} height="70" width="80" className="img-bg ml-3 " />
                                </div>
                                <div className="ml-2">
                                    <p className="text-muted pb-1" style={{ margin: "0", display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</p>
                                    <Link to={`/tin-tuc/${item.slug}`} className="btn btn-secondary btn-sm mb-1">Xem thêm</Link>
                                </div>
                            </div>
                        </Link>
                    );
                })}



            </aside>
        </div>

    );
}
export default New;