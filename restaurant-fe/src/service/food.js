import api from "./api";

export const createFood = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    if (data.description) {
        formData.append("description", data.description);
    }
    if (data.imageFile) {
        formData.append("image", data.imageFile);
    }
    return api.post("/foods", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const updateFood = (id, data) => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.price) formData.append("price", data.price);
    if (data.imageFile) {
        formData.append("image", data.imageFile);
    }
    return api.put(`/foods/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const deleteFood = (id) => api.delete(`/foods/${id}`);
export const getFoodById = (id) => api.get(`/foods/${id}`);
export const getFood = (page, size) => api.get(`/foods?page=${page}&size=${size}`);
export const searchFood = (name, page, size) => api.get(`/foods/search?name=${encodeURIComponent(name)}&page=${page}&size=${size}`);