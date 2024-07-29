import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Topic_Item from '../../../component/frontend/Topic_Item';
import topicService from '../../../services/TopicService';
import postServices from '../../../services/PostService';
import { urlImage } from '../../../config';


function NewsDetail() {

    const { slug } = useParams();

    const [topics, setTopics] = useState([]);
    const [data, setData] = useState([]);
    const [data_other, setDataOther] = useState([]);

    useEffect(() => {
        (async () => {
            await topicService.getListTopic().then(res => {
                try {
                    setTopics(res.data.topics);
                } catch (e) { console.log(e) }
            })

            await postServices.getPostDetailAndPostOther(slug, 6).then(res => {
                try {
                    setData(res.data.post);
                    setDataOther(res.data.post_other);
                } catch (e) { console.log(e) }
            })
        })()
    }, [slug])

    return (
        <section className="padding-bottom container">
            <div className='m-3'>
                <nav className="navbar1 navbar-main navbar-expand-lg border-bottom">
                    <div className="">

                        {topics.length > 0 && (
                            <div className="collapse navbar-collapse justify-content-center" id="main_nav">
                                <ul className="navbar-nav text-center">
                                    <li className="nav-item">
                                        <Link className="nav-link" to={`/tin-tuc/5/1`}>Tất cả</Link>
                                    </li>
                                    {topics.map((menu, index) => {
                                        return (
                                            console.log(menu),

                                            <Topic_Item menu={menu} key={index} />
                                        )
                                    })}


                                </ul>


                            </div>

                        )}
                    </div>
                </nav>


            </div>
            <div className="row" style={{ display: "flex" }}>
                <div className='col-md-3'></div>
                <div className="col-md-6 col-sm-6 mt-4">
                    <div>
                        <div className='title'>
                            <h5 style={{ fontWeight: 'bold' }}>{data.title}</h5>
                        </div>
                        <br />
                        <div className=''>
                            <img style={{ width: "100%" }} src={urlImage + 'post/' + data.image_1} alt='anh' />
                        </div>
                        <br />
                        <div className='ms-5 me-5'>
                            <p>{data.description_1}</p>
                        </div>
                        <br />
                        <div className=''>
                            {data.image_2 && (
                                <img style={{ width: "100%" }} src={urlImage + 'post/' + data.image_2} alt='anh' />

                            )}
                        </div>
                        <br />
                        <div className='ms-5 me-5'>
                            <p>{data.description_2}</p>
                        </div>
                        <br />
                        <div className=''>
                            {data.image_3 && (
                                <img style={{ width: "100%" }} src={urlImage + 'post/' + data.image_3} alt='anh' />

                            )}
                        </div>
                        <br />
                        <div className='ms-5 me-5'>
                            <p>{data.description_3}</p>
                        </div>

                    </div>
                    <br />
                    <br />
                    <div>
                        {data_other.length > 0 && (
                            <div className='padding-bottom-sm'>
                                <header className="section-heading heading-line col-md">
                                    <h4 className="title-section">Bài viết liên quan</h4>
                                </header>
                                <div className='row'>
                                    {data_other.map((item, index) => (
                                        <div className="col-md-4 d-none1 d-lg-block flex-grow-1" key={index} style={{ display: "flex" }} >
                                            <div style={{ flexGrow: 1 }}>
                                                <Link to={`/tin-tuc/${item.slug}`} >
                                                    <aside className="special-home-right">
                                                        <div className="bg-white border-bottom">
                                                            <div className="col py-2 pl-2">
                                                                <img src={urlImage + 'post/' + item.image_1} height="80" width={"100%"} className="fixed-size-image img-bg ml img-rounded " alt='img' />
                                                            </div>
                                                            <div className="col ml-2">
                                                                <p className="text-muted pb-1" style={{ margin: "0", display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</p>
                                                            </div>
                                                        </div>
                                                    </aside>
                                                </Link>
                                            </div>

                                        </div>
                                    ))}

                                </div>


                            </div>
                        )}

                    </div>


                </div>
                <div className='col-md-3'></div>

            </div>

        </section>
    );
}
export default NewsDetail;