import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockStaffs } from "../../auth/MockStaff";
import "../../styles/StaffManagement.css";

const ITEMS_PER_PAGE = 6;

export default function Staffs() {
  const navigate = useNavigate();

  const [staffs, setStaffs] = useState(mockStaffs);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    status: "Active",
  });

  const totalPages = Math.max(1, Math.ceil(staffs.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentStaffs = staffs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

    const updatedStaffs = [...staffs, staffToAdd];
    setStaffs(updatedStaffs);
    setCurrentPage(Math.ceil(updatedStaffs.length / ITEMS_PER_PAGE));
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

      <div className="staff-toolbar">
        <p>
          Showing {staffs.length === 0 ? 0 : startIndex + 1}-
          {Math.min(startIndex + ITEMS_PER_PAGE, staffs.length)} of {staffs.length}
          {" "}
          users
        </p>
      </div>

      <div className="staff-list">
        {currentStaffs.map((staff) => (
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

      <div className="pagination">
        <button
          type="button"
          className="pagination-button"
          onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <div className="pagination-pages">
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                type="button"
                className={`pagination-button ${
                  currentPage === page ? "active-page" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="pagination-button"
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
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