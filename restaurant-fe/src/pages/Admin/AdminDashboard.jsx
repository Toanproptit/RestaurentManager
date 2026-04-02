import { useState, useEffect } from "react";
import "../../styles/DashBoard.css";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import api from "../../service/api";
import { getTableStatistics } from "../../service/table";

// ── helpers ──────────────────────────────────────────────
const money = (v) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(v ?? 0);

const fmt = (n) =>
  n == null ? "—" : new Intl.NumberFormat("vi-VN").format(n);

// ── icon components (inline SVG, không cần thư viện) ─────
const IconOrders = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);
const IconRevenue = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" />
  </svg>
);
const IconReservation = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconFood = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 3.87 6 13 7 13s7-9.13 7-13c0-3.87-3.13-7-7-7z" />
  </svg>
);

// ── màu sắc card ─────────────────────────────────────────
const CARD_COLORS = [
  { bg: "#eef2ff", color: "#6366f1" },
  { bg: "#dcfce7", color: "#16a34a" },
  { bg: "#fff7ed", color: "#ea580c" },
  { bg: "#fce7f3", color: "#db2777" },
];

const BAR_SEGMENT_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6"];

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [topFoods, setTopFoods] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [tableStats, setTableStats] = useState({ total: 0, available: 0, occupied: 0, reserved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [summaryRes, topRes, monthlyRes, tablesRes] = await Promise.all([
          api.get("/reports/summary"),
          api.get("/foods/top-selling"),
          api.get("/reports/revenue/monthly"),
          getTableStatistics(),
        ]);
        setSummary(summaryRes?.data?.result ?? null);
        setTopFoods(topRes?.data?.result ?? []);
        setMonthlyRevenue(
          (monthlyRes?.data?.result ?? []).map((d) => ({
            label: `T${d.month}`,
            revenue: d.revenue ?? 0,
          }))
        );
        // Tính thống kê bàn từ danh sách trả về
        const statsData = tablesRes?.data?.result || {};
        setTableStats({
          total: statsData.total ?? 0,
          available: statsData.available ?? 0,
          occupied: statsData.order ?? 0,
          reserved: statsData.reserved ?? 0,
        });
      } catch (err) {
        console.error("Lỗi tải dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = [
    {
      icon: <IconOrders />,
      label: "Tổng đơn hàng",
      value: fmt(summary?.totalOrders),
      ...CARD_COLORS[0],
    },
    {
      icon: <IconRevenue />,
      label: "Tổng doanh thu",
      value: money(summary?.totalRevenue),
      ...CARD_COLORS[1],
    },
    {
      icon: <IconReservation />,
      label: "Tổng đặt bàn",
      value: fmt(summary?.totalReservations),
      ...CARD_COLORS[2],
    },
    {
      icon: <IconFood />,
      label: "Top món bán chạy",
      value: topFoods[0]?.foodName ?? "—",
      ...CARD_COLORS[3],
    },
  ];

  const maxSold = Math.max(...topFoods.map((f) => f.totalQuantitySold ?? 0), 1);

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <div className="dash-header">
        <div>
          <h2 className="dash-title">Tổng quan</h2>
          <p className="dash-subtitle">Chào mừng trở lại! Đây là tóm tắt hoạt động nhà hàng.</p>
        </div>
      </div>

      {/* ── KPI Stats ── */}
      <div className="stats">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <span
              className="stat-icon"
              style={{ background: s.bg, color: s.color }}
            >
              {s.icon}
            </span>
            <div>
              <p>{s.label}</p>
              <h3>{loading ? "..." : s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ── Body: Chart + Top Foods ── */}
      {/* <div className="dashboard-body"> */}
      {/* Left: Top 5 món bán chạy */}
      {/* <div className="orders-list">
          <div className="orders-header">
            <h3>🏆 Top 5 món bán chạy</h3>
          </div>

          {loading ? (
            <p className="dash-loading">Đang tải...</p>
          ) : topFoods.length === 0 ? (
            <p className="dash-empty">Chưa có dữ liệu</p>
          ) : (
            <div className="top-foods-list">
              {topFoods.map((food, idx) => (
                <div className="top-food-row" key={food.foodId}>
                  <div className="top-food-rank" style={{ background: BAR_SEGMENT_COLORS[idx] + "22", color: BAR_SEGMENT_COLORS[idx] }}>
                    #{idx + 1}
                  </div>
                  <div className="top-food-info">
                    <span className="top-food-name">{food.foodName}</span>
                    <div className="top-food-bar-wrap">
                      <div
                        className="top-food-bar"
                        style={{
                          width: `${Math.round(((food.totalQuantitySold ?? 0) / maxSold) * 100)}%`,
                          background: BAR_SEGMENT_COLORS[idx],
                        }}
                      />
                    </div>
                  </div>
                  <div className="top-food-meta">
                    <span className="top-food-sold">{fmt(food.totalQuantitySold)} phần</span>
                    <span className="top-food-revenue">{money(food.totalRevenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}

      {/* <div className="orders-list">
          <div className="orders-header">
            <h3>📈 Doanh thu theo tháng</h3>
            <span className="dash-badge">Năm hiện tại</span>
          </div>

          {loading ? (
            <p className="dash-loading">Đang tải...</p>
          ) : monthlyRevenue.length === 0 ? (
            <p className="dash-empty">Chưa có dữ liệu doanh thu</p>
          ) : (
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="dashRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    width={44}
                  />
                  <Tooltip
                    formatter={(v) => [money(v), "Doanh thu"]}
                    contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#dashRevenue)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#6366f1" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div> */}

      {/* ── Thống kê bàn ── */}
      <div className="orders-list">
        <div className="orders-header">
          <h3>🪑 Thống kê bàn</h3>
          <span className="dash-badge">Tổng: {loading ? "..." : tableStats.total} bàn</span>
        </div>

        {loading ? (
          <p className="dash-loading">Đang tải...</p>
        ) : (
          <div className="table-stats-grid">
            {[
              { label: "Trống", count: tableStats.available, color: "#16a34a", bg: "#dcfce7", emoji: "🟢" },
              { label: "Đang dùng", count: tableStats.occupied, color: "#ea580c", bg: "#fff7ed", emoji: "🔴" },
              { label: "Đã đặt", count: tableStats.reserved, color: "#2563eb", bg: "#eff6ff", emoji: "🔵" },
              {
                label: "Tỉ lệ lấp đầy",
                count: tableStats.total > 0
                  ? `${Math.round(((tableStats.occupied + tableStats.reserved) / tableStats.total) * 100)}%`
                  : "0%",
                color: "#7c3aed",
                bg: "#f5f3ff",
                emoji: "📊",
              },
            ].map((item) => (
              <div className="table-stat-card" key={item.label} style={{ background: item.bg }}>
                <span className="table-stat-emoji">{item.emoji}</span>
                <div className="table-stat-info">
                  <p className="table-stat-label">{item.label}</p>
                  <h4 className="table-stat-value" style={{ color: item.color }}>{item.count}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}