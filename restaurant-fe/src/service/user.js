import api from "./api";

export const createUser = (data) => api.post("/users", data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const getUserById = (id) => api.get(`/users/${id}`);
export const getUsers = (page, size) => api.get(`/users?page=${page}&size=${size}`);
export const getMe = () => api.get("/users/me");
