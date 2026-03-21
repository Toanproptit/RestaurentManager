import api from "./api";

export const createTable = (data) => api.post("/dining-tables", data);
export const updateTable = (id, data) => api.put(`/dining-tables/${id}`, data);
export const deleteTable = (id) => api.delete(`/dining-tables/${id}`);
export const getTableById = (id) => api.get(`/dining-tables/${id}`);
export const getTables = (page, size) => api.get(`/dining-tables?page=${page}&size=${size}`);
