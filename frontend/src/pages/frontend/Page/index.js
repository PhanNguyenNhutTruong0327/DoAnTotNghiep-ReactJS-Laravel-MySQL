import apiPost from '../../../api/apiPost';
import { useEffect, useState } from 'react';
import { imageURL } from '../../../api/config';
import { Link, useParams } from 'react-router-dom';
import apiTopic from '../../../api/apiTopic';
import Topic_Item from '../../../component/frontend/Topic_Item';
import apiPage from '../../../api/apiPage';


function Page() {

    const { slug } = useParams();

    const [data, setData] = useState([]);

    useEffect(() => {
        apiPage.getPageBySlug(slug).then((res) => {
            try {

                setData(res.data);
            }
            catch (e) {
                console.log(e);
            }
        })


    }, [slug])

    return (
        <section className="padding-bottom container">
            <div className="row" style={{ display: "flex" }}>
                <div className='col-md-2'></div>
                <div className="col-md-8 col-sm-6 mt-4">
                    <div>
                        <div className='title'>
                            <h5 style={{ fontWeight: 'bold' }}>{data.title}</h5>
                        </div>
                        <br />
                        <div className=''>
                            <img style={{ width: "100%" }} src={imageURL + data.image_1} alt='anh' />
                        </div>
                        <br />
                        <div className='ms-5 me-5'>
                            <p>{data.description_1}</p>
                        </div>
                        <br />
                        <div className=''>
                            {data.image_2 && (
                                <img style={{ width: "100%" }} src={imageURL + data.image_2} alt='anh' />

                            )}
                        </div>
                        <br />
                        <div className='ms-5 me-5'>
                            <p>{data.description_2}</p>
                        </div>
                        <br />
                        <div className=''>
                            {data.image_3 && (
                                <img style={{ width: "100%" }} src={imageURL + data.image_3} alt='anh' />

                            )}
                        </div>
                        <br />
                        <div className='ms-5 me-5'>
                            <p>{data.description_3}</p>
                        </div>

                    </div>
                    <br />
                    <br />

                </div>
                <div className='col-md-2'></div>

            </div>

        </section>
    );
}
export default Page;