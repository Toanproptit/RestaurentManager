import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";

export default function OrdersSummary({
  selectedTable,
  cart,
  note,
  onNoteChange,
  subtotal,
  vat,
  service,
  total,
  orderReady,
  onDecrease,
  onAddFood,
  onBackToMenu,
  onChooseMore,
  onConfirmOrder,
  onPreviewInvoice,
  onConfirmPayment,
  formatCurrency,
}) {
  return (
    <section className="orders-summary panel-shell">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">Step 3</p>
          <h2>Review invoice</h2>
        </div>
      </div>

      <div className="summary-highlight">
        <span>Table assigned</span>
        <strong>{selectedTable ? selectedTable.name : "Waiting for selection"}</strong>
        <small>
          {selectedTable
            ? `${selectedTable.area} • ${selectedTable.maxGuests} guests`
            : "Select an available table to start the order."}
        </small>
      </div>

      <div className="cart-list">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <FontAwesomeIcon icon={faReceipt} />
            <p>No dishes added yet.</p>
            <span>Choose a table, then add items from the menu.</span>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-row">
              <div>
                <strong>{item.name}</strong>
                <small>{formatCurrency(item.price)} each</small>
              </div>
              <div className="qty-control">
                <button type="button" onClick={() => onDecrease(item.id)}>
                  -
                </button>
                <span>{item.qty}</span>
                <button type="button" onClick={() => onAddFood(item)}>
                  +
                </button>
              </div>
              <strong>{formatCurrency(item.price * item.qty)}</strong>
            </div>
          ))
        )}
      </div>

      <div className="discount-section">
        <label htmlFor="order-note">Service note</label>
        <textarea
          id="order-note"
          rows="3"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Example: less ice, no peanuts, prioritize serving starter first..."
        />

       
      </div>

      <div className="bill-breakdown">
        <div>
          <span>Subtotal</span>
          <strong>{formatCurrency(subtotal)}</strong>
        </div>
        <div>
          <span>VAT 10%</span>
          <strong>{formatCurrency(vat)}</strong>
        </div>
        <div>
          <span>Service 5%</span>
          <strong>{formatCurrency(service)}</strong>
        </div>
      
        <div className="bill-total">
          <span>Grand total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>

      <div className="summary-actions">
        <button type="button" className="ghost-action" onClick={onBackToMenu}>
          Back to menu
        </button>
        <button type="button" className="secondary-action" onClick={onChooseMore}>
          Choose more dishes
        </button>
        <button
          type="button"
          className="secondary-action"
          onClick={onConfirmOrder}
          disabled={!orderReady}
        >
          Xác nhận gọi món
        </button>
        <button
          type="button"
          className="secondary-action"
          onClick={onPreviewInvoice}
          disabled={!orderReady}
        >
          Export invoice
        </button>
        <button
          type="button"
          className="primary-action"
          onClick={onConfirmPayment}
          disabled={!orderReady}
        >
          Confirm payment
        </button>
      </div>
    </section>
  );
}
