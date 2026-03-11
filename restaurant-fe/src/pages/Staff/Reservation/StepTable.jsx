export default function StepTable({ data, setData, next, back, availableTables }) {
  const selectedTables = data.diningTableIds || [];
  const selectedCapacity = availableTables
    .filter((table) => selectedTables.includes(table.id))
    .reduce((total, table) => total + table.maxGuests, 0);

  const toggleTable = (tableId) => {
    const isSelected = selectedTables.includes(tableId);

    setData({
      ...data,
      diningTableIds: isSelected
        ? selectedTables.filter((id) => id !== tableId)
        : [...selectedTables, tableId],
    });
  };

  const handleNext = () => {
    if (selectedTables.length === 0) {
      window.alert("Vui lòng chọn ít nhất một bàn.");
      return;
    }

    if (selectedCapacity < data.guests) {
      window.alert("Tổng sức chứa của bàn chưa đủ số lượng khách.");
      return;
    }

    next();
  };

  return (
    <div className="step">
      <h3>2. Chọn bàn</h3>

      <p className="step-helper">
        Chọn bàn có tổng sức chứa tối thiểu {data.guests} khách.
      </p>

      <div className="table-list">
        {availableTables.length === 0 && (
          <p className="step-empty">Không có bàn phù hợp cho khung giờ này.</p>
        )}

        {availableTables.map((table) => {
          const isSelected = selectedTables.includes(table.id);

          return (
            <label
              key={table.id}
              className={`table-item ${isSelected ? "selected" : ""}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleTable(table.id)}
              />

              <div className="table-item-body">
                <div>
                  <strong>{table.name}</strong>
                  <p>{table.description}</p>
                </div>

                <div className="table-item-meta">
                  <span>{table.area}</span>
                  <span>{table.maxGuests} khách</span>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <div className="selection-summary">
        <span>Đã chọn: {selectedTables.length} bàn</span>
        <span>Tổng sức chứa: {selectedCapacity} khách</span>
      </div>

      <div className="btn-group">
        <button className="btn-secondary" onClick={back}>
          Quay lại
        </button>
        <button className="btn-primary" onClick={handleNext}>
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
