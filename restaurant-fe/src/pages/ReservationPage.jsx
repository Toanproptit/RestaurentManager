import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getReservations, updateReservation } from "../service/reservation";
import { getReservationDetails } from "../service/reservationDetail";
import { normalizeTime } from "../utils/reservation";
import "../styles/Reservation.css";

export default function ReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [reservationIdsWithTables, setReservationIdsWithTables] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const basePath = location.pathname.startsWith("/admin/")
    ? "/admin/reservations"
    : "/staff/reservations";

  const loadReservations = useCallback(async () => {
    setLoading(true);
    try {
      const [reservationRes, detailRes] = await Promise.all([
        getReservations(0, 200),
        getReservationDetails(),
      ]);

      const reservationData = reservationRes?.data?.result?.content || [];
      const details = detailRes?.data?.result || [];

      setReservations(reservationData);
      setReservationIdsWithTables(
        new Set(
          details
            .filter((item) => Array.isArray(item?.diningTables) && item.diningTables.length > 0)
            .map((item) => Number(item.reservationId))
        )
      );
    } catch (error) {
      console.error("Lỗi khi tải danh sách reservation:", error);
      window.alert("Không thể tải danh sách reservation.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const activeReservations = useMemo(
    () => reservations.filter((item) => item.status !== "CHECKED_IN"),
    [reservations]
  );

  const handleOpenCreatePage = () => {
    navigate(`${basePath}/create`);
  };

  const handleOpenDetailPage = (reservation) => {
    navigate(`${basePath}/${reservation.id}/details`, {
      state: {
        reservationId: reservation.id,
      },
    });
  };

  const handleConfirmTableReceived = async (reservation) => {
    const confirmed = window.confirm(
      `Xác nhận reservation #${reservation.id} đã nhận bàn?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await updateReservation(reservation.id, { status: "CHECKED_IN" });
      setReservations((prev) =>
        prev.map((item) =>
          item.id === reservation.id ? { ...item, status: "CHECKED_IN" } : item
        )
      );
      window.alert("Đã xác nhận khách đã nhận bàn.");
    } catch (error) {
      console.error("Xác nhận nhận bàn thất bại:", error);
      const apiMessage = error?.response?.data?.message || error?.response?.data?.result?.message;
      window.alert(apiMessage || error?.message || "Xác nhận nhận bàn thất bại.");
    }
  };

  return (
    <div className="reservation-wrapper">
      <div className="reservation-layout reservation-layout-full">
        <div className="reservation-card">
          <div className="reservation-card-header">
            <div>
              <span className="reservation-badge">Reservation domain</span>
              <h2>Danh sách Reservation</h2>
            </div>
            <button className="btn-primary btn-inline" onClick={handleOpenCreatePage}>
              Tạo mới Reservation
            </button>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="empty-state-icon">⏳</div>
              <h3>Đang tải reservation</h3>
              <p>Hệ thống đang lấy danh sách reservation hiện tại.</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>Chưa có reservation</h3>
              <p>Bạn có thể bấm “Tạo mới Reservation” để bắt đầu.</p>
            </div>
          ) : (
            <>
              {activeReservations.length === 0 ? (
                <div className="empty-state">
                  <h3>Không còn reservation đang xử lý</h3>
                </div>
              ) : (
                <div className="table-list">
                  {activeReservations.map((item) => {
                    const canCheckIn =
                      item.status === "CONFIRMED" && reservationIdsWithTables.has(Number(item.id));

                    return (
                      <div key={item.id} className="table-card">
                        <div className="table-item-body">
                          <div>
                            <div className="table-title-row">
                              <strong>Reservation #{item.id}</strong>
                              <span className="table-area">{item.status || "DRAFT"}</span>
                            </div>
                            <p>Ngày: {item.reservationDate || "--"}</p>
                            <p>
                              Khung giờ: {normalizeTime(item.startTime) || "--:--"} - {normalizeTime(item.endTime) || "--:--"}
                            </p>
                            <p>Customer ID: {item.customerId ?? "Chưa gán"}</p>
                            {item.status === "CONFIRMED" && !canCheckIn && (
                              <p className="text-warning">Cần gán bàn trước khi xác nhận đã nhận bàn.</p>
                            )}
                          </div>
                          <div className="table-item-meta">
                            <button
                              className="btn-primary"
                              style={{ minWidth: 150 }}
                              onClick={() => handleOpenDetailPage(item)}
                            >
                              Gán bàn
                            </button>
                            <button
                              className="btn-success"
                              style={{ minWidth: 150 }}
                              onClick={() => handleConfirmTableReceived(item)}
                              disabled={!canCheckIn}
                            >
                              Xác nhận đã nhận bàn
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
