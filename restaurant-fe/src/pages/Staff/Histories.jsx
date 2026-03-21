import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../../styles/Activities.css";
import { getOrders } from "../../service/order";
import { getReservations } from "../../service/reservation";

const formatCurrency = (amount) =>
  `${Number(amount || 0).toLocaleString("vi-VN")} đ`;

const PAGE_SIZE = 10;

export default function Histories() {
  const [activities, setActivities] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const [orderRes, reservationRes] = await Promise.all([
        getOrders(0, 200),
        getReservations(0, 200),
      ]);

      const allOrders = orderRes?.data?.result?.content || [];
      const allReservations = reservationRes?.data?.result?.content || [];

      const doneOrders = allOrders
        .filter((order) => order.status === "DONE")
        .map((order) => ({
          id: order.id,
          type: "order",
          table:
            order.diningTable?.name ||
            order.diningTables?.[0]?.name ||
            "No table",
          amount: order.totalAmount || 0,
          status: order.status,
          date: order.orderDate,
          displayDate: order.orderDate,
        }));

      const checkedInReservations = allReservations
        .filter((reservation) => reservation.status === "CHECKED_IN")
        .map((reservation) => {
          const reservationDate = reservation.reservationDate || "";
          const startTime = reservation.startTime || "00:00:00";
          return {
            id: reservation.id,
            type: "reservation",
            table: "Đã nhận bàn",
            amount: 0,
            status: reservation.status,
            date: `${reservationDate}T${startTime}`,
            displayDate: `${reservationDate} ${String(startTime).slice(0, 5)}`,
            customerId: reservation.customerId,
          };
        });

      const combined = [...doneOrders, ...checkedInReservations];
      setActivities(combined);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử hoạt động:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (totalPages > 0 && page >= totalPages) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  const getTypeLabel = (type) => {
    if (type === "order") return "Order";
    if (type === "reservation") return "Reservation";
    return "Unknown";
  };

  const getAmountLabel = (item) => {
    if (item.type === "reservation") {
      return "--";
    }
    return formatCurrency(item.amount);
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const filteredActivities = useMemo(() => {
    if (typeFilter === "all") {
      return activities;
    }
    return activities.filter((item) => item.type === typeFilter);
  }, [activities, typeFilter]);

  const sortedActivities = useMemo(() => {
    return [...filteredActivities].sort((a, b) => {
      return sortOrder === "desc"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });
  }, [filteredActivities, sortOrder]);

  useEffect(() => {
    setTotalPages(Math.ceil(sortedActivities.length / PAGE_SIZE));
    setPage(0);
  }, [sortedActivities]);

  const paginatedActivities = useMemo(() => {
    const start = page * PAGE_SIZE;
    return sortedActivities.slice(start, start + PAGE_SIZE);
  }, [sortedActivities, page]);

  return (
    <div className="activities-container">
      <div className="toolbar">
        <div className="filter-group">
          <button
            type="button"
            className={typeFilter === "all" ? "active" : ""}
            onClick={() => setTypeFilter("all")}
          >
            Tất cả
          </button>
          <button
            type="button"
            className={typeFilter === "order" ? "active" : ""}
            onClick={() => setTypeFilter("order")}
          >
            Order
          </button>
          <button
            type="button"
            className={typeFilter === "reservation" ? "active" : ""}
            onClick={() => setTypeFilter("reservation")}
          >
            Reservation
          </button>
        </div>

        <button onClick={handleSort}>
          Sắp xếp: {sortOrder === "desc" ? "Mới nhất" : "Cũ nhất"}
        </button>
      </div>

      <div className="activity-list">
        {loading ? (
          <p style={{ padding: "20px", color: "#666" }}>Đang tải lịch sử...</p>
        ) : sortedActivities.length === 0 ? (
          <p style={{ padding: "20px", color: "#666" }}>
            Chưa có dữ liệu lịch sử.
          </p>
        ) : (
          paginatedActivities.map((item) => (
            <div
              key={item.id}
              className="activity-item"
              onClick={() => setSelectedItem(item)}
            >
              <div className="left">
                <div className={`type ${item.type}`}>
                  {getTypeLabel(item.type)}
                </div>
                <div className="customer">Bàn: {item.table}</div>
              </div>

              <div className="right">
                <div className="amount">{getAmountLabel(item)}</div>
                <div className="date">
                  {item.displayDate || new Date(item.date).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          >
            ← Trước
          </button>

          <span style={{ margin: "0 12px" }}>
            Trang {page + 1} / {totalPages}
          </span>

          <button
            className="pagination-button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Sau →
          </button>
        </div>
      )}

      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Chi tiết hoạt động</h2>
            <p><strong>ID:</strong> {selectedItem.id}</p>
            <p><strong>Loại:</strong> {getTypeLabel(selectedItem.type)}</p>
            <p><strong>Bàn:</strong> {selectedItem.table}</p>
            <p><strong>Số tiền:</strong> {getAmountLabel(selectedItem)}</p>
            <p><strong>Trạng thái:</strong> {selectedItem.status}</p>
            {selectedItem.type === "reservation" && (
              <p><strong>Customer ID:</strong> {selectedItem.customerId ?? "--"}</p>
            )}
            <p>
              <strong>Thời gian:</strong>{" "}
              {selectedItem.displayDate || new Date(selectedItem.date).toLocaleString()}
            </p>

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