import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCheckCircle,
  faIndianRupeeSign,
  faXmarkCircle,
  faLocationDot,
  faPhone,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

import "../../styles/DashBoard.css"

export default function Dashboard() {
  return (
    <div className="content dashboard">
      {/* ===== STATS ===== */}
      <div className="stats">
        <div className="stat-card">
          <FontAwesomeIcon icon={faBox} />
          <div>
            <p>Total Orders</p>
            <h3>1750</h3>
          </div>
        </div>

        <div className="stat-card">
          <FontAwesomeIcon icon={faCheckCircle} />
          <div>
            <p>Total Reservations</p>
            <h3>567</h3>
          </div>
        </div>

        <div className="stat-card">
          <FontAwesomeIcon icon={faIndianRupeeSign} />
          <div>
            <p>Total Revenue</p>
            <h3>₹1,29,750</h3>
          </div>
        </div>

        <div className="stat-card">
          <FontAwesomeIcon icon={faXmarkCircle} />
          <div>
            <p>Total Canceled</p>
            <h3>125</h3>
          </div>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div className="dashboard-body">
        {/* ===== LEFT: ALL ORDERS ===== */}
        <div className="orders-list">
          <div className="orders-header">
            <h3>All Orders</h3>
            <button className="filter-btn">
              <FontAwesomeIcon icon={faFilter} /> Filters
            </button>
          </div>

          <div className="order-card active">
            <div className="order-top">
              <strong>Order ID #12334</strong>
              <span className="delay">Delay by 20mins</span>
            </div>

            <h4>Preshit Pimple</h4>
            <span className="time">10:30AM | Today</span>

            <select>
              <option>1 x Chole Kulche</option>
            </select>

            <div className="order-footer">
              <span>
                <FontAwesomeIcon icon={faLocationDot} /> Sector 6 Ghansoli Navi Mumbai
              </span>
              <FontAwesomeIcon icon={faPhone} />
            </div>
          </div>
        </div>

        {/* ===== RIGHT ===== */}
        <div className="order-detail">
          <h4>Order ID #12334</h4>
          <h2>Preshit Pimple</h2>
          <span className="time">10:30AM | Today</span>

          {/* Details */}
          <div className="detail-box">
            <h3>Order Details</h3>
            <ul>
              <li>Order Accepted</li>
              <li>Food Preparing Done</li>
              <li>Out for delivery</li>
            </ul>
          </div>

          {/* Tracking */}
          <div className="detail-box">
            <h3>Order Tracking</h3>
            <div className="map-placeholder">
              Map Here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
