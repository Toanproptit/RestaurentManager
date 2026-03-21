import api from "./api";

export const getOrders = async (page = 0, size = 10) => {
  return await api.get(`/orders?page=${page}&size=${size}`);
};

export const getOrderById = async (id) => {
  return await api.get(`/orders/${id}`);
};

export const createOrder = async (data) => {
  return await api.post("/orders", data);
};

export const updateOrder = async (id, data) => {
  return await api.put(`/orders/${id}`, data);
};

export const deleteOrder = async (id) => {
  return await api.delete(`/orders/${id}`);
};
