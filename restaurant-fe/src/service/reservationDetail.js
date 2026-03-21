import api from "./api";

export const createReservationDetail = (data) =>
  api.post("/reservation-details", data);
export const getReservationDetails = () => api.get("/reservation-details");
export const getReservationDetailById = (id) => api.get(`/reservation-details/${id}`);
export const updateReservationDetail = (id, data) =>
  api.put(`/reservation-details/${id}`, data);
export const deleteReservationDetail = (id) =>
  api.delete(`/reservation-details/${id}`);
