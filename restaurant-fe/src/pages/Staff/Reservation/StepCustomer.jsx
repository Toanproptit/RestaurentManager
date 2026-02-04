export default function StepCustomer({ data, setData, back }) {
  return (
    <div className="step">
      <h3>3. Thông tin khách</h3>

      <label>Số điện thoại *</label>
      <input type="text" />

      <label>Tên</label>
      <input type="text" />

      <label>Email</label>
      <input type="email" />

      <div className="btn-group">
        <button className="btn-secondary" onClick={back}>
          Quay lại
        </button>
        <button className="btn-success">
          Xác nhận
        </button>
      </div>
    </div>
  );
}
