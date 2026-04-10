import api from "./api";

export const getRevenueByDay = async () => {
  return await api.get("/reports/revenue/daily");
};

export const getRevenueByMonth = async () => {
  return await api.get("/reports/revenue/monthly");
};

export const getRevenueByYear = async () => {
  return await api.get("/reports/revenue/yearly");
};

export const getTopSellingFoods = async () => {
  return await api.get("/foods/top-selling");
};

export const getOrderCountByFood = async (date, month, year) => {
  const params = {};
  if (date) params.date = date;
  if (month) params.month = month;
  if (year) params.year = year;

  return await api.get("/reports/order-count-by-food", { params });
};
