import React, { useState, useEffect, useCallback } from "react";
import { createTable, updateTable, getTables, deleteTable } from "../../service/table";
import "../../styles/TableManagement.css";

const emptyTable = {
  name: "",
  description: "",
  maxGuests: 4,
  area: "",
  status: "Available",
};

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [tableForm, setTableForm] = useState(emptyTable);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadTable = useCallback(async (currentPage = 0) => {
    try {
      const res = await getTables(currentPage, 3);
      if (res?.status === 200) {
        const data = res.data.result;
        setTables(data.content || []);
        setTotalPages(data.totalPages || 0);
        setPage(currentPage);
      }
    } catch (error) {
      console.error("Load table error:", error);
      alert("Không thể tải danh sách bàn");
    }
  }, []);

  useEffect(() => {
    loadTable(0);
  }, [loadTable]);

  const resetForm = () => {
    setEditingTable(null);
    setTableForm(emptyTable);
    setShowModal(false);
  };

  const handleOpenCreate = () => {
    setEditingTable(null);
    setTableForm(emptyTable);
    setShowModal(true);
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setTableForm({
      name: table.name,
      description: table.description,
      maxGuests: table.maxGuests,
      area: table.area,
      status: table.status,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!tableForm.name.trim() || !tableForm.area.trim()) {
      window.alert("Please enter table name and area.");
      return;
    }

    try {
      if (editingTable) {
        await updateTable(editingTable.id, {
          name: tableForm.name,
          description: tableForm.description,
          maxGuests: Number(tableForm.maxGuests),
          area: tableForm.area,
          status: tableForm.status
        });
        alert("Cập nhật bàn thành công");
      } else {
        await createTable({
          name: tableForm.name,
          description: tableForm.description,
          maxGuests: Number(tableForm.maxGuests),
          area: tableForm.area,
          status: tableForm.status
        });
        alert("Thêm bàn thành công");
      }
      resetForm();
      loadTable(page);
    } catch (error) {
      console.error("Save table error:", error);
      alert("Có lỗi xảy ra khi lưu bàn");
    }
  };

  const handleDelete = async (tableId) => {
    const confirmDelete = window.confirm("Delete this table?");
    if (confirmDelete) {
      try {
        await deleteTable(tableId);
        alert("Xóa bàn thành công");
        loadTable(page);
      } catch (error) {
        console.error("Delete table error:", error);
        alert("Có lỗi xảy ra khi xóa bàn");
      }
    }
  };

  const availableCount = tables.filter((table) => table.status === "Available").length;
  const reservedCount = tables.filter((table) => table.status === "Reserved").length;
  const orderCount = tables.filter((table) => table.status === "Order").length;

  return (
    <div className="table-management-page">
      <div className="table-management-head">

        <button className="table-primary-btn" onClick={handleOpenCreate}>
          + Add Table
        </button>
      </div>

      <div className="table-overview-grid">
        <div className="table-overview-card">
          <span>Total Tables</span>
          <strong>{tables.length}</strong>
        </div>
        <div className="table-overview-card success">
          <span>Available</span>
          <strong>{availableCount}</strong>
        </div>
        <div className="table-overview-card warning">
          <span>Reserved</span>
          <strong>{reservedCount}</strong>
        </div>
        <div className="table-overview-card warning">
          <span>Order</span>
          <strong>{orderCount}</strong>
        </div>
      </div>

      <div className="table-list-grid">
        {tables.map((table) => (
          <div key={table.id} className="table-card">
            <div className="table-card-top">
              <div>
                <span className="table-code">{table.id}</span>
                <h3>{table.name}</h3>
              </div>

              <span
                className={`table-status ${(table.status || "Available").toLowerCase()}`}
              >
                {table.status || "Available"}
              </span>
            </div>

            <p className="table-description">{table.description || "No description"}</p>

            <div className="table-meta">
              <div>
                <span>Area</span>
                <strong>{table.area}</strong>
              </div>
              <div>
                <span>Seats</span>
                <strong>{table.maxGuests} guests</strong>
              </div>
            </div>

            <div className="table-card-actions">
              <button className="outline-btn" onClick={() => handleEdit(table)}>
                Edit
              </button>
              <button className="danger-btn" onClick={() => handleDelete(table.id)}>
                Delete
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
            onClick={() => loadTable(page - 1)}
          >
            ← Trước
          </button>

          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`pagination-button ${page === i ? "active-page" : ""}`}
                onClick={() => loadTable(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            className="pagination-button"
            disabled={page === totalPages - 1}
            onClick={() => loadTable(page + 1)}
          >
            Sau →
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal table-modal">
            <h3>{editingTable ? "Edit Table" : "Create Table"}</h3>

            <input
              type="text"
              placeholder="Table name"
              value={tableForm.name}
              onChange={(e) =>
                setTableForm({ ...tableForm, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Area"
              value={tableForm.area}
              onChange={(e) =>
                setTableForm({ ...tableForm, area: e.target.value })
              }
            />

            <input
              type="number"
              min="1"
              placeholder="Max guests"
              value={tableForm.maxGuests}
              onChange={(e) =>
                setTableForm({ ...tableForm, maxGuests: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              rows="3"
              value={tableForm.description}
              onChange={(e) =>
                setTableForm({ ...tableForm, description: e.target.value })
              }
            />

            <select
              value={tableForm.status}
              onChange={(e) =>
                setTableForm({ ...tableForm, status: e.target.value })
              }
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Order">Order</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="modal-buttons">
              <button className="table-primary-btn" onClick={handleSave}>
                Save
              </button>
              <button className="outline-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}