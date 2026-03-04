import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate } from "react-router-dom";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { menuconfig } from "./menuconfig";
import "../../styles/SideBar.css";

export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const menus = menuconfig[role];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <div className="logo__icon">🍜</div>
        <div className="logo__text">
          <h3>ToanPro</h3>
          <span>Restaurent Manager</span>
        </div>
      </div>

      <nav className="sidebar__menu">
        <ul>
          {menus.map((item) => (
            <li key={item.label}>
              <NavLink
                to={`/${role}/${item.path}`}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? "menu__item active" : "menu__item"
                }
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <FontAwesomeIcon icon={faRightFromBracket} />
        <span>Logout</span>
      </button>
    </aside>
  );
}