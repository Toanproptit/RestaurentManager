import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, createUser, updateUser, deleteUser } from "../../service/user";
import "../../styles/StaffManagement.css";

const ITEMS_PER_PAGE = 6;

export default function Staffs() {
  const navigate = useNavigate();

  const [staffs, setStaffs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const emptyStaff = {
    name: "",
    email: "",
    password: "",
    role: "STAFF"
  };

  const [newStaff, setNewStaff] = useState(emptyStaff);

  const loadStaffs = useCallback(async (currentPage = 0) => {
    try {
      const res = await getUsers(currentPage, 6);
      if (res?.status === 200) {
        const data = res.data.result;
        setStaffs(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setPage(currentPage);
      }
    } catch (error) {
      console.error("Load staff error:", error);
      alert("Không thể tải danh sách nhân viên");
    }
  }, []);

  useEffect(() => {
    loadStaffs(0);
  }, [loadStaffs]);

  const handleView = (id) => {
    navigate(`/admin/staffs/${id}`);
  };

  const handleOpenModal = () => {
    setEditingStaff(null);
    setNewStaff(emptyStaff);
    setShowModal(true);
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setNewStaff({
      name: staff.name,
      email: staff.email,
      password: "", // Don't pre-fill password for security/API reasons
      role: staff.role
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingStaff(null);
    setNewStaff(emptyStaff);
    setShowModal(false);
  };

  const handleSave = async () => {
    if (!newStaff.name.trim() || !newStaff.email.trim()) {
      alert("Vui lòng nhập tên và email.");
      return;
    }

    try {
      if (editingStaff) {
        await updateUser(editingStaff.id, newStaff);
        alert("Cập nhật nhân viên thành công");
      } else {
        await createUser(newStaff);
        alert("Thêm nhân viên thành công");
      }
      handleCloseModal();
      loadStaffs(page);
    } catch (error) {
      console.error("Save staff error:", error);
      alert("Có lỗi xảy ra khi lưu nhân viên");
    }
  };

  const handleDelete = async (staffId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa nhân viên này?");
    if (confirmDelete) {
      try {
        await deleteUser(staffId);
        alert("Xóa nhân viên thành công");
        loadStaffs(page);
      } catch (error) {
        console.error("Delete staff error:", error);
        alert("Có lỗi xảy ra khi xóa nhân viên");
      }
    }
  };

  return (
    <div className="staff-container">
      <h2>Staff Management</h2>

      <button onClick={handleOpenModal} style={{ marginBottom: "20px", width: "14%" }}>
        + Add Staff
      </button>

      <div className="staff-toolbar">
        <p>
          Showing {staffs.length === 0 ? 0 : page * 6 + 1}-
          {Math.min((page + 1) * 6, totalElements)} of {totalElements} users
        </p>
      </div>

      <div className="staff-list">
        {staffs.map((staff) => (
          <div key={staff.id} className="staff-card">
            <div>
              <h3>{staff.name}</h3>

              {staff.role && (
                <span className="status active">
                  {staff.role}
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <button
                onClick={() => handleView(staff.id)}
                style={{ backgroundColor: "#22c55e" }}
              >
                View
              </button>
              <button
                onClick={() => handleEdit(staff)}
                style={{ backgroundColor: "#22c55e" }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            disabled={page === 0}
            onClick={() => loadStaffs(page - 1)}
          >
            ← Trước
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`pagination-button ${page === i ? "active-page" : ""}`}
                onClick={() => loadStaffs(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            className="pagination-button"
            disabled={page === totalPages - 1}
            onClick={() => loadStaffs(page + 1)}
          >
            Sau →
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingStaff ? "Edit Staff" : "Add New Staff"}</h3>

            <input
              type="text"
              placeholder="Name"
              value={newStaff.name}
              onChange={(e) =>
                setNewStaff({ ...newStaff, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={newStaff.email}
              onChange={(e) =>
                setNewStaff({ ...newStaff, email: e.target.value })
              }
            />

            {!editingStaff && (
              <input
                type="password"
                placeholder="Mật khẩu khởi tạo"
                value={newStaff.password}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, password: e.target.value })
                }
              />
            )}

            <select
              value={newStaff.role}
              onChange={(e) =>
                setNewStaff({ ...newStaff, role: e.target.value })
              }
            >
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>

            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}