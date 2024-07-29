import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Topic_Item from '../../../component/frontend/Topic_Item';
import { format } from 'date-fns';
import topicService from '../../../services/TopicService';
import postServices from '../../../services/PostService';
import { urlImage } from '../../../config';


function News() {


    const [data, setData] = useState([]);
    const [topics, setTopics] = useState([]);
    const [data_post_pro_new, setDataPostProNew] = useState([]);
    const [data_post_sale, setDataPostSale] = useState([]);


    const [data_item, setDataItem] = useState({});
    const [data_item1, setDataItem1] = useState({});
    const [titles, setTitles] = useState([]);

    const page = parseInt(useParams().page);
    const limit = parseInt(useParams().limit);

    const [pages, setPages] = useState(1);


    // useEffect(() => {
    //     (async () => {
    //         await topicService.getListTopic().then(res => {
    //             try {
    //                 setTopics(res.data.topics);
    //             } catch (e) { console.log(e) }
    //         })

    //         await postServices.getPostBySlugTopic('tin-khuyen-mai', 6, 1).then(res => {
    //             try {
    //                 setDataPostSale(res.data.posts);
    //             } catch (e) { console.log(e) }
    //         })

    //         await postServices.getPostBySlugTopic('san-pham-moi', 6, 1).then(res => {
    //             try {
    //                 setDataPostProNew(res.data.posts);
    //             } catch (e) { console.log(e) }
    //         })

    //         await postServices.getListPostNew(2, 1).then(res => {
    //             try {
    //                 setDataItem(res.data.posts[0]);
    //                 setDataItem1(res.data.posts[1]);
    //                 postServices.getPostDetailAndPostOther(res.data.posts[1].slug, 3).then(res => {
    //                     setTitles(res.data.post_other)
    //                 })
    //             } catch (e) { console.log(e) }
    //         })


    //     })()
    // }, [])

    useEffect(() => {
        (async () => {
          try {
            const [topicRes, postSaleRes, postProNewRes, postNewRes] = await Promise.all([
              topicService.getListTopic(),
              postServices.getPostBySlugTopic('tin-khuyen-mai', 6, 1),
              postServices.getPostBySlugTopic('san-pham-moi', 6, 1),
              postServices.getListPostNew(2, 1),
            ]);
      
            setTopics(topicRes.data.topics);
            setDataPostSale(postSaleRes.data.posts);
            setDataPostProNew(postProNewRes.data.posts);
            setDataItem(postNewRes.data.posts[0]);
            setDataItem1(postNewRes.data.posts[1]);
      
            const postDetailRes = await postServices.getPostDetailAndPostOther(postNewRes.data.posts[1].slug, 3);
            setTitles(postDetailRes.data.post_other);
          } catch (e) {
            console.log(e);
          }
        })();
      }, []);

    useEffect(() => {
        (async () => {
            await postServices.getAllPost(limit, page).then(res => {
                try {
                    setData(res.data.posts);
                    setPages(res.data.end_page);
                } catch (e) { console.log(e) }
            })
        })()
    }, [page])

    // const [data, setData] = useState([]);
    // const [topics, setTopics] = useState([]);
    // const [data_post_pro_new, setDataPostProNew] = useState([]);
    // const [data_post_sale, setDataPostSale] = useState([]);
    // const [data_item, setDataItem] = useState({});
    // const [data_item1, setDataItem1] = useState({});
    // const [titles, setTitles] = useState([]);
    // const [pages, setPages] = useState(1);
  
    // const { page, limit } = useParams();
  
    // const fetchData = useCallback(async () => {
    //   const [topicsData, saleData, newProductData, postsData] = await Promise.all([
    //     topicService.getListTopic(),
    //     postServices.getPostBySlugTopic('tin-khuyen-mai', 6, 1),
    //     postServices.getPostBySlugTopic('san-pham-moi', 6, 1),
    //     postServices.getListPostNew(2, 1),
    //   ]);
  
    //   setTopics(topicsData.data.topics);
    //   setDataPostSale(saleData.data.posts);
    //   setDataPostProNew(newProductData.data.posts);
    //   setDataItem(postsData.data.posts[0]);
    //   setDataItem1(postsData.data.posts[1]);
  
    //   const postDetail = await postServices.getPostDetailAndPostOther(
    //     postsData.data.posts[1].slug,
    //     3
    //   );
    //   setTitles(postDetail.data.post_other);
    // }, []);
  
    // useEffect(() => {
    //   fetchData();
    // }, [fetchData]);
  
    // useEffect(() => {
    //   const fetchPosts = async () => {
    //     const res = await postServices.getAllPost(limit, page);
    //     setData(res.data.posts);
    //     setPages(res.data.end_page);
    //   };
    //   fetchPosts();
    // }, [page, limit]);

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
            <div className="row">
                <div className="col-md-9 col-sm-6 row" >
                    {Object.keys(data_item).length > 0 ? (
                        <div className='col-md-8 col-sm-12'>
                            <Link to={`/tin-tuc/${data_item.slug}`}>
                                <article className="card card-post" >
                                    <img src={urlImage + 'post/' + data_item.image_1} className="img-fluid img-rounded" alt='img' />
                                    <div className="card-body">
                                        <h5 className="title">{data_item.title}</h5>
                                        <p className="fs-6 text-muted" style={{ margin: "0", display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{data_item.description_1}</p>
                                        {/* <span className='text-muted'>{editDate(data_item.created_at)}</span> */}
                                    </div>
                                </article>

                            </Link>

                        </div>

                    ) : (<></>)}
                    {Object.keys(data_item1).length > 0 ? (
                        <div className='col-md-4 col-sm-12'>
                            <article className="card card-post" >
                                <Link to={`/tin-tuc/${data_item1.slug}`}>
                                <img src={urlImage + 'post/' + data_item1.image_1} className="card-img-top" alt='img' style={{ width: "100%", height: "auto" }}/>
                                <div className="card-body border-bottom">
                                    <h6 className="title" style={{ margin: "0", display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{data_item1.title}</h6>
                                    <p className="small text-uppercase text-muted"></p>
                                </div>
                                </Link>
                                {titles.length > 0 ? (
                                    titles.map((item, index) => (
                                        <div className="card-body border-bottom" key={index}>
                                            <Link to={`/tin-tuc/${item.slug}`}>
                                                <h6 className="title" style={{ margin: "0", display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h6>
                                                <p className="small text-uppercase text-muted"></p>

                                            </Link>
                                        </div>

                                    ))
                                ) : (<></>)}
                            </article>
                        </div>

                    ) : (<></>)}

                    <div className="col-md col-sm-6 mt-2" >
                        {data.length > 0 && (
                            <div className='col-md' style={{padding: 0}}>
                                {data.map((item, index) => (
                                    <Link to={`/tin-tuc/${item.slug}`} style={{padding: 0}}>

                                        <div className="col-md d-none1 d-lg-block flex-grow-1" key={index}>
                                            <aside className="special-home-right" style={{ flex: 1 }}>
                                                <div className="bg-white border-bottom row">
                                                    <div className="col-md-3 col-sm-4 py-2 pl-2">
                                                        <img src={urlImage + 'post/' + item.image_1} height="130px" className="fixed-size-image img-bg ml img-rounded " alt='img' />
                                                    </div>
                                                    <div className="col-md-9 col-sm-6">
                                                        <h6 className="boid-text py-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h6>
                                                        <p className="text-muted" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description_1}</p>
                                                    </div>
                                                </div>
                                            </aside>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                        )}
                        <br />
                        <ul className="pagination">
                            <li className="page-item">
                                {page > 1 ? (
                                    <Link className="page-link" color='#ff6a00' to={`/tin-tuc/${limit}/${page - 1}`}>Trước</Link>
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
                                        to={`/tin-tuc/${limit}/${index + 1}`}
                                    >
                                        {index + 1}
                                    </Link>
                                </li>
                            ))}
                            <li className="page-item">
                                <Link className="page-link" style={{ color: "#ff6a00" }} to={`/tin-tuc/${limit}/${page + 1}`}>
                                    Tiếp
                                </Link>
                            </li>
                        </ul>

                    </div>

                </div>


                <div className="col-md-3 col-sm-6">
                    {data_post_pro_new.length > 0 && (
                        <div className='col-md'>
                            <h6>Bài viết về sản phẩm mới</h6>
                            {data_post_pro_new.map((item, index) => (
                                <Link to={`/tin-tuc/${item.slug}`}>

                                    <div className="col-md d-none1 d-lg-block flex-grow-1" key={index}>
                                        <aside className="special-home-right" style={{ flex: 1 }}>
                                            <div className="bg-white border-bottom row">
                                                <div className="col-5 py-2 pl-2">
                                                    <img src={urlImage + 'post/' + item.image_1} height="80" width={"100%"} className="fixed-size-image img-bg ml img-rounded " alt='img' />
                                                </div>
                                                <div className="col-6 ml-2">
                                                    <p className="text-muted pb-1" style={{ margin: "0", display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</p>
                                                </div>
                                            </div>
                                        </aside>
                                    </div>
                                </Link>
                            ))}
                        </div>

                    )}
                    <br />
                    {data_post_sale.length > 0 && (
                        <div className='col-md'>
                            <h6>Khuyến mãi</h6>
                            {data_post_sale.map((item, index) => (
                                <Link to={`/tin-tuc/${item.slug}`}>

                                    <div className="col-md d-none1 d-lg-block flex-grow-1" key={index}>
                                        <aside className="special-home-right" style={{ flex: 1 }}>
                                            <div className="bg-white border-bottom row">
                                                <div className="py-2 col-5">
                                                    <img src={urlImage + 'post/' + item.image_1} height="80" width={"100%"} className="img-bg img-rounded" alt='img' />
                                                </div>
                                                <div className=" col-6 ml-2">
                                                    <p className="text-muted pb-1" style={{ margin: "0", display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</p>
                                                </div>
                                            </div>
                                        </aside>
                                    </div>
                                </Link>
                            ))}
                        </div>

                    )}

                </div>

            </div>

        </section>
    );
}
export default News;