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
