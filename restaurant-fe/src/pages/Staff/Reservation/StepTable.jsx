export default function StepTable({ data, setData, next, back }) {
  return (
    <div className="step">
      <h3>2. Chọn bàn</h3>

      <div className="table-list">
        {mockTables.map(table => (
          <label key={table.id} className="table-item">
            <input type="checkbox" />
            {table.name} ({table.maxGuest} chỗ)
          </label>
        ))}
      </div>

      <div className="btn-group">
        <button className="btn-secondary" onClick={back}>
          Quay lại
        </button>
        <button className="btn-primary" onClick={next}>
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
