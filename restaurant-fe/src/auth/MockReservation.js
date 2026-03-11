import { mockTables } from "./MockTable";

export const mockCustomers = [
  {
    id: 1,
    name: "Nguyen Van An",
    email: "an.nguyen@example.com",
    phone: "0901234567",
    address: "Hai Chau, Da Nang",
  },
  {
    id: 2,
    name: "Tran Thi Mai",
    email: "mai.tran@example.com",
    phone: "0912345678",
    address: "Thanh Khe, Da Nang",
  },
];

export const mockReservationRecords = [
  {
    detailId: 101,
    reservationId: 201,
    reservationDate: "2026-03-12",
    startTime: "18:00",
    endTime: "20:00",
    customerId: 1,
    diningTableIds: ["TB-02"],
  },
];

export const mockReservationTables = mockTables.map((table) => {
  const reserved = mockReservationRecords.some((record) =>
    record.diningTableIds.includes(table.id)
  );

  return {
    ...table,
    status: reserved ? "Reserved" : table.status,
  };
});