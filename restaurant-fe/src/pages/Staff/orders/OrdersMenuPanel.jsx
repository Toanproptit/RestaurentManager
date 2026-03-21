import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChair,
  faClock,
  faMagnifyingGlass,  
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const API_URL = "http://localhost:8080";

export default function OrdersMenuPanel({
  selectedTable,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  foods,
  page,
  totalPages,
  onPageChange,
  onAddFood,
  onBackToTables,
  onContinueToCheckout,
  canContinue,
  formatCurrency,
  allowBackToTableStep = true,
}) {
  const [quantities, setQuantities] = useState({});
  const [editingItemIds, setEditingItemIds] = useState({});

  const getQuantity = (foodId) => quantities[foodId] ?? 1;

  const handleQuantityChange = (foodId, value) => {
    const parsed = Number(value);
    setQuantities((prev) => ({
      ...prev,
      [foodId]: Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1,
    }));
  };

  const handleAddWithQuantity = (food) => {
    const quantity = getQuantity(food.id);
    onAddFood(food, quantity);
    setEditingItemIds((prev) => ({
      ...prev,
      [food.id]: false,
    }));
  };

  const openQuantityEditor = (foodId) => {
    setEditingItemIds((prev) => ({
      ...prev,
      [foodId]: true,
    }));
  };

  const closeQuantityEditor = (foodId) => {
    setEditingItemIds((prev) => ({
      ...prev,
      [foodId]: false,
    }));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  return (
    <main className="orders-main panel-shell">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">Step 2</p>
          <h2>Pick items from the menu</h2>
        </div>
        <div className="selection-chip">
          <FontAwesomeIcon icon={faChair} />
          {selectedTable ? selectedTable.name : "Choose table to continue"}
        </div>
      </div>

      <div className="menu-toolbar">
        <label className="menu-search">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search dish or description"
          />
        </label>

        <div className="category-row">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? "category-pill active" : "category-pill"}
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="menu-list-container">
        <div className="menu-list-header">
          <div className="col-info">Món ăn / Mô tả</div>
          <div className="col-category">Danh mục</div>
          <div className="col-time">Chuẩn bị</div>
          <div className="col-price">Đơn giá</div>
          <div className="col-action">Thao tác</div>
        </div>

        <div className="menu-list-body">
          {foods.map((food) => (
            <div key={food.id} className="menu-list-row">
              <div className="col-info">
                <div className="item-name-row">
                  <h3 className="menu-item-name">{food.name}</h3>
                  {food.featured && <span className="featured-badge">Featured</span>}
                </div>
                <p className="menu-item-desc">{food.description}</p>
              </div>

              <div className="col-category">
                <span className="menu-category">{food.category}</span>
              </div>

              <div className="col-time">
                <FontAwesomeIcon icon={faClock} /> {food.prepTime} mins
                <br />
                <small>{food.spicyLevel}</small>
              </div>

              <div className="col-price">
                <strong className="item-price">{formatCurrency(food.price)}</strong>
              </div>

              <div className="col-action">
                {!editingItemIds[food.id] ? (
                  <button
                    type="button"
                    className="ghost-action"
                    onClick={() => openQuantityEditor(food.id)}
                    disabled={!selectedTable}
                  >
                    Add
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                ) : (
                  <div className="menu-add-row-compact">
                    <input
                      type="number"
                      min="1"
                      className="qty-input-compact"
                      value={getQuantity(food.id)}
                      onChange={(event) => handleQuantityChange(food.id, event.target.value)}
                    />
                    <button
                      type="button"
                      className="primary-action-compact"
                      onClick={() => handleAddWithQuantity(food)}
                      disabled={!selectedTable}
                    >
                      OK
                    </button>
                    <button
                      type="button"
                      className="close-qty-compact"
                      onClick={() => closeQuantityEditor(food.id)}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
          <button
            className="pagination-button"
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
            style={{ padding: '8px 12px', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
          >
            ← Trước
          </button>
          
          <div className="pagination-pages" style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`pagination-button ${page === i ? "active-page" : ""}`}
                onClick={() => onPageChange(i)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontWeight: page === i ? 'bold' : 'normal',
                  backgroundColor: page === i ? '#4F46E5' : '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  color: page === i ? '#fff' : '#333'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            className="pagination-button"
            disabled={page === totalPages - 1}
            onClick={() => onPageChange(page + 1)}
            style={{ padding: '8px 12px', cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer' }}
          >
            Sau →
          </button>
        </div>
      )}

      <div className="stage-actions">
        <button type="button" className="ghost-action" onClick={onBackToTables}>
          {allowBackToTableStep ? "Back to table step" : "Back to order list"}
        </button>
        <button
          type="button"
          className="primary-action"
          onClick={onContinueToCheckout}
          disabled={!canContinue}
        >
          Continue to payment
        </button>
      </div>
    </main>
  );
}
