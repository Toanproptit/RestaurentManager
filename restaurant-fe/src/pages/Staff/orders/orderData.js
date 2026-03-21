export const categories = ["All", "Main", "Rice", "Drink", "Premium"];
export const quickDiscounts = [0, 30000, 50000, 100000];

export const statusTone = {
  Available: "available",
  Reserved: "reserved",
  Order: "order",
  Inactive: "inactive",
};

export function formatCurrency(value) {
  return `${Number(value).toLocaleString("vi-VN")} đ`;
}
