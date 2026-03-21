export default function ReservationForm({ data, onChange }) {
  return (
    <div className="step-panel">
      <div className="step-panel-head">
        <p className="step-panel-kicker">Reservation</p>
        <h3>Thông tin đặt bàn</h3>
        <p>Nhập ngày, thời gian và số khách để tạo reservation.</p>
      </div>

      <div className="form-grid form-grid-2">
        <div className="form-field">
          <label>Ngày đặt bàn</label>
          <input
            type="date"
            value={data.reservationDate}
            onChange={(e) => onChange("reservationDate", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Số khách</label>
          <input
            type="number"
            min={1}
            value={data.guests}
            onChange={(e) => onChange("guests", Number(e.target.value))}
          />
        </div>

        <div className="form-field">
          <label>Giờ bắt đầu</label>
          <input
            type="time"
            value={data.startTime}
            onChange={(e) => onChange("startTime", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Giờ kết thúc</label>
          <input
            type="time"
            value={data.endTime}
            onChange={(e) => onChange("endTime", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
