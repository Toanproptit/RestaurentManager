import api from "./api";

export const createReservation = (data) => api.post("/reservations", data);
export const getReservations = (page = 0, size = 10) =>
  api.get(`/reservations?page=${page}&size=${size}`);
export const getReservationById = (id) => api.get(`/reservations/${id}`);
export const updateReservation = (id, data) => api.put(`/reservations/${id}`, data);
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);
