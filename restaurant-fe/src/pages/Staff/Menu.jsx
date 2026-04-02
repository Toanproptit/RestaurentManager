import React, { useCallback, useEffect, useState } from "react";
import "../../styles/StaffManagement.css";
import { getFood, searchFood } from "../../service/food";

const API_URL = "http://localhost:8080";

export default function StaffMenuView() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [query, setQuery] = useState("");

  // Load menu data from API
  const loadMenu = useCallback(async (currentPage = 0, currentQuery = query) => {
    try {
      setLoading(true);
      let res;
      if (currentQuery) {
        res = await searchFood(currentQuery, currentPage, 12);
      } else {
        res = await getFood(currentPage, 12);
      }
      if (res?.status === 200) {
        const data = res.data.result;
        setMenus(data.content || []);
        setTotalPages(data.totalPages || 0);
        setPage(currentPage);
      }
    } catch (error) {
      console.error("Load menu error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadMenu(0, query);
  }, [loadMenu, query]);

  // Build full image URL from server path
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  return (
    <div className="staff-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Thực đơn quán</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Tìm món ăn..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setQuery(searchName);
                loadMenu(0, searchName);
              }
            }}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", minWidth: "250px" }}
          />
          <button
            onClick={() => {
              setQuery(searchName);
              loadMenu(0, searchName);
            }}
            style={{ padding: "8px 16px", background: "#ea580c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      <div className="staff-list">
        {loading ? (
          <p>Đang tải thực đơn...</p>
        ) : menus.length === 0 ? (
          <p>Chưa có món ăn nào.</p>
        ) : (
          menus.map((item) => (
            <div key={item.id} className="staff-card" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <img
                src={getImageUrl(item.image) || "https://via.placeholder.com/100x100?text=No+Image"}
                alt={item.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  flexShrink: 0
                }}
              />

              <div>
                <h3 style={{ margin: "0 0 4px 0" }}>{item.name}</h3>
                <p style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "14px" }}>
                  {item.description || "Không có mô tả"}
                </p>
                <p style={{ margin: 0, fontWeight: "bold", color: "#ea580c" }}>
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price || 0)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: "20px" }}>
          <button
            className="pagination-button"
            disabled={page === 0}
            onClick={() => loadMenu(page - 1, query)}
          >
            ← Trước
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`pagination-button ${page === i ? "active-page" : ""}`}
                onClick={() => loadMenu(i, query)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            className="pagination-button"
            disabled={page === totalPages - 1}
            onClick={() => loadMenu(page + 1, query)}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}