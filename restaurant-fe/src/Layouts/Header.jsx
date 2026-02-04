import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faEnvelope,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import "../styles/Header.css"

export default function Header() {

    const location = useLocation();
    const getTitle = () =>{
        switch (location.pathname){
            case "/":
                return "Dashboard";
            case "/orders":
                return "Orders";
            case "/customers":
                return "Customers";
            case "/delivery":
                return "Delivery";
            case "/reports":
                return "Reports";
            case "/reservations":
                return "Reservations"
            default:
                return "";
        }
    }

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
          placeholder="Search Order ID"
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


