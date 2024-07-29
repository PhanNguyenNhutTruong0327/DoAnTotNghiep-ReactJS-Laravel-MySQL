import React, { useEffect } from 'react';
import img from './img/people.png';
import { FaSearch } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { initializeScript } from './script';

function Content() {
    useEffect(() => {
        initializeScript();
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        window.location.reload();
    }

    return (
        <>
            {/* <!-- CONTENT --> */}
            <section id="content">
                {/* <!-- NAVBAR --> */}
                <nav>
                    {/* <IoMenu /> */}
                    {/* <a href="#" class="nav-link">Categories</a> */}
                    {/* <form action="#">
                        <div class="form-input">
                            <input type="search" placeholder="Search..." />
                            <button type="submit" class="search-btn"><FaSearch />
                            </button>
                        </div>
                    </form>
                    <input type="checkbox" id="switch-mode" hidden />
                    <label for="switch-mode" class="switch-mode" /> */}
                    {/* <a href="#" class="notification">
                        <FaBell />
                        <span class="num">8</span>
                    </a> */}
                    <a href="#" class="profile">
                        <img src={img} />
                    </a>
                    <div className='text-right'>
                        <button class="btn btn text-right" onClick={handleLogout}>Đăng xuất</button>
                    </div>
                </nav>
                {/* <!-- NAVBAR -->

		<!-- MAIN --> */}

            </section>

        </>
    );
}

export default Content;