import api from "./api";

export const addOrderDetail = async (orderId, foodId, quantity) => {
  return await api.post(`/orders/${orderId}/details?foodId=${foodId}`, { quantity });
};

export const updateOrderDetail = async (orderId, detailId, foodId, quantity) => {
  return await api.put(`/orders/${orderId}/details/${detailId}?foodId=${foodId}`, { quantity });
};

export const removeOrderDetail = async (orderId, detailId) => {
  return await api.delete(`/orders/${orderId}/details/${detailId}`);
};
