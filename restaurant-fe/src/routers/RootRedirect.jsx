import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function RootRedirect() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded.scope;
    
    if (role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    } else if (role === 'STAFF') {
      return <Navigate to="/staff" replace />;
    }
    
    return <Navigate to="/login" replace />;
  } catch (err) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}
