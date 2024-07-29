import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { urlImage } from '../../../config';
import postServices from '../../../services/PostService';


function List_New() {


    const [data, setData] = useState([]);
    const [data_item, setDataItem] = useState({});


    useEffect(()=>{
        try{
            (async ()=>{
                await postServices.getListPostNew(9,1).then(res => {
                    setData(res.data.posts);
                    setDataItem(res.data.posts[3]);
                })
            })()
        }catch(e){console.log(e)}
    },[])

    return (
        <section className="padding-bottom">
            <div className='row'>
                <header className="section-heading heading-line col-md-11">
                    <h4 className="title-section text-uppercase">TIN TỨC NỔI BẬT</h4>
                </header>
                <Link to="/tin-tuc/5/1" className="section-heading col-md-1 title-section text-success">Xem Thêm</Link>

            </div>
            <div className="row" style={{ display: "flex" }}>
                <div className="col-md-8 col-sm-6">
                    <Link to={`tin-tuc/${data_item.slug}`}>
                        <article className="card card-post" style={{ flex: 1, height: "480px" }}>
                            <img src={urlImage +'post/' + data_item.image_1} className="img-fluid" style={{height:"80%"}} alt='img' />
                            <div className="card-body">
                                <h6 className="title" style={{color:"#ff6a00"}}>{data_item.title}</h6>
                                <p className="text-muted" style={{ margin: "0", display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{data_item.short_description}</p>
                            </div>
                        </article>
                    </Link>

                </div>



                <div className="col-md-4 col-sm-6">
                    <div className="col-md d-none1 d-lg-block flex-grow-1">
                        <aside className="special-home-right" style={{ flex: 1 }}>
                            {data.slice(4).map((item, index) => {
                                return (
                                    <Link to={`tin-tuc/${item.slug}`} key={index}>
                                        <div className="bg-white border-bottom d-flex">
                                            <div className="py-2 " style={{ width: "45%" }}>
                                                <img src={urlImage +'post/' + item.image_1} height="80" className="img-bg ml-3 img-rounded " alt='img' />
                                            </div>
                                            <div className="ml-2 pe-1">
                                                <b className="text-muted pb-1" style={{ margin: "0", display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</b>
                                            </div>
                                        </div>

                                    </Link>

                                );
                            })}

                        </aside>
                    </div>

                </div>

            </div>

        </section>
    );
}
export default List_New;