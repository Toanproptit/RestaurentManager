import React from "react";
import { useParams, Link, Outlet, useNavigate } from "react-router-dom";
import { mockStaffs } from "../../auth/MockStaff";

export default function StaffDetail() {
  const { staffId } = useParams();
  const navigate = useNavigate();

  const staff = mockStaffs.find((s) => s.id === staffId);

  if (!staff) return <p>Staff not found</p>;

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    // Xóa khỏi mockStaffs (chỉ demo, không realtime)
    const index = mockStaffs.findIndex((s) => s.id === staffId);
    if (index !== -1) {
      mockStaffs.splice(index, 1);
    }

    navigate("/admin/staffs");
  };

  return (
    <div>
      <h2>{staff.name}</h2>
      <p>Email: {staff.email}</p>
      <p>Status: {staff.status}</p>

      {/* Nút xóa */}
      <button
        onClick={handleDelete}
        style={{ marginTop: "20px", background: "red", color: "white" }}
      >
        Delete Staff
      </button>

      <Outlet />
    </div>
  );
}