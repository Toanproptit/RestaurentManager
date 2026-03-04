import React, { useState } from "react";
import { mockMenus } from "../../auth/MockMenu";
import "../../styles/StaffManagement.css";

export default function MenuManagement() {
  const [menus, setMenus] = useState(mockMenus);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    status: "Available",
  });

  // =========================
  // SAVE (ADD OR EDIT)
  // =========================
  const handleSave = () => {
    if (editingItem) {
      // UPDATE
      setMenus(
        menus.map((item) =>
          item.id === editingItem.id
            ? { ...newItem, id: editingItem.id }
            : item
        )
      );
    } else {
      // ADD
      const itemToAdd = {
        id: Date.now().toString(),
        ...newItem,
      };
      setMenus([...menus, itemToAdd]);
    }

    setShowModal(false);
    setEditingItem(null);

    setNewItem({
      name: "",
      price: "",
      category: "",
      image: "",
      status: "Available",
    });
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem(item);
    setShowModal(true);
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (confirmDelete) {
      setMenus(menus.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="staff-container">
      <h2>Menu Management</h2>

      <button
        className="add-btn"
        onClick={() => {
          setEditingItem(null);
          setShowModal(true);
        }}
        style={{ marginBottom: "20px" }}
      >
        + Add Menu Item
      </button>

      <div className="staff-list">
        {menus.map((item) => (
          <div key={item.id} className="staff-card">
            <div>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  width="80"
                  style={{ borderRadius: "8px", marginBottom: "10px" }}
                />
              )}

              <h3>{item.name}</h3>
              <p>{Number(item.price).toLocaleString()} VND</p>
              <p>{item.category}</p>

              <span
                className={`status ${
                  item.status === "Available" ? "active" : "inactive"
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </h3>

            <input
              placeholder="Name"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
            />

            <input
              placeholder="Category"
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
            />

            <input
              placeholder="Image URL"
              value={newItem.image}
              onChange={(e) =>
                setNewItem({ ...newItem, image: e.target.value })
              }
            />

            <div style={{ marginTop: "10px" }}>
              <button onClick={handleSave}>Save</button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}