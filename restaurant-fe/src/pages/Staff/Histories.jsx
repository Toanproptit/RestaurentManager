import React, { useState } from "react";
import "../../styles/Activities.css";

const mockData = [
  {
    id: "ORD-001",
    type: "order",
    customer: "Nguyễn Văn A",
    amount: 250000,
    status: "Completed",
    date: "2026-02-15T10:30:00"
  },
  {
    id: "DEL-002",
    type: "reservation",
    customer: "Trần Thị B",
    amount: 180000,
    status: "Pending",
    date: "2026-02-15T09:15:00"
  },
  {
    id: "ORD-003",
    type: "order",
    customer: "Lê Văn C",
    amount: 320000,
    status: "Cancelled",
    date: "2026-02-14T18:45:00"
  },
];

export default function Histories() {
  const [activities, setActivities] = useState(mockData);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSort = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);
  };

  const sortedActivities = [...activities].sort((a, b) => {
    return sortOrder === "desc"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="activities-container">

      <div className="toolbar">
        <button onClick={handleSort}>
          Sắp xếp: {sortOrder === "desc" ? "Mới nhất" : "Cũ nhất"}
        </button>
      </div>

      <div className="activity-list">
        {sortedActivities.map((item) => (
          <div
            key={item.id}
            className="activity-item"
            onClick={() => setSelectedItem(item)}
          >
            <div className="left">
              <div className={`type ${item.type}`}>
                {item.type === "order" ? " Order" : " Reservation"}
              </div>
              <div className="customer">{item.customer}</div>
            </div>

            <div className="right">
              <div className="amount">
                {item.amount.toLocaleString()} đ
              </div>
              <div className="date">
                {new Date(item.date).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Chi tiết đơn</h2>
            <p><strong>ID:</strong> {selectedItem.id}</p>
            <p><strong>Loại:</strong> {selectedItem.type}</p>
            <p><strong>Khách hàng:</strong> {selectedItem.customer}</p>
            <p><strong>Số tiền:</strong> {selectedItem.amount.toLocaleString()} đ</p>
            <p><strong>Trạng thái:</strong> {selectedItem.status}</p>
            <p><strong>Thời gian:</strong> {new Date(selectedItem.date).toLocaleString()}</p>

            <button
              className="close-btn"
              onClick={() => setSelectedItem(null)}
            >
              Đóng
            </button>
          </div>
        </div>  
      )}
    </div>
  );
}
