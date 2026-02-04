import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Staff/DashBoard";
import Orders from "../pages/Staff/Orders";
import Customer from "../pages/Staff/Customer";
import Delivery from "../pages/Staff/Delivery";
import Reports from "../pages/Staff/Reports";
import Reservation from "../pages/Staff/Reservation/Reservation";
import StaffLayout from "../Layouts/StaffLayout";
import AdminLayout from "../Layouts/AdminLayout";

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
        <Route path="reports" element = {<Reports/>}/>
        <Route path="reservations" element ={<Reservation/>}/>
      </Route>

      <Route path="/admin" element = {<AdminLayout/>}> 

      </Route>
    
    
    </Routes>
  );
}
  
export default AppRouter;
