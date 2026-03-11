export default function StepTime({ data, setData, next }) {
  const handleNext = () => {
    if (!data.reservationDate || !data.startTime || !data.endTime) {
      window.alert("Vui lòng nhập ngày và thời gian đặt bàn.");
      return;
    }

    if (data.endTime <= data.startTime) {
      window.alert("Giờ kết thúc phải lớn hơn giờ bắt đầu.");
      return;
    }

    next();
  };

  return (
    <div className="step">
      <h3>1. Thời gian</h3>

      <label>Ngày đặt bàn</label>
      <input
        type="date"
        value={data.reservationDate}
        onChange={(e) =>
          setData({ ...data, reservationDate: e.target.value })
        }
      />

      <label>Giờ bắt đầu</label>
      <input
        type="time"
        value={data.startTime}
        onChange={(e) => setData({ ...data, startTime: e.target.value })}
      />

      <label>Giờ kết thúc</label>
      <input
        type="time"
        value={data.endTime}
        onChange={(e) => setData({ ...data, endTime: e.target.value })}
      />

      <label>Số khách</label>
      <input
        type="number"
        min={1}
        value={data.guests}
        onChange={(e) => setData({ ...data, guests: Number(e.target.value) })}
      />

      <div className="btn-group">
        <button className="btn-primary" onClick={handleNext}>
          Tìm bàn
        </button>
      </div>
    </div>
  );
}
