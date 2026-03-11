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
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>{Number(item.price).toLocaleString()} VND</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}