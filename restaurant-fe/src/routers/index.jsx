import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Staff/DashBoard";
import Orders from "../pages/Staff/orders/Orders";
import Customer from "../pages/Staff/Customer";
import Delivery from "../pages/Staff/Delivery";
import Reports from "../pages/Admin/Reports";
import ReservationPage from "../pages/ReservationPage";
import ReservationCreatePage from "../pages/ReservationCreatePage";
import ReservationDetailPage from "../pages/ReservationDetailPage";
import StaffLayout from "../Layouts/StaffLayout";
import AdminLayout from "../Layouts/AdminLayout";
import Activity from "../pages/Staff/Histories";
import Staff from "../pages/Admin/Staffs";
import StaffDetail from "../pages/Admin/StaffDetail";
import MenuManagement from "../pages/Admin/MenuManagement";
import TableManagement from "../pages/Admin/TableManagement";
import Menu from "../pages/Staff/Menu";

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


       <Route path="/staff" element={<StaffLayout/>}>
        <Route index element={<Dashboard/>} />
        <Route path="customers" element ={<Customer/>}/>
        <Route path="orders" element={<Orders />} />
        <Route path="delivery" element = {<Delivery/>}/>
        <Route path="reservations" element ={<ReservationPage/>}/>
        <Route path="reservations/create" element ={<ReservationCreatePage/>}/>
        <Route path="reservations/:reservationId/details" element ={<ReservationDetailPage/>}/>
        <Route path="histories" element={<Activity/>} />
        <Route path="menu" element = {<Menu/>}/>
      </Route>

      <Route path="/admin" element = {<AdminLayout/>}> 
        <Route index element={<Dashboard/>} />
        <Route path="customers" element ={<Customer/>}/>
        <Route path="orders" element={<Orders />} />
        <Route path="delivery" element = {<Delivery/>}/>
        <Route path="reports" element = {<Reports/>}/>
        <Route path="reservations" element ={<ReservationPage/>}/>
        <Route path="reservations/create" element ={<ReservationCreatePage/>}/>
        <Route path="reservations/:reservationId/details" element ={<ReservationDetailPage/>}/>
        <Route path="histories" element={<Activity/>} />
        <Route path="staffs" element={<Staff />} />
        <Route path="menu" element = {<MenuManagement/>}/>
        <Route path="tables" element={<TableManagement />} />
        <Route path="staffs/:staffId" element={<StaffDetail/>}/>
      </Route>
    
    
    </Routes>
  );
}
  
export default AppRouter;
