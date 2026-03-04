import "../../styles/Report.css";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const revenueData = [
  { month: "T1", revenue: 12500000, orders: 120 },
  { month: "T2", revenue: 14800000, orders: 135 },
  { month: "T3", revenue: 13200000, orders: 128 },
  { month: "T4", revenue: 17600000, orders: 160 },
  { month: "T5", revenue: 19800000, orders: 172 },
  { month: "T6", revenue: 18500000, orders: 168 },
  { month: "T7", revenue: 22100000, orders: 190 },
  { month: "T8", revenue: 20900000, orders: 181 },
  { month: "T9", revenue: 23800000, orders: 205 },
  { month: "T10", revenue: 25200000, orders: 218 },
  { month: "T11", revenue: 24100000, orders: 210 },
  { month: "T12", revenue: 27900000, orders: 235 },
];

const topItems = [
  { name: "Mì cay hải sản", sold: 320 },
  { name: "Mì bò", sold: 280 },
  { name: "Cơm chiên", sold: 245 },
  { name: "Gà sốt cay", sold: 210 },
  { name: "Trà đào", sold: 190 },
];

const money = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export default function Reports() {
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="reports-page">
      <div className="reports-head">
        <h2 className="reports-title">Reports</h2>

        <div className="reports-filter">
          <button className="active">Năm</button>
          <button>Tháng</button>
          <button>Tuần</button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="reports-kpis">
        <div className="kpi-card">
          <p>Tổng doanh thu</p>
          <h3>{money(totalRevenue)}</h3>
        </div>
        <div className="kpi-card">
          <p>Tổng đơn hàng</p>
          <h3>{totalOrders}</h3>
        </div>
        <div className="kpi-card">
          <p>Giá trị TB / đơn</p>
          <h3>{money(avgOrderValue)}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="reports-grid">
        {/* Revenue chart */}
        <div className="chart-card large">
          <div className="chart-header">
            <h3>Biểu đồ doanh thu theo tháng</h3>
            <span>2026</span>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                  width={45}
                />
                <Tooltip
                  formatter={(value) => [money(value), "Doanh thu"]}
                  labelFormatter={(label) => `Tháng ${label.replace("T", "")}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top items chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Món bán chạy</h3>
          </div>

          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topItems} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => [`${value} món`, "Đã bán"]} />
                <Bar dataKey="sold" fill="#2563eb" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}