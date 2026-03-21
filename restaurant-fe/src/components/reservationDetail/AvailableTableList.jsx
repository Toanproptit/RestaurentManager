export default function AvailableTableList({ tables, selectedTableIds, onToggle }) {
  return (
    <div className="table-list">
      {tables.length === 0 && (
        <p className="step-empty">Không có bàn trống trong khung giờ reservation này.</p>
      )}

      {tables.map((table) => {
        const isSelected = selectedTableIds.includes(table.id);

        return (
          <label
            key={table.id}
            className={`table-item table-card ${isSelected ? "selected" : ""}`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(table.id)}
            />

            <div className="table-item-body">
              <div>
                <div className="table-title-row">
                  <strong>{table.name}</strong>
                  <span className="table-area">{table.area || "Khu vực chung"}</span>
                </div>
                <p>{table.description || "Không có mô tả."}</p>
              </div>

              <div className="table-item-meta">
                <span className="capacity-pill">{table.maxGuests} khách</span>
                <span className="table-status-soft">Sẵn sàng</span>
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
