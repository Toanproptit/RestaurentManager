import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockStaffs } from "../../auth/MockStaff";
import "../../styles/StaffManagement.css";

export default function Staffs() {
  const navigate = useNavigate();

  const [staffs, setStaffs] = useState(mockStaffs);
  const [showModal, setShowModal] = useState(false);

  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    status: "Active",
  });

  const handleView = (id) => {
    navigate(`/admin/staffs/${id}`);
  };

  // Mở modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Lưu nhân viên mới
  const handleSave = () => {
    const staffToAdd = {
      id: Date.now().toString(),
      ...newStaff,
    };

    setStaffs([...staffs, staffToAdd]);
    setShowModal(false);

    // reset form
    setNewStaff({
      name: "",
      email: "",
      status: "Active",
    });
  };

  return (
    <div className="staff-container">
      <h2>Staff Management</h2>

      <button onClick={handleOpenModal} style={{ marginBottom: "20px" }}>
        + Add Staff
      </button>

      <div className="staff-list">
        {staffs.map((staff) => (
          <div key={staff.id} className="staff-card">
            <div>
              <h3>{staff.name}</h3>
              <p>{staff.email}</p>

              <span
                className={`status ${
                  staff.status === "Active" ? "active" : "inactive"
                }`}
              >
                {staff.status}
              </span>
            </div>

            <button onClick={() => handleView(staff.id)}>
              View Detail
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Staff</h3>

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

            <select
              value={newStaff.status}
              onChange={(e) =>
                setNewStaff({ ...newStaff, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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