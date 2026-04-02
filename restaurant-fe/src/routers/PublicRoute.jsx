import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const role = decoded.scope;
      
      if (role === 'ADMIN') {
        return <Navigate to="/admin" replace />;
      } else if (role === 'STAFF') {
        return <Navigate to="/staff" replace />;
      }
    } catch (err) {
      localStorage.removeItem("token");
    }
  }

  return children ? children : <Outlet />;
}
