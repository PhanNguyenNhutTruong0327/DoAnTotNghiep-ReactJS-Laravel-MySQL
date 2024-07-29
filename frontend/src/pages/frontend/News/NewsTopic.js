import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Topic_Item from '../../../component/frontend/Topic_Item';
import topicService from '../../../services/TopicService';
import postServices from '../../../services/PostService';
import { urlImage } from '../../../config';



function NewsTopic() {

    const { slug } = useParams('slug');
    const { limit } = useParams('limit');
    const { page } = useParams('page');

    const [topics, setTopics] = useState([]);
    const [nametopic, setNameTopic] = useState('');
    const [posts, setPosts] = useState([]);

    const [pages, setPages] = useState(1);


    useEffect(() => {
        (async () => {
            await topicService.getListTopic().then(res => {
                try {
                    setTopics(res.data.topics);
                } catch (e) { console.log(e) }
            })

            await postServices.getPostBySlugTopic(slug, limit, page).then(res => {
                try {
                    setPosts(res.data.posts);
                    setNameTopic(res.data.topic.name);
                    setPages(res.data.qty_page);
                } catch (e) { console.log(e) }
            })
        })()
    }, [slug, page])

    return (
        <section className="padding-bottom container">
            <div className='m-3'>
                <nav className="navbar1 navbar-main navbar-expand-lg border-bottom">
                    <div className="">
                        {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#main_nav" aria-controls="main_nav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button> */}

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
                <div className="col-md-6 col-sm-6">
                    {posts.length > 0 ? (
                        <div className='col-md'>
                            <br />

                            <h6>Bài viết về {nametopic}</h6>
                            {posts.map((item, index) => (
                                <Link to={`/tin-tuc/${item.slug}`}>
                                    <div className="col-md d-none1 d-lg-block flex-grow-1" key={index}>
                                        <aside className="special-home-right" style={{ flex: 1 }}>
                                            <div className="bg-white border-bottom row">
                                                <div className="col-4 py-2 pl-2">
                                                    <img src={urlImage + 'post/' + item.image_1} height="80" width={"100%"} className="fixed-size-image img-bg ml img-rounded " alt='img' />
                                                </div>
                                                <div className="col-7 ml-2">
                                                    <p className="text-muted pb-1" style={{ fontWeight: "bold", margin: "0", display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</p>
                                                    <p className="text-muted pb-1" style={{ margin: "0", display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.short_description}</p>
                                                </div>
                                            </div>
                                        </aside>
                                    </div>
                                </Link>
                            ))}

                            <br />
                            <ul className="pagination">
                                <li className="page-item">
                                    {page > 1 ? (
                                        <Link className="page-link" color='#ff6a00' to={`/tin-tuc/${slug}/${limit}/${page - 1}`}>Trước</Link>
                                    ) : (
                                        <span className="page-link disabled">Trước</span>
                                    )}
                                </li>
                                {Array.from(Array(pages).keys()).map((index) => (
                                    <li
                                        key={index}
                                        className={`page-item ${index + 1 === page ? "active" : ""}`}
                                    >
                                        <Link
                                            className="page-link "
                                            to={`/tin-tuc/${slug}/${limit}/${index + 1}`}
                                        >
                                            {index + 1}
                                        </Link>
                                    </li>
                                ))}
                                <li className="page-item">
                                    {page < pages ? (
                                        <Link className="page-link" to={`/tin-tuc/${slug}/${limit}/${Number(page) + 1}`}>
                                            Next
                                        </Link>
                                    ) : (
                                        <span className="page-link disabled">Next</span>
                                    )}

                                </li>
                            </ul>

                        </div>
                    ) : (
                        <div className='col-md text-center d-flex flex-column justify-content-center align-items-center' style={{ height: "300px" }}>
                            <h6 className=''>Tạm thời chưa có bài viết về chủ đề này !</h6>
                            <br />
                            <div className='text-center '>
                                <Link className="btn btn-success" to="/tin-tuc/1/12">Quay lại trang tin tức</Link>
                            </div>
                        </div>
                    )}


                </div>

            </div>

        </section>
    );
}
export default NewsTopic;