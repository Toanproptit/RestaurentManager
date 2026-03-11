export default function StepCustomer({ data, setData, back, submit }) {
  return (
    <div className="step">
      <h3>3. Thông tin khách</h3>

      <label>Số điện thoại *</label>
      <input
        type="text"
        value={data.customer.phone}
        onChange={(e) =>
          setData({
            ...data,
            customer: { ...data.customer, phone: e.target.value },
          })
        }
      />

      <label>Tên</label>
      <input
        type="text"
        value={data.customer.name}
        onChange={(e) =>
          setData({
            ...data,
            customer: { ...data.customer, name: e.target.value },
          })
        }
      />

      <label>Email</label>
      <input
        type="email"
        value={data.customer.email}
        onChange={(e) =>
          setData({
            ...data,
            customer: { ...data.customer, email: e.target.value },
          })
        }
      />

      <label>Địa chỉ</label>
      <input
        type="text"
        value={data.customer.address}
        onChange={(e) =>
          setData({
            ...data,
            customer: { ...data.customer, address: e.target.value },
          })
        }
      />

      <div className="reservation-preview">
        <h4>Tóm tắt đặt bàn</h4>
        <p>Ngày: {data.reservationDate}</p>
        <p>Thời gian: {data.startTime} - {data.endTime}</p>
        <p>Số khách: {data.guests}</p>
        <p>Số bàn đã chọn: {data.diningTableIds.length}</p>
      </div>

      <div className="btn-group">
        <button className="btn-secondary" onClick={back}>
          Quay lại
        </button>
        <button className="btn-success" onClick={submit}>
          Xác nhận
        </button>
      </div>
    </div>
  );
}
