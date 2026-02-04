export default function StepTime({ data, setData, next }) {
  return (
    <div className="step">
      <h3>1. Thời gian</h3>

      <label>Giờ bắt đầu</label>
      <input type="time" />

      <label>Giờ kết thúc</label>
      <input type="time" />

      <label>Số khách</label>
      <input type="number" min={1} />

      <div className="btn-group">
        <button className="btn-primary" onClick={next}>
          Tìm bàn
        </button>
      </div>
    </div>
  );
}
