import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ReservationDetailForm from "../components/reservationDetail/ReservationDetailForm";
import ReservationDetailSummary from "../components/reservationDetail/ReservationDetailSummary";
import { getTables, updateTable } from "../service/table";
import { getReservationById } from "../service/reservation";
import {
  createReservationDetail,
  getReservationDetails,
  updateReservationDetail,
} from "../service/reservationDetail";
import { filterAvailableTables, normalizeTime } from "../utils/reservation";
import "../styles/Reservation.css";

export default function ReservationDetailPage() {
  const { reservationId: reservationIdParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const resolvedReservationId = Number(reservationIdParam || location.state?.reservationId);
  const guestsHint = Number(location.state?.guests || 0);

  const [reservation, setReservation] = useState(null);
  const [tables, setTables] = useState([]);
  const [history, setHistory] = useState([]);
  const [existingDetailId, setExistingDetailId] = useState(null);
  const [selectedTableIds, setSelectedTableIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigateToReservationList = useCallback(() => {
    const basePath = location.pathname.startsWith("/admin/")
      ? "/admin/reservations"
      : "/staff/reservations";
    navigate(basePath);
  }, [location.pathname, navigate]);

  const loadData = useCallback(async () => {
    if (!resolvedReservationId) {
      return;
    }

    setLoading(true);
    try {
      const [reservationRes, tablesRes, detailsRes] = await Promise.all([
        getReservationById(resolvedReservationId),
        getTables(0, 100),
        getReservationDetails(),
      ]);

      const reservationData = reservationRes?.data?.result || null;
      const tableData = tablesRes?.data?.result?.content || [];
      const detailData = detailsRes?.data?.result || [];

      setReservation(reservationData);
      setTables(tableData);

      const uniqueReservationIds = [...new Set(detailData.map((item) => item.reservationId))];
      const reservationEntries = await Promise.all(
        uniqueReservationIds.map(async (id) => {
          try {
            const res = await getReservationById(id);
            return [id, res?.data?.result || null];
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

      setHistory(mappedHistory);

      const ownDetail = detailData.find(
        (item) => Number(item.reservationId) === Number(resolvedReservationId)
      );
      setExistingDetailId(ownDetail?.id || null);
      setSelectedTableIds((ownDetail?.diningTables || []).map((table) => table.id));
    } catch (error) {
      console.error("Lỗi khi tải reservation detail:", error);
      window.alert("Không thể tải dữ liệu reservation detail.");
    } finally {
      setLoading(false);
    }
  }, [resolvedReservationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const availableTables = useMemo(
    () =>
      filterAvailableTables({
        tables,
        reservation,
        reservationDetailHistory: history,
        currentReservationId: resolvedReservationId,
      }),
    [tables, reservation, history, resolvedReservationId]
  );

  useEffect(() => {
    const availableIds = new Set(availableTables.map((table) => table.id));
    setSelectedTableIds((prev) => prev.filter((id) => availableIds.has(id)));
  }, [availableTables]);

  const selectedTables = useMemo(
    () => tables.filter((table) => selectedTableIds.includes(table.id)),
    [tables, selectedTableIds]
  );

  const selectedCapacity = useMemo(
    () => selectedTables.reduce((total, table) => total + (table.maxGuests || 0), 0),
    [selectedTables]
  );

  const handleSubmit = useCallback(async () => {
    if (submitting) {
      return;
    }

    if (!resolvedReservationId) {
      window.alert("Không tìm thấy reservationId hợp lệ.");
      return;
    }

    if (selectedTableIds.length === 0) {
      window.alert("Vui lòng chọn ít nhất một bàn trước khi tạo reservation detail.");
      return;
    }

    if (guestsHint > 0 && selectedCapacity < guestsHint) {
      window.alert("Tổng sức chứa chưa đủ số khách từ reservation.");
      return;
    }

    setSubmitting(true);
    try {
      if (existingDetailId) {
        await updateReservationDetail(existingDetailId, {
          reservationId: resolvedReservationId,
          diningTableIds: selectedTableIds,
        });
      } else {
        await createReservationDetail({
          reservationId: resolvedReservationId,
          diningTableIds: selectedTableIds,
        });
      }

      await Promise.all(
        selectedTableIds.map((tableId) => updateTable(tableId, { status: "Reserved" }))
      );

      window.alert(
        existingDetailId
          ? "Cập nhật Reservation Detail thành công."
          : "Tạo Reservation Detail thành công."
      );
      navigateToReservationList();
    } catch (error) {
      console.error("Tạo reservation detail thất bại:", error);
      const apiMessage = error?.response?.data?.message || error?.response?.data?.result?.message;
      window.alert(apiMessage || error?.message || "Tạo reservation detail thất bại.");
    } finally {
      setSubmitting(false);
    }
  }, [
    existingDetailId,
    navigateToReservationList,
    resolvedReservationId,
    selectedCapacity,
    selectedTableIds,
    submitting,
    guestsHint,
  ]);

  if (!resolvedReservationId) {
    return (
      <div className="reservation-wrapper">
        <div className="reservation-layout">
          <div className="reservation-card">
            <div className="empty-state">
              <div className="empty-state-icon">⚠️</div>
              <h3>Thiếu reservationId</h3>
              <p>Vui lòng tạo Reservation trước rồi mới vào màn Reservation Detail.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-wrapper">
      <div className="reservation-layout">
        <div className="reservation-card">
          <div className="reservation-card-header">
            <div>
              <span className="reservation-badge">Reservation detail domain</span>
              <h2>Tạo Reservation Detail</h2>
              <p className="reservation-subtitle">
                Bước 2 nghiệp vụ: gán bàn cho reservation đã tạo.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="empty-state-icon">⏳</div>
              <h3>Đang tải dữ liệu</h3>
              <p>Hệ thống đang lấy Reservation, bảng bàn và lịch trùng giờ.</p>
            </div>
          ) : (
            <ReservationDetailForm
              reservation={reservation}
              guestsHint={guestsHint}
              hasExistingDetail={Boolean(existingDetailId)}
              allTables={tables}
              availableTables={availableTables}
              selectedTableIds={selectedTableIds}
              setSelectedTableIds={setSelectedTableIds}
              onBack={navigateToReservationList}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>

        <div className="reservation-sidebar">
          <ReservationDetailSummary
            reservation={reservation}
            guestsHint={guestsHint}
            selectedTables={selectedTables}
            availableCount={availableTables.length}
            historyCount={history.length}
          />

          <div className="reservation-side-card">
            <h3>Flow chuẩn</h3>
            <ol className="flow-list">
              <li>Đọc reservation theo id từ route.</li>
              <li>Lọc bàn còn trống theo ngày và khung giờ reservation.</li>
              <li>Chọn bàn, submit createReservationDetail.</li>
              <li>Cập nhật trạng thái bàn nếu cần.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
