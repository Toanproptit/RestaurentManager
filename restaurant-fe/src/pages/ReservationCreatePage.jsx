import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerForm from "../components/reservation/CustomerForm";
import ReservationForm from "../components/reservation/ReservationForm";
import { getTables } from "../service/table";
import { createCustomer, getCustomers } from "../service/customer";
import { createReservation, getReservationById, getReservations } from "../service/reservation";
import { getReservationDetails } from "../service/reservationDetail";
import {
  filterAvailableTables,
  findCreatedReservationId,
  findCustomerByPhone,
  isEndTimeAfterStart,
  normalizeTime,
} from "../utils/reservation";
import "../styles/Reservation.css";

const initialState = {
  reservationDate: "",
  startTime: "",
  endTime: "",
  guests: 1,
  customer: {
    name: "",
    email: "",
    phone: "",
    address: "",
  },
};

export default function ReservationCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(initialState);
  const [customers, setCustomers] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationDetailHistory, setReservationDetailHistory] = useState([]);
  const [checkedAvailability, setCheckedAvailability] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const basePath = useMemo(
    () => (location.pathname.startsWith("/admin/") ? "/admin/reservations" : "/staff/reservations"),
    [location.pathname]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customerRes, tablesRes, detailsRes] = await Promise.all([
          getCustomers(),
          getTables(0, 100),
          getReservationDetails(),
        ]);

        setCustomers(customerRes?.data?.result || []);
        setTables(tablesRes?.data?.result?.content || []);

        const detailData = detailsRes?.data?.result || [];
        const uniqueReservationIds = [...new Set(detailData.map((item) => item.reservationId))];

        const reservationEntries = await Promise.all(
          uniqueReservationIds.map(async (id) => {
            try {
              const reservationRes = await getReservationById(id);
              return [id, reservationRes?.data?.result || null];
            } catch {
              return [id, null];
            }
          })
        );

        const reservationMap = new Map(reservationEntries);
        const mappedHistory = detailData.map((item) => {
          const reservationInfo = reservationMap.get(item.reservationId);
          return {
            detailId: item.id,
            reservationId: item.reservationId,
            reservationDate: reservationInfo?.reservationDate || "",
            startTime: normalizeTime(reservationInfo?.startTime),
            endTime: normalizeTime(reservationInfo?.endTime),
            diningTableIds: (item.diningTables || []).map((table) => table.id),
          };
        });

        setReservationDetailHistory(mappedHistory);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu reservation:", error);
        window.alert("Không thể tải dữ liệu khởi tạo reservation.");
      }
    };

    loadData();
  }, []);

  const onReservationChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    if (["reservationDate", "startTime", "endTime", "guests"].includes(key)) {
      setCheckedAvailability(false);
      setAvailableTables([]);
    }
  };

  const onCustomerChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        [key]: value,
      },
    }));
  };

  const validateForm = () => {
    if (!formData.reservationDate || !formData.startTime || !formData.endTime) {
      window.alert("Vui lòng nhập đầy đủ ngày và thời gian.");
      return false;
    }

    if (!isEndTimeAfterStart(formData.startTime, formData.endTime)) {
      window.alert("Giờ kết thúc phải lớn hơn giờ bắt đầu.");
      return false;
    }

    if (!formData.customer.phone.trim()) {
      window.alert("Vui lòng nhập số điện thoại khách hàng.");
      return false;
    }

    if (!formData.customer.name.trim()) {
      window.alert("Vui lòng nhập tên khách hàng.");
      return false;
    }

    return true;
  };

  const handleCheckAvailability = () => {
    if (!formData.reservationDate || !formData.startTime || !formData.endTime) {
      window.alert("Vui lòng nhập ngày và thời gian trước khi kiểm tra bàn.");
      return;
    }

    if (!isEndTimeAfterStart(formData.startTime, formData.endTime)) {
      window.alert("Giờ kết thúc phải lớn hơn giờ bắt đầu.");
      return;
    }

    const available = filterAvailableTables({
      tables,
      reservation: formData,
      reservationDetailHistory,
    });

    setCheckedAvailability(true);
    setAvailableTables(available);

    const totalCapacity = available.reduce((sum, table) => sum + (table.maxGuests || 0), 0);

    if (available.length === 0 || totalCapacity < (formData.guests || 1)) {
      window.alert("Khung giờ này hiện không đủ bàn trống theo số khách. Vui lòng đổi thời gian.");
    }
  };

  const handleCreateReservation = async () => {
    if (submitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!checkedAvailability) {
      window.alert("Vui lòng kiểm tra bàn trống trước khi tạo reservation.");
      return;
    }

    const totalCapacity = availableTables.reduce((sum, table) => sum + (table.maxGuests || 0), 0);
    if (availableTables.length === 0 || totalCapacity < (formData.guests || 1)) {
      window.alert("Không đủ bàn trống cho khung giờ này. Vui lòng kiểm tra lại.");
      return;
    }

    setSubmitting(true);
    try {
      const existingCustomer = findCustomerByPhone(customers, formData.customer.phone);
      let customerId = existingCustomer?.id;

      if (!customerId) {
        const createdCustomerRes = await createCustomer({
          name: formData.customer.name,
          email: formData.customer.email,
          phone: formData.customer.phone,
          address: formData.customer.address,
        });

        customerId = createdCustomerRes?.data?.result?.id;

        if (customerId) {
          setCustomers((prev) => [...prev, createdCustomerRes.data.result]);
        }
      }

      if (!customerId) {
        throw new Error("Không tạo được customerId. Vui lòng tạo khách hàng trước khi tạo reservation.");
      }

      const createdReservation = await createReservation({
        reservationDate: formData.reservationDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        customerId,
      });

      let reservationId = createdReservation?.data?.result?.id;

      if (!reservationId) {
        const reservationList = await getReservations(0, 200);
        const items = reservationList?.data?.result?.content || [];
        reservationId = findCreatedReservationId({
          reservations: items,
          customerId,
          reservationDate: formData.reservationDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
        });
      }

      if (!reservationId) {
        throw new Error("Không lấy được reservationId sau khi tạo reservation.");
      }

      window.alert("Tạo Reservation thành công. Tiếp tục sang bước gán bàn.");
      navigate(`${basePath}/${reservationId}/details`, {
        state: { reservationId, guests: formData.guests },
      });
    } catch (error) {
      console.error("Tạo reservation thất bại:", error);
      const apiMessage = error?.response?.data?.message || error?.response?.data?.result?.message;
      window.alert(apiMessage || error?.message || "Tạo reservation thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reservation-wrapper">
      <div className="reservation-layout reservation-layout-full">
        <div className="reservation-card">
          <div className="reservation-card-header">
            <div>
              <span className="reservation-badge">Reservation domain</span>
              <h2>Tạo Reservation</h2>
              <p className="reservation-subtitle">
                Bước 1 nghiệp vụ: tạo reservation trước, sau đó mới sang màn gán bàn.
              </p>
            </div>
          </div>

          <ReservationForm data={formData} onChange={onReservationChange} />

          <div className="btn-group">
            <button className="btn-primary" onClick={handleCheckAvailability} disabled={submitting}>
              Kiểm tra bàn trống
            </button>
            <button className="btn-secondary" onClick={() => navigate(basePath)} disabled={submitting}>
              Quay lại danh sách
            </button>
          </div>

          {checkedAvailability && (
            <div className="info-strip" style={{ marginTop: 12 }}>
              Có <strong>{availableTables.length}</strong> bàn trống trong khung giờ đã chọn.
            </div>
          )}

          {checkedAvailability && availableTables.length > 0 && (
            <CustomerForm customer={formData.customer} onChange={onCustomerChange} />
          )}

          <div className="btn-group">
            <button
              className="btn-success"
              onClick={handleCreateReservation}
              disabled={submitting || !checkedAvailability || availableTables.length === 0}
            >
              {submitting ? "Đang tạo..." : "Tạo Reservation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
