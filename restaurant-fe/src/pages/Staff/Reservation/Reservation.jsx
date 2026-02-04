import { useState } from "react";
import StepTime from "./StepTime";
import StepTable from "./StepTable";
import StepCustomer from "./StepCustomer";
import "../../../styles/Reservation.css"

export default function Reservation() {
  const [step, setStep] = useState(1);

  const [reservation, setReservation] = useState({
    startTime: "",
    endTime: "",
    guests: 1,
    tables: [],
    customer: {}
  });

  return (
    <div style={{ width: 500, margin: "auto" }}>
      <h2>Đặt bàn</h2>

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
        />
      )}

      {step === 3 && (
        <StepCustomer
          data={reservation}
          setData={setReservation}
          back={() => setStep(2)}
        />
      )}
    </div>
  );
}
