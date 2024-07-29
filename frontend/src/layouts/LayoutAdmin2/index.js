import React, { useEffect } from 'react';
import Content from "./Content";
import SliderBar from "./SlideBar";
import './style.css';
import { initializeScript } from './script';
import { Outlet } from 'react-router-dom';

function LayoutAdmin2() {
    useEffect(() => {
        initializeScript();
    }, []);

    return (
        <div>
            {/* <div style={{ paddingRight: "250px" }}> */}

            <SliderBar />
            {/* </div> */}

            <Content />
            <div style={{ paddingLeft: "250px" }}>
                <Outlet />
            </div>
        </div>
    );
}

export default LayoutAdmin2;
