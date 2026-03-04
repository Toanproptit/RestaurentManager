export default function StepTable({ data, setData, next, back }) {
  return (
    <div className="step">
      <h3>2. Chọn bàn</h3>

      <div className="table-list">
        
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
