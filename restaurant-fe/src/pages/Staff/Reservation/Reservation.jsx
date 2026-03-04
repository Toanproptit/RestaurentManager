import { useState } from "react";
import StepTime from "./StepTime";
import StepTable from "./StepTable";
import StepCustomer from "./StepCustomer";
import "../../../styles/Reservation.css";

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
    <div className="reservation-wrapper">
      <div className="reservation-card">
        <h2>Đặt bàn</h2>

        {/* Step Indicator */}
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
    </div>
  );
}