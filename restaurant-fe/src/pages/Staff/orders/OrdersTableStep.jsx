import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

export default function OrdersTableStep({
  tables,
  onSelectTable,
  selectedTable,
  statusTone,
}) {
  return (
    <section className="orders-main panel-shell">
      <div className="panel-heading">
        <div>
          <p className="panel-kicker">Step 1</p>
          <h2>Choose a table</h2>
        </div>
      </div>

      <div className="table-list">
        {tables
          .filter((table) => table.status !== "Order")
          .map((table) => {
            const tone = statusTone[table.status] ?? "inactive";

          return (
            <button
              key={table.id}
              type="button"
              className={`table-card ${selectedTable?.id === table.id ? "selected" : ""}`}
              onClick={() => onSelectTable(table)}
            >
              <div className="table-card-top">
                <strong>{table.name}</strong>
                <span className={`status-pill ${tone}`}>{table.status}</span>
              </div>
              <p>{table.description}</p>
              <div className="table-meta">
                <span>
                  <FontAwesomeIcon icon={faUsers} /> {table.maxGuests} guests
                </span>
                <span>{table.area}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}