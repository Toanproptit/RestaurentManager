import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/SideBar";
import "../styles/StaffHome.css";


export default function AdminLayout(){
    return (
        <>
            <div className="app">
                <Sidebar role="admin"/>
                <div className="app-main">
                    <Header/>
                    <div className="content">
                        <Outlet/>
                    </div>
                </div>
            </div>
        </>
    )
}   