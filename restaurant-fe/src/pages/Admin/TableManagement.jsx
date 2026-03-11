import React, { useState } from "react";
import { mockTables } from "../../auth/MockTable";
import "../../styles/TableManagement.css";

const emptyTable = {
  name: "",
  description: "",
  maxGuests: 4,
  area: "",
  status: "Available",
};

export default function TableManagement() {
  const [tables, setTables] = useState(mockTables);
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [tableForm, setTableForm] = useState(emptyTable);

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

  const handleSave = () => {
    if (!tableForm.name.trim() || !tableForm.area.trim()) {
      window.alert("Please enter table name and area.");
      return;
    }

    if (editingTable) {
      setTables(
        tables.map((table) =>
          table.id === editingTable.id
            ? {
                ...table,
                ...tableForm,
                maxGuests: Number(tableForm.maxGuests),
              }
            : table
        )
      );
    } else {
      const newTable = {
        id: `TB-${Date.now()}`,
        ...tableForm,
        maxGuests: Number(tableForm.maxGuests),
      };

      setTables([newTable, ...tables]);
    }

    resetForm();
  };

  const handleDelete = (tableId) => {
    const confirmDelete = window.confirm("Delete this table?");
    if (confirmDelete) {
      setTables(tables.filter((table) => table.id !== tableId));
    }
  };

  const availableCount = tables.filter((table) => table.status === "Available").length;
  const reservedCount = tables.filter((table) => table.status === "Reserved").length;

  return (
    <div className="table-management-page">
      <div className="table-management-head">
        <div>
          <h2>Table Management</h2>
          <p>Create and manage restaurant tables with mock data.</p>
        </div>

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
                className={`table-status ${table.status.toLowerCase()}`}
              >
                {table.status}
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