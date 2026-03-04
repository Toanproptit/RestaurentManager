import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faEnvelope,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import "../../styles/Header.css"

export default function Header() {

    const location = useLocation();
    
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
      if (path === "/staff/" || path === "/admin/") return "Dashboard";

      return "";
  };

  return (
    <header className="header">
      {/* LEFT */}
      <div className="header__title">
        <h1>{getTitle()}</h1>
      </div>

      <div className="header__search">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <input
          type="text"
          placeholder="Search Anything"
        />
      </div>

      {/* Right actions */}
      <div className="header__actions">
        <FontAwesomeIcon icon={faEnvelope} className="header__icon" />
        <FontAwesomeIcon icon={faBell} className="header__icon" />

        <div className="header__profile">
          <img
            src="https://i.pravatar.cc/40"
            alt="User"
          />
        </div>
      </div>
    </header>
  );
};


