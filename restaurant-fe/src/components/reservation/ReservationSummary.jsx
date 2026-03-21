export default function ReservationSummary({ reservation, customer }) {
  return (
    <div className="payload-preview">
      <h4>Tóm tắt reservation</h4>
      <p>
        <strong>Ngày:</strong> {reservation.reservationDate || "--/--/----"}
      </p>
      <p>
        <strong>Khung giờ:</strong>{" "}
        {reservation.startTime && reservation.endTime
          ? `${reservation.startTime} - ${reservation.endTime}`
          : "--:-- - --:--"}
      </p>
      <p>
        <strong>Số khách:</strong> {reservation.guests || 1}
      </p>
      <p>
        <strong>Khách hàng:</strong> {customer.name || "Chưa nhập tên"}
      </p>
      <p>
        <strong>Điện thoại:</strong> {customer.phone || "Chưa nhập số điện thoại"}
      </p>
    </div>
  );
}
