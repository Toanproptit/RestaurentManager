export default function ReservationDetailSummary({
  reservation,
  guestsHint,
  selectedTables,
  availableCount,
  historyCount,
}) {
  return (
    <div className="reservation-side-card">
      <h3>Tóm tắt reservation</h3>

      <div className="sidebar-metric-grid">
        <div className="sidebar-metric">
          <span>Bàn khả dụng</span>
          <strong>{availableCount}</strong>
        </div>
        <div className="sidebar-metric">
          <span>Bàn đã chọn</span>
          <strong>{selectedTables.length}</strong>
        </div>
        <div className="sidebar-metric">
          <span>Số khách</span>
          <strong>{guestsHint || "--"}</strong>
        </div>
        <div className="sidebar-metric">
          <span>Lịch đã có</span>
          <strong>{historyCount}</strong>
        </div>
      </div>

      <div className="payload-preview">
        <h4>Thông tin đang thao tác</h4>
        <p>
          <strong>Reservation ID:</strong> #{reservation?.id || "--"}
        </p>
        <p>
          <strong>Ngày:</strong> {reservation?.reservationDate || "--/--/----"}
        </p>
        <p>
          <strong>Khung giờ:</strong> {reservation?.startTime || "--:--"} - {reservation?.endTime || "--:--"}
        </p>
        <p>
          <strong>Bàn chọn:</strong>{" "}
          {selectedTables.length
            ? selectedTables.map((table) => table.name).join(", ")
            : "Chưa chọn"}
        </p>
      </div>
    </div>
  );
}
