import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faTruck,
  faBagShopping,
  faChartColumn,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, replace, useNavigate } from "react-router-dom";
import "../styles/SideBar.css"

export default function Sidebar() {

  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/login" , {replace : true})
  }


  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="logo__icon">🍜</div>
        <div className="logo__text">
          <h3>ToanPro</h3>
          <span>Chinese Store</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="sidebar__menu">
        <ul>
          <li>
            <NavLink
              to="/staff"
              end
              className={({ isActive }) =>
                isActive ? "menu__item active" : "menu__item"
              }
            >
              <FontAwesomeIcon icon={faHouse} />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <NavLink
            to="/staff/reservations"
            className={({ isActive }) =>
              isActive ? "menu__item active" : "menu__item"
            }
          >
            <FontAwesomeIcon icon={faBagShopping} />
            <span>Reservations</span>
          </NavLink>

          <li>
            <NavLink
              to="/staff/customers"
              className={({ isActive }) =>
                isActive ? "menu__item active" : "menu__item"
              }
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Customer</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/staff/delivery"
              className={({ isActive }) =>
                isActive ? "menu__item active" : "menu__item"
              }
            >
              <FontAwesomeIcon icon={faTruck} />
              <span>Delivery</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/staff/orders"
              className={({ isActive }) =>
                isActive ? "menu__item active" : "menu__item"
              }
            >
              <FontAwesomeIcon icon={faBagShopping} />
              <span>Orders</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/staff/reports"
              className={({ isActive }) =>
                isActive ? "menu__item active" : "menu__item"
              }
            >
              <FontAwesomeIcon icon={faChartColumn} />
              <span>Reports</span>
            </NavLink>
          </li>


        </ul>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          <span>Logout</span>
      </button>


    </aside>
  );
}
