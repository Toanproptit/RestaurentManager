export default function CustomerForm({ customer, onChange }) {
  return (
    <div className="step-panel">
      <div className="step-panel-head">
        <p className="step-panel-kicker">Customer</p>
        <h3>Thông tin khách hàng</h3>
        <p>Tìm theo số điện thoại; nếu chưa có thì hệ thống sẽ tự tạo customer mới.</p>
      </div>

      <div className="form-grid form-grid-2">
        <div className="form-field">
          <label>Số điện thoại *</label>
          <input
            type="text"
            value={customer.phone}
            placeholder="Nhập số điện thoại"
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Tên khách *</label>
          <input
            type="text"
            value={customer.name}
            placeholder="Nhập tên khách hàng"
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Email</label>
          <input
            type="email"
            value={customer.email}
            placeholder="example@email.com"
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Địa chỉ</label>
          <input
            type="text"
            value={customer.address}
            placeholder="Địa chỉ khách hàng"
            onChange={(e) => onChange("address", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
