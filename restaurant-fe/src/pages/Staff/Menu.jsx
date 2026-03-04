import React from "react";
import { mockMenus } from "../../auth/MockMenu";
import "../../styles/StaffManagement.css";

export default function StaffMenuView() {
  return (
    <div className="staff-container">
      <h2>Menu List</h2>

      <div className="staff-list">
        {mockMenus.map((item) => (
          <div key={item.id} className="staff-card">
            <div>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  width="80"
                  style={{ borderRadius: "8px", marginBottom: "10px" }}
                />
              )}

              <h3>{item.name}</h3>
              <p>{Number(item.price).toLocaleString()} VND</p>
              <p>{item.category}</p>

              <span
                className={`status ${
                  item.status === "Available" ? "active" : "inactive"
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}