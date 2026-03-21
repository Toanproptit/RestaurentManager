import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faReceipt, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function OrdersListStep({
  orders,
  onSelectOrder,
  onCreateNewOrder,
  onDeleteOrder,
  formatCurrency,
  page,
  totalPages,
  onPageChange,
}) {
  return (
    <section className="orders-main panel-shell">
      <div className="panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p className="panel-kicker">Step 1</p>
          <h2>Active Orders</h2>
        </div>
        <button className="primary-action" onClick={onCreateNewOrder} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faPlus} /> New Order
        </button>
      </div>

      <div className="table-list">
        {orders.length === 0 ? (
          <p style={{ padding: "20px", color: "#666" }}>No orders available.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="table-card"
              onClick={() => onSelectOrder(order)}
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              <div className="table-card-top">
                <strong>Order #{order.id}</strong>
                <span className={`status-pill ${order.status === 'PENDING' ? 'reserved' : 'available'}`}>
                  {order.status}
                </span>
              </div>
              <p>Table: {order.diningTable?.name || order.diningTables?.[0]?.name || "None"}</p>
              <div className="table-meta">
                <span>
                  <FontAwesomeIcon icon={faReceipt} /> {formatCurrency(order.totalAmount || 0)}
                </span>
                <span>{new Date(order.orderDate).toLocaleTimeString()}</span>
              </div>
              <button
                className="ghost-action"
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  color: 'var(--orders-accent)',
                  padding: '6px 10px'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteOrder(order.id);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
          >
            ← Trước
          </button>
          <div className="pagination-pages">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`pagination-button ${page === i ? "active-page" : ""}`}
                onClick={() => onPageChange(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            className="pagination-button"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages - 1}
          >
            Sau →
          </button>
        </div>
      )}
    </section>
  );
}
