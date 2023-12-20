import React from "react";
import Header from "../components/Header";



const DefaultLayout = ({ children }) => {
    return (
        <div className='main-container'>

            <Header
                type={"small"}
                background={""}
            />

            {children}


        </div>
    )
}

export default DefaultLayout;