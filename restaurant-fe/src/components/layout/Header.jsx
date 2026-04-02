import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faEnvelope,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMe } from "../../service/user";
import "../../styles/Header.css"

export default function Header() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        if (response.data && response.data.result) {
          setUser(response.data.result);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  const getTitle = () => {
    const path = location.pathname;

    if (path.includes("/orders")) return "Orders";
    if (path.includes("/customers")) return "Customers";
    if (path.includes("/delivery")) return "Delivery";
    if (path.includes("/reports")) return "Reports";
    if (path.includes("/reservations")) return "Reservations";
    if (path.includes("/histories")) return "Histories";
    if (path.includes("/staffs")) return "Staffs";
    if (path.includes("foods")) return "Foods";
    if (path.includes("menu")) return "Menu";
    if (path.includes("tables")) return "Tables";
    if (path === "/staff/" || path === "/admin/") return "Dashboard";

    return "";
  };

  return (
    <header className="header">
      {/* LEFT */}
      <div className="header__title">
        <h1>{getTitle()}</h1>
      </div>



      {/* Right actions */}
      <div className="header__actions">
        <FontAwesomeIcon icon={faEnvelope} className="header__icon" />
        <FontAwesomeIcon icon={faBell} className="header__icon" />

        <div className="header__profile" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <img
            src={user ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random` : "https://ui-avatars.com/api/?name=U&background=random"}
            alt="User"
          />
          {isDropdownOpen && user && (
            <div className="header__dropdown-card">
              <div className="header__dropdown-info">
                <span className="header__dropdown-name">{user.name}</span>
                <span className="header__dropdown-email">{user.email}</span>
                <span className="header__dropdown-role">{user.role}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


