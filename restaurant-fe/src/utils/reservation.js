export const normalizeTime = (value) => (value ? String(value).slice(0, 5) : "");

export const hasTimeOverlap = (startA, endA, startB, endB) => {
  const normalizedStartA = normalizeTime(startA);
  const normalizedEndA = normalizeTime(endA);
  const normalizedStartB = normalizeTime(startB);
  const normalizedEndB = normalizeTime(endB);

  if (!normalizedStartA || !normalizedEndA || !normalizedStartB || !normalizedEndB) {
    return false;
  }

  return normalizedStartA < normalizedEndB && normalizedEndA > normalizedStartB;
};

export const isEndTimeAfterStart = (startTime, endTime) =>
  Boolean(startTime && endTime && normalizeTime(endTime) > normalizeTime(startTime));

export const findCustomerByPhone = (customers = [], phone = "") => {
  const normalizedPhone = String(phone).trim();
  const normalizedDigits = normalizedPhone.replace(/\D/g, "");

  if (!normalizedPhone && !normalizedDigits) {
    return undefined;
  }

  return customers.find((customer) => {
    const customerPhone = String(customer.phone || "").trim();
    const customerDigits = customerPhone.replace(/\D/g, "");

    if (normalizedPhone && customerPhone === normalizedPhone) {
      return true;
    }

    if (normalizedDigits && customerDigits && customerDigits === normalizedDigits) {
      return true;
    }

    return false;
  });
};

export const resolveCustomerId = ({ createdCustomerResponse, customers = [], formCustomer }) => {
  const directId =
    createdCustomerResponse?.data?.result?.id ??
    createdCustomerResponse?.data?.result?.customerId ??
    createdCustomerResponse?.data?.id;

  if (directId != null) {
    return directId;
  }

  const byPhone = findCustomerByPhone(customers, formCustomer?.phone);
  if (byPhone?.id != null) {
    return byPhone.id;
  }

  const byIdentity = [...customers].reverse().find((item) => {
    const sameName = String(item.name || "").trim() === String(formCustomer?.name || "").trim();
    const sameEmail = String(item.email || "").trim() === String(formCustomer?.email || "").trim();

    return sameName && (sameEmail || !String(formCustomer?.email || "").trim());
  });

  return byIdentity?.id;
};

export const findCreatedReservationId = ({
  reservations = [],
  customerId,
  reservationDate,
  startTime,
  endTime,
}) => {
  const normalizedStart = normalizeTime(startTime);
  const normalizedEnd = normalizeTime(endTime);

  const matched = [...reservations].reverse().find(
    (item) =>
      item?.id != null &&
      Number(item.customerId) === Number(customerId) &&
      item.reservationDate === reservationDate &&
      normalizeTime(item.startTime) === normalizedStart &&
      normalizeTime(item.endTime) === normalizedEnd
  );

  return matched?.id;
};

export const filterAvailableTables = ({
  tables = [],
  reservation,
  reservationDetailHistory = [],
  currentReservationId,
}) => {
  if (!reservation) {
    return tables;
  }

  const selectedDate = reservation.reservationDate;
  const selectedStart = normalizeTime(reservation.startTime);
  const selectedEnd = normalizeTime(reservation.endTime);

  return tables.filter((table) => {
    if (table.status === "Inactive" || table.status === "Order" || (table.maxGuests || 0) <= 0) {
      return false;
    }

    if (!selectedDate || !selectedStart || !selectedEnd) {
      return true;
    }

    const conflicted = reservationDetailHistory.some((historyItem) => {
      if (Number(historyItem.reservationId) === Number(currentReservationId)) {
        return false;
      }

      if (historyItem.reservationDate !== selectedDate) {
        return false;
      }

      const hasTable = (historyItem.diningTableIds || []).includes(table.id);
      if (!hasTable) {
        return false;
      }

      return hasTimeOverlap(selectedStart, selectedEnd, historyItem.startTime, historyItem.endTime);
    });

    return !conflicted;
  });
};
