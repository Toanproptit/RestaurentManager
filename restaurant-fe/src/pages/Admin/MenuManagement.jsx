import React, { useCallback, useEffect, useState } from "react";
import "../../styles/StaffManagement.css";
import { createFood, updateFood as updateFoodApi, getFood, deleteFood as deleteFoodApi, searchFood } from "../../service/food";

const API_URL = "http://localhost:8080";

const initialForm = {
  name: "",
  description: "",
  price: "",
  imageFile: null,
  imagePreview: "",
};

export default function MenuManagement() {
  const [menus, setMenus] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(initialForm);
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
        res = await searchFood(currentQuery, currentPage, 6);
      } else {
        res = await getFood(currentPage, 6);
      }
      if (res?.status === 200) {
        const data = res.data.result;
        setMenus(data.content || []);
        setTotalPages(data.totalPages || 0);
        setPage(currentPage);
      }
    } catch (error) {
      console.error("Load menu error:", error);
      alert("Không thể tải danh sách menu");
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Load data on mount
  useEffect(() => {
    loadMenu(0, query);
  }, [loadMenu, query]);



  const resetForm = useCallback(() => {
    setForm(initialForm);
    setEditingItem(null);
    setShowModal(false);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Giới hạn: 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  }, []);

  const validateForm = () => {
    if (!form.name.trim()) {
      alert("Vui lòng nhập tên món ăn");
      return false;
    }

    if (!form.price || Number(form.price) <= 0) {
      alert("Vui lòng nhập giá hợp lệ");
      return false;
    }

    return true;
  };

  // Build full image URL from server path
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (editingItem) {
        // Update existing food
        const res = await updateFoodApi(editingItem.id, {
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          imageFile: form.imageFile,
        });

        if (res?.status === 200 || res?.status === 201) {
          const updatedFood = res.data.result;
          setMenus((prev) =>
            prev.map((item) => (item.id === editingItem.id ? updatedFood : item))
          );
          alert("Cập nhật món ăn thành công");
        } else {
          alert("Cập nhật món ăn thất bại");
        }
      } else {
        // Create new food
        const res = await createFood({
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          imageFile: form.imageFile,
        });

        if (res?.status === 200 || res?.status === 201) {
          const newFood = res.data.result;
          setMenus((prev) => [...prev, newFood]);
          alert("Thêm món ăn thành công");
        } else {
          alert("Thêm món ăn thất bại");
        }
      }

      resetForm();
      loadMenu(page); // Reload data after save
    } catch (error) {
      console.error("Save food error:", error);
      alert("Có lỗi xảy ra khi lưu món ăn");
    } finally {
      setLoading(false);
    }
  }, [form, editingItem, resetForm]);

  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setForm({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      imageFile: null,
      imagePreview: item.image ? getImageUrl(item.image) : "",
    });
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa món ăn này?");
    if (!confirmDelete) return;

    try {
      await deleteFoodApi(id);
      setMenus((prev) => prev.filter((item) => item.id !== id));
      alert("Xóa món ăn thành công");
    } catch (error) {
      console.error("Delete food error:", error);
      alert("Có lỗi xảy ra khi xóa món ăn");
    }
  }, []);

  return (
    <div className="staff-container">
      <h2>Menu Management</h2>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button
          className="add-btn"
          onClick={() => {
            setEditingItem(null);
            setForm(initialForm);
            setShowModal(true);
          }}
          style={{ marginBottom: 0 }}
        >
          + Add Menu Item
        </button>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Search food by name..."
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
            Search
          </button>
        </div>
      </div>

      <div className="staff-list">
        {menus.map((item) => (
          <div key={item.id} className="staff-card">
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <img
                src={getImageUrl(item.image) || "https://via.placeholder.com/100x100?text=No+Image"}
                alt={item.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                }}
              />

              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>{Number(item.price).toLocaleString()} VND</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</h3>

            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              rows="3"
              value={form.description}
              onChange={handleChange}
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {form.imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={form.imagePreview}
                  alt="Preview"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                  }}
                />
              </div>
            )}

            <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
              <button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button onClick={resetForm} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}