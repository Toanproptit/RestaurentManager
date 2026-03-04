import React, { useState } from "react";
import "../../styles/Orders.css";

const tables = [
  { id: 1, name: "Table 1", status: "Available" },
  { id: 2, name: "Table 2", status: "Available" },
  { id: 3, name: "Table 3", status: "Available" },
];

const foods = [
  { id: 1, name: "Fried Rice", price: 50000 },
  { id: 2, name: "Noodles", price: 45000 },
  { id: 3, name: "Dumplings", price: 60000 },
];

export default function Orders() {
  const [selectedTable, setSelectedTable] = useState(null);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [showInvoice, setShowInvoice] = useState(false);

  // Add food
  const addFood = (food) => {
    const exist = cart.find((item) => item.id === food.id);
    if (exist) {
      setCart(
        cart.map((item) =>
          item.id === food.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...food, qty: 1 }]);
    }
  };

  const decrease = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const vat = subtotal * 0.1;
  const service = subtotal * 0.05;
  const total = subtotal + vat + service - discount;

  const handlePayment = () => {
    alert("Payment Success!");
    setCart([]);
    setDiscount(0);
    setSelectedTable(null);
    setShowInvoice(false);
  };

  return (
    <div className="pos-container">
      <h1>Restaurant POS</h1>

      <div className="pos-layout">

        {/* TABLES */}
        <div className="table-panel">
          <h3>Tables</h3>
          {tables.map((table) => (
            <button
              key={table.id}
              className={
                selectedTable?.id === table.id
                  ? "table-btn active"
                  : "table-btn"
              }
              onClick={() => setSelectedTable(table)}
            >
              {table.name}
            </button>
          ))}
        </div>

        {/* MENU */}
        <div className="menu-panel">
          <h3>Menu</h3>
          {foods.map((food) => (
            <div key={food.id} className="food-card">
              <div>
                <h4>{food.name}</h4>
                <p>{food.price.toLocaleString()} đ</p>
              </div>
              <button onClick={() => addFood(food)}>+</button>
            </div>
          ))}
        </div>

        {/* CART */}
        <div className="cart-panel">
          <h3>Invoice</h3>

          {!selectedTable && <p>Select table first</p>}

          {selectedTable && (
            <>
              <p><strong>{selectedTable.name}</strong></p>

              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <span>{item.name}</span>
                  <div>
                    <button onClick={() => decrease(item.id)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => addFood(item)}>+</button>
                  </div>
                  <span>
                    {(item.price * item.qty).toLocaleString()} đ
                  </span>
                </div>
              ))}

              <hr />

              <p>Subtotal: {subtotal.toLocaleString()} đ</p>
              <p>VAT (10%): {vat.toLocaleString()} đ</p>
              <p>Service (5%): {service.toLocaleString()} đ</p>

              <input
                type="number"
                placeholder="Discount"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />

              <h3>Total: {total.toLocaleString()} đ</h3>

              <button onClick={() => setShowInvoice(true)}>
                Preview Invoice
              </button>

              <button onClick={handlePayment}>
                Confirm Payment
              </button>
            </>
          )}
        </div>
      </div>

      {/* MODAL INVOICE */}
      {showInvoice && (
        <div className="modal">
          <div className="modal-content">
            <h2>Invoice</h2>
            <p>{selectedTable?.name}</p>

            {cart.map((item) => (
              <div key={item.id}>
                {item.name} x{item.qty} —{" "}
                {(item.price * item.qty).toLocaleString()} đ
              </div>
            ))}

            <hr />
            <p>Total: {total.toLocaleString()} đ</p>

            <button onClick={() => window.print()}>
              Print
            </button>
            <button onClick={() => setShowInvoice(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}