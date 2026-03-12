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
    amount: null,
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
  const [activities] = useState(mockData);
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterType, setFilterType] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const filterOptions = [
    { value: "all", label: "Tất cả" },
    { value: "order", label: "Order" },
    { value: "reservation", label: "Reservation" },
  ];

  const getTypeLabel = (type) => {
    return type === "order" ? "Order" : "Reservation";
  };

  const getAmountLabel = (item) => {
    if (item.type === "reservation") {
      return "Không có giá";
    }

    return `${item.amount.toLocaleString()} đ`;
  };

  const handleSort = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newOrder);
  };

  const filteredActivities = activities.filter((item) => {
    return filterType === "all" || item.type === filterType;
  });

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    return sortOrder === "desc"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="activities-container">

      <div className="toolbar">
        <div className="filter-group">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={filterType === option.value ? "active" : ""}
              onClick={() => setFilterType(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

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
                {getTypeLabel(item.type)}
              </div>
              <div className="customer">{item.customer}</div>
            </div>

            <div className="right">
              <div className="amount">
                {getAmountLabel(item)}
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
            <h2>Chi tiết hoạt động</h2>
            <p><strong>ID:</strong> {selectedItem.id}</p>
            <p><strong>Loại:</strong> {getTypeLabel(selectedItem.type)}</p>
            <p><strong>Khách hàng:</strong> {selectedItem.customer}</p>
            <p><strong>Số tiền:</strong> {getAmountLabel(selectedItem)}</p>
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
