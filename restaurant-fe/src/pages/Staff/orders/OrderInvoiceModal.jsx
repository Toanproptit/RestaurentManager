export default function OrderInvoiceModal({
  selectedTable,
  cart,
  note,
  subtotal,
  vat,
  service,
  discount,
  total,
  formatCurrency,
  onClose,
}) {
  if (!selectedTable) {
    return null;
  }

  return (
    <div className="invoice-modal">
      <div className="modal-content">
        <div className="modal-heading">
          <div>
            <p className="panel-kicker">Invoice preview</p>
            <h2>{selectedTable.name}</h2>
          </div>
          <span className="status-pill available">Ready to print</span>
        </div>

        <div className="modal-order-list">
          {cart.map((item) => (
            <div key={item.id} className="modal-order-row">
              <span>
                {item.name} x{item.qty}
              </span>
              <strong>{formatCurrency(item.price * item.qty)}</strong>
            </div>
          ))}
        </div>

        {note && <p className="modal-note">Note: {note}</p>}

        <div className="bill-breakdown modal-breakdown">
          <div>
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div>
            <span>VAT</span>
            <strong>{formatCurrency(vat)}</strong>
          </div>
          <div>
            <span>Service</span>
            <strong>{formatCurrency(service)}</strong>
          </div>
          <div>
            <span>Discount</span>
            <strong>- {formatCurrency(discount)}</strong>
          </div>
          <div className="bill-total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-action" onClick={() => window.print()}>
            Print
          </button>
          <button type="button" className="primary-action" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
