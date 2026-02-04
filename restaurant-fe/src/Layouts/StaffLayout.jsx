import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";
import "../styles/StaffHome.css"
export default function StaffLayout(){
    return(
        <>
            <div className="app">
                <Sidebar/>
                <div className="app-main">
                    <Header/>
                    <Outlet/>
                </div>
            </div>
        </>
    )
}