import { useState, useEffect } from "react";
import "../../styles/DashBoard.css";
import api from "../../service/api";
import { getTableStatistics } from "../../service/table";

// ── icon components ─────
const IconOrders = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);
const IconReservation = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const IconTable = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 12H3" />
    <path d="M8 12v6" />
    <path d="M16 12v6" />
  </svg>
);

const fmt = (n) => (n == null ? "—" : new Intl.NumberFormat("vi-VN").format(n));
const money = (v) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(v ?? 0);

const CARD_COLORS = [
  { bg: "#eef2ff", color: "#6366f1" },
  { bg: "#fff7ed", color: "#ea580c" },
  { bg: "#dcfce7", color: "#16a34a" },
  { bg: "#fce7f3", color: "#db2777" },
];

const BAR_SEGMENT_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6"];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [topFoods, setTopFoods] = useState([]);
  const [tableStats, setTableStats] = useState({ total: 0, available: 0, occupied: 0, reserved: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [summaryRes, topRes, tablesRes] = await Promise.allSettled([
          api.get("/reports/summary"),
          api.get("/foods/top-selling"),
          getTableStatistics(),
        ]);

        setSummary(summaryRes.status === "fulfilled" ? summaryRes.value?.data?.result ?? null : null);
        setTopFoods(topRes.status === "fulfilled" ? topRes.value?.data?.result ?? [] : []);

        const statsData = tablesRes.status === "fulfilled" ? tablesRes.value?.data?.result || {} : {};
        setTableStats({
          total: statsData.total ?? 0,
          available: statsData.available ?? 0,
          occupied: statsData.order ?? 0,
          reserved: statsData.reserved ?? 0,
        });
      } catch (err) {
        console.error("Lỗi tải dashboard staff:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const stats = [
    {
      icon: <IconOrders />,
      label: "Tổng đơn hàng (Toàn hệ thống)",
      value: fmt(summary?.totalOrders),
      ...CARD_COLORS[0],
    },
    {
      icon: <IconReservation />,
      label: "Tổng đặt bàn",
      value: fmt(summary?.totalReservations),
      ...CARD_COLORS[1],
    },
    {
      icon: <IconTable />,
      label: "Bàn trống hiện tại",
      value: fmt(tableStats.available),
      ...CARD_COLORS[2],
    },
    {
      icon: <IconTable />,
      label: "Bàn đang phục vụ",
      value: fmt(tableStats.occupied),
      ...CARD_COLORS[3],
    },
  ];

  const maxSold = Math.max(...topFoods.map((f) => f.totalQuantitySold ?? 0), 1);

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <h2 className="dash-title">Tổng quan nhân viên</h2>
          <p className="dash-subtitle">Theo dõi trạng thái bàn và các món đang hot để tư vấn cho khách.</p>
        </div>
      </div>

      <div className="stats">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <span className="stat-icon" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </span>
            <div>
              <p>{s.label}</p>
              <h3>{loading ? "..." : s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-body">
        {/* Left: Top 5 món bán chạy */}
        {/* <div className="orders-list">
          <div className="orders-header">
            <h3>🏆 Gợi ý món hot (Top 5)</h3>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}

        {/* Right: Thống kê bàn */}
        <div className="orders-list">
          <div className="orders-header">
            <h3>🪑 Tình trạng bàn trực tiếp</h3>
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
    </div>
  );
}
