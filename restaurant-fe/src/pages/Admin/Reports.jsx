import { useState, useEffect, useMemo } from "react";
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
  Cell,
} from "recharts";
import {
  getRevenueByDay,
  getRevenueByMonth,
  getRevenueByYear,
  getTopSellingFoods,
  getOrderCountByFood,
} from "../../service/report";

const money = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const BAR_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6"];

const MODES = [
  { key: "year", label: "Năm" },
  { key: "month", label: "Tháng" },
  { key: "day", label: "Ngày" },
];

export default function Reports() {
  const [mode, setMode] = useState("month");
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [topFoods, setTopFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  // New state for order count by food
  const [filterMode, setFilterMode] = useState("day"); // day, month, year
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(today.getMonth() + 1).padStart(2, "0"));
  const [selectedYear, setSelectedYear] = useState(String(today.getFullYear()));
  const [orderCountData, setOrderCountData] = useState([]);
  const [orderCountLoading, setOrderCountLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [dayRes, monthRes, yearRes, topRes] = await Promise.all([
          getRevenueByDay(),
          getRevenueByMonth(),
          getRevenueByYear(),
          getTopSellingFoods(),
        ]);
        setDailyData(dayRes?.data?.result ?? []);
        setMonthlyData(monthRes?.data?.result ?? []);
        setYearlyData(yearRes?.data?.result ?? []);
        setTopFoods(topRes?.data?.result ?? []);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu báo cáo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Fetch order count data when date/month/year changes
  useEffect(() => {
    const fetchOrderCount = async () => {
      setOrderCountLoading(true);
      try {
        let res;
        if (filterMode === "day") {
          res = await getOrderCountByFood(selectedDate, null, null);
        } else if (filterMode === "month") {
          res = await getOrderCountByFood(null, parseInt(selectedMonth), parseInt(selectedYear));
        } else {
          res = await getOrderCountByFood(null, null, parseInt(selectedYear));
        }
        setOrderCountData(res?.data?.result ?? []);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu đặt hàng:", err);
        setOrderCountData([]);
      } finally {
        setOrderCountLoading(false);
      }
    };
    fetchOrderCount();
  }, [selectedDate, selectedMonth, selectedYear, filterMode]);

  // Chuyển đổi data thành format phù hợp với biểu đồ theo từng mode
  const chartData = useMemo(() => {
    if (mode === "year") {
      return yearlyData.map((item) => ({
        label: `${item.year}`,
        revenue: item.revenue ?? 0,
      }));
    }
    if (mode === "month") {
      return monthlyData.map((item) => ({
        label: `T${item.month}/${item.year}`,
        revenue: item.revenue ?? 0,
      }));
    }
    // day
    return dailyData.map((item) => ({
      label: `${item.day}/${item.month}/${item.year}`,
      revenue: item.revenue ?? 0,
    }));
  }, [mode, dailyData, monthlyData, yearlyData]);

  const totalRevenue = useMemo(
    () => chartData.reduce((sum, d) => sum + d.revenue, 0),
    [chartData]
  );

  const avgRevenue = chartData.length > 0 ? totalRevenue / chartData.length : 0;

  const topFoodsChart = topFoods.map((f) => ({
    name: f.foodName,
    sold: f.totalQuantitySold ?? 0,
    revenue: f.totalRevenue ?? 0,
  }));

  const totalOrderCount = useMemo(
    () => orderCountData.reduce((sum, item) => sum + (item.orderCount ?? 0), 0),
    [orderCountData]
  );

  const chartTitle =
    mode === "year"
      ? "Doanh thu theo năm"
      : mode === "month"
        ? "Doanh thu theo tháng"
        : "Doanh thu theo ngày";

  return (
    <div className="reports-page">
      <div className="reports-head">
        <h2 className="reports-title">Báo cáo doanh thu</h2>
        <div className="reports-filter">
          {MODES.map((m) => (
            <button
              key={m.key}
              className={mode === m.key ? "active" : ""}
              onClick={() => setMode(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="reports-kpis">
        <div className="kpi-card">
          <p>Tổng doanh thu</p>
          <h3>{loading ? "—" : money(totalRevenue)}</h3>
        </div>
        <div className="kpi-card">
          <p>Số kỳ có dữ liệu</p>
          <h3>{loading ? "—" : chartData.length}</h3>
        </div>
        <div className="kpi-card">
          <p>
            {mode === "year"
              ? "Doanh thu TB / năm"
              : mode === "month"
                ? "Doanh thu TB / tháng"
                : "Doanh thu TB / ngày"}
          </p>
          <h3>{loading ? "—" : money(avgRevenue)}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="reports-grid">
        {/* Revenue chart */}
        <div className="chart-card large">
          <div className="chart-header">
            <h3>{chartTitle}</h3>
            <span>{chartData.length} điểm dữ liệu</span>
          </div>

          <div className="chart-wrap">
            {loading ? (
              <div className="reports-loading">Đang tải dữ liệu...</div>
            ) : chartData.length === 0 ? (
              <div className="reports-empty">Chưa có dữ liệu doanh thu</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    interval={mode === "day" ? "preserveStartEnd" : 0}
                    angle={mode === "day" ? -30 : 0}
                    textAnchor={mode === "day" ? "end" : "middle"}
                    height={mode === "day" ? 48 : 30}
                  />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                    width={50}
                  />
                  <Tooltip
                    formatter={(value) => [money(value), "Doanh thu"]}
                    labelFormatter={(label) => label}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#16a34a"
                    strokeWidth={3}
                    fill="url(#colorRevenue)"
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top items chart */}
        {/* <div className="chart-card">
          <div className="chart-header">
            <h3>Top 5 món bán chạy</h3>
            <span>theo số lượng</span>
          </div>

          <div className="chart-wrap">
            {loading ? (
              <div className="reports-loading">Đang tải dữ liệu...</div>
            ) : topFoodsChart.length === 0 ? (
              <div className="reports-empty">Chưa có dữ liệu</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topFoodsChart}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value, name) =>
                      name === "sold"
                        ? [`${value} phần`, "Đã bán"]
                        : [money(value), "Doanh thu"]
                    }
                  />
                  <Bar dataKey="sold" radius={[0, 6, 6, 0]}>
                    {topFoodsChart.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div> */}
      </div>

      {/* Order Count Section */}
      <div className="reports-section-divider"></div>

      <div className="reports-order-count-head">
        <h2 className="reports-title">Thống kê số lượng món ăn</h2>
        <div className="filter-mode-buttons">
          <button
            className={filterMode === "day" ? "active" : ""}
            onClick={() => setFilterMode("day")}
          >
            Ngày
          </button>
          <button
            className={filterMode === "month" ? "active" : ""}
            onClick={() => setFilterMode("month")}
          >
            Tháng
          </button>
          <button
            className={filterMode === "year" ? "active" : ""}
            onClick={() => setFilterMode("year")}
          >
            Năm
          </button>
        </div>
      </div>

      {/* Date/Month/Year Picker */}
      <div className="date-filter-wrapper">
        {filterMode === "day" && (
          <div className="date-picker-wrapper">
            <label htmlFor="order-date-picker">Chọn ngày:</label>
            <input
              id="order-date-picker"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-picker-input"
            />
          </div>
        )}

        {filterMode === "month" && (
          <div className="month-year-picker-wrapper">
            <div className="month-picker-wrapper">
              <label htmlFor="order-month-picker">Tháng:</label>
              <select
                id="order-month-picker"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="month-year-picker-input"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={String(m).padStart(2, "0")}>
                    Tháng {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="year-picker-wrapper">
              <label htmlFor="order-year-picker-month">Năm:</label>
              <input
                id="order-year-picker-month"
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="month-year-picker-input"
                min="2000"
                max="2099"
              />
            </div>
          </div>
        )}

        {filterMode === "year" && (
          <div className="year-only-picker-wrapper">
            <label htmlFor="order-year-picker">Năm:</label>
            <input
              id="order-year-picker"
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="month-year-picker-input"
              min="2000"
              max="2099"
            />
          </div>
        )}
      </div>

      {/* Order Count KPI */}
      <div className="reports-kpis">
        <div className="kpi-card">
          <p>Tổng số lượng order</p>
          <h3>{orderCountLoading ? "—" : totalOrderCount}</h3>
        </div>
        <div className="kpi-card">
          <p>Số loại món ăn</p>
          <h3>{orderCountLoading ? "—" : orderCountData.length}</h3>
        </div>
      </div>

      {/* Order Count Table */}
      <div className="chart-card">
        <div className="chart-header">
          <h3>Chi tiết số lượng từng món ăn</h3>
          <span>
            {filterMode === "day"
              ? selectedDate
              : filterMode === "month"
                ? `T${selectedMonth}/${selectedYear}`
                : selectedYear}
          </span>
        </div>

        <div className="food-count-table-wrapper">
          {orderCountLoading ? (
            <div className="reports-loading">Đang tải dữ liệu...</div>
          ) : orderCountData.length === 0 ? (
            <div className="reports-empty">Chưa có dữ liệu đặt hàng</div>
          ) : (
            <table className="food-count-table">
              <thead>
                <tr>
                  <th>Tên Món Ăn</th>
                  <th>Số Lượng</th>
                </tr>
              </thead>
              <tbody>
                {orderCountData.map((item, index) => (
                  <tr key={item.foodId || index}>
                    <td>{item.foodName}</td>
                    <td className="order-count-cell">{item.orderCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}