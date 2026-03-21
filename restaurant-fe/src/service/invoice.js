import api from "./api";

export const createInvoiceForOrder = async (orderId, data) => {
  return await api.post(`/invoices/order/${orderId}`, data);
};
