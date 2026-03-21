import AvailableTableList from "./AvailableTableList";

export default function TableSelector({
  allTables,
  availableTables,
  selectedTableIds,
  guests = 0,
  onToggle,
}) {
  const selectedTables = allTables.filter((table) => selectedTableIds.includes(table.id));
  const selectedCapacity = selectedTables.reduce(
    (total, table) => total + (table.maxGuests || 0),
    0
  );
  const missingCapacity = Math.max(0, (guests || 0) - selectedCapacity);

  return (
    <>
      <p className="step-helper">
        Chọn tối thiểu 1 bàn. Nếu có số khách, nên chọn đủ sức chứa.
      </p>

      <div className="selection-summary selection-summary-highlight">
        <span>Đã chọn {selectedTableIds.length} bàn</span>
        <span>Tổng sức chứa {selectedCapacity} khách</span>
        {guests > 0 && (
          <span className={missingCapacity > 0 ? "text-warning" : "text-success"}>
            {missingCapacity > 0 ? `Thiếu ${missingCapacity} khách` : "Đã đủ sức chứa"}
          </span>
        )}
      </div>

      <AvailableTableList
        tables={availableTables}
        selectedTableIds={selectedTableIds}
        onToggle={onToggle}
      />
    </>
  );
}
