import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/SideBar";
import "../styles/StaffHome.css"
import Header from "../components/layout/Header";
export default function StaffLayout(){
    return(
        <>
            <div className="app">
                <Sidebar role="staff"/>
                <div className="app-main">
                    <Header/>
                    <Outlet/>
                </div>
            </div>
        </>
    )
}