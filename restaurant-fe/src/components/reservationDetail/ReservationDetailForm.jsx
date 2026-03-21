import TableSelector from "./TableSelector";

export default function ReservationDetailForm({
  reservation,
  guestsHint,
  hasExistingDetail,
  allTables,
  availableTables,
  selectedTableIds,
  setSelectedTableIds,
  onBack,
  onSubmit,
  submitting,
}) {
  const toggleTable = (tableId) => {
    const isSelected = selectedTableIds.includes(tableId);
    setSelectedTableIds((prev) =>
      isSelected ? prev.filter((id) => id !== tableId) : [...prev, tableId]
    );
  };

  return (
    <div className="step-panel">
      <div className="step-panel-head">
        <p className="step-panel-kicker">Reservation Detail</p>
        <h3>Gán bàn cho reservation #{reservation?.id}</h3>
        <p>
          Hệ thống đã lọc theo ngày và khung giờ ({reservation?.startTime} - {reservation?.endTime}).
        </p>
      </div>

      <TableSelector
        allTables={allTables}
        availableTables={availableTables}
        selectedTableIds={selectedTableIds}
        guests={guestsHint}
        onToggle={toggleTable}
      />

      <div className="btn-group">
        <button className="btn-secondary" onClick={onBack} disabled={submitting}>
          Quay lại
        </button>
        <button className="btn-success" onClick={onSubmit} disabled={submitting}>
          {submitting ? "Đang lưu..." : hasExistingDetail ? "Cập nhật reservation detail" : "Tạo reservation detail"}
        </button>
      </div>
    </div>
  );
}
