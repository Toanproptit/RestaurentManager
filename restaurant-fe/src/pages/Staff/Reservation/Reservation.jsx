import { useState } from "react";
import { mockCustomers, mockReservationRecords, mockReservationTables } from "../../../auth/MockReservation";
import StepTime from "./StepTime";
import StepTable from "./StepTable";
import StepCustomer from "./StepCustomer";
import "../../../styles/Reservation.css";

export default function Reservation() {
  const [step, setStep] = useState(1);
  const [customers, setCustomers] = useState(mockCustomers);
  const [tableInventory, setTableInventory] = useState(mockReservationTables);
  const [reservations, setReservations] = useState(mockReservationRecords);
  const [lastCreated, setLastCreated] = useState(null);

  const [reservation, setReservation] = useState({
    reservationDate: "",
    startTime: "",
    endTime: "",
    guests: 1,
    diningTableIds: [],
    customer: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const availableTables = tableInventory.filter(
    (table) => table.status !== "Inactive" && table.maxGuests > 0
  );

  const resetReservationForm = () => {
    setReservation({
      reservationDate: "",
      startTime: "",
      endTime: "",
      guests: 1,
      diningTableIds: [],
      customer: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
    });
    setStep(1);
  };

  const handleSubmitReservation = () => {
    if (!reservation.customer.phone.trim()) {
      window.alert("Vui lòng nhập số điện thoại khách hàng.");
      return;
    }

    let customerId = customers.find(
      (customer) => customer.phone === reservation.customer.phone
    )?.id;

    if (!customerId) {
      if (!reservation.customer.name.trim()) {
        window.alert("Khách mới cần có tên để tạo dữ liệu mock.");
        return;
      }

      customerId = Date.now();
      const newCustomer = {
        id: customerId,
        ...reservation.customer,
      };
      setCustomers((prevCustomers) => [newCustomer, ...prevCustomers]);
    }

    const createdRecord = {
      detailId: Date.now(),
      reservationId: Date.now() + 1,
      reservationDate: reservation.reservationDate,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      customerId,
      diningTableIds: reservation.diningTableIds,
    };

    setReservations((prevReservations) => [createdRecord, ...prevReservations]);
    setTableInventory((prevTables) =>
      prevTables.map((table) =>
        reservation.diningTableIds.includes(table.id)
          ? { ...table, status: "Reserved" }
          : table
      )
    );
    setLastCreated(createdRecord);
    window.alert("Đã tạo mock reservation theo luồng backend.");
    resetReservationForm();
  };

  const getCustomerName = (customerId) =>
    customers.find((customer) => customer.id === customerId)?.name || "Unknown";

  const getTableNames = (tableIds) =>
    tableInventory
      .filter((table) => tableIds.includes(table.id))
      .map((table) => table.name)
      .join(", ");

  return (
    <div className="reservation-wrapper">
      <div className="reservation-layout">
        <div className="reservation-card">
          <h2>Đặt bàn</h2>

          <div className="step-indicator">
            <div className={step >= 1 ? "active" : ""}>1</div>
            <div className={step >= 2 ? "active" : ""}>2</div>
            <div className={step >= 3 ? "active" : ""}>3</div>
          </div>

          {step === 1 && (
            <StepTime
              data={reservation}
              setData={setReservation}
              next={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <StepTable
              data={reservation}
              setData={setReservation}
              next={() => setStep(3)}
              back={() => setStep(1)}
              availableTables={availableTables}
            />
          )}

          {step === 3 && (
            <StepCustomer
              data={reservation}
              setData={setReservation}
              back={() => setStep(2)}
              submit={handleSubmitReservation}
            />
          )}
        </div>

        <div className="reservation-sidebar">
          <div className="reservation-side-card">
            <h3>Mock backend flow</h3>
            <ol>
              <li>Tạo hoặc tìm customer theo số điện thoại.</li>
              <li>Tạo reservation với ngày, giờ bắt đầu, giờ kết thúc, customerId.</li>
              <li>Tạo reservation detail với reservationId và diningTableIds.</li>
            </ol>

            {lastCreated && (
              <div className="payload-preview">
                <h4>Reservation mock mới tạo</h4>
                <p>reservationId: {lastCreated.reservationId}</p>
                <p>customerId: {lastCreated.customerId}</p>
                <p>diningTableIds: {lastCreated.diningTableIds.join(", ")}</p>
              </div>
            )}
          </div>

          <div className="reservation-side-card">
            <h3>Recent reservations</h3>
            <div className="reservation-history-list">
              {reservations.map((item) => (
                <div key={item.detailId} className="reservation-history-item">
                  <strong>{getCustomerName(item.customerId)}</strong>
                  <p>{item.reservationDate}</p>
                  <p>
                    {item.startTime} - {item.endTime}
                  </p>
                  <p>{getTableNames(item.diningTableIds)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}