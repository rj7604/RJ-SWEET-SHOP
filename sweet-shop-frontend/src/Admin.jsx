import { useEffect, useState } from "react";
import api from "./api";

export default function Admin() {
  const [sweets, setSweets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: ""
  });
  const [loading, setLoading] = useState(false);

  /* ===== Load Inventory ===== */
  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") {
      window.location.href = "/dashboard";
      return;
    }
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    const res = await api.get("/api/sweets");
    setSweets(res.data);
  };

  /* ===== Add Sweet ===== */
  const addSweet = async () => {
    if (!form.name || !form.price) {
      alert("Name and price are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/sweets", {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity)
      });
      setForm({ name: "", category: "", price: "", quantity: "" });
      fetchSweets();
    } finally {
      setLoading(false);
    }
  };

  /* ===== Restock ===== */
  const restockSweet = async id => {
    const amount = prompt("Enter restock quantity");
    if (!amount || isNaN(amount)) return;

    await api.post(`/api/sweets/${id}/restock`, {
      amount: Number(amount)
    });
    fetchSweets();
  };

  /* ===== Delete ===== */
  const deleteSweet = async id => {
    if (!window.confirm("Delete this sweet?")) return;
    await api.delete(`/api/sweets/${id}`);
    fetchSweets();
  };

  return (
    <div className="admin-page">
      {/* ===== Header ===== */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => window.location.href = "/dashboard"}>
          Back to Shop
        </button>
      </div>

      {/* ===== Add Sweet ===== */}
      <div className="admin-card">
        <h2>Add New Sweet</h2>

        <div className="admin-form">
          <input
            placeholder="Sweet Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />
          <input
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
          />
          <input
            placeholder="Quantity"
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })}
          />
        </div>

        <button className="primary-btn" onClick={addSweet} disabled={loading}>
          {loading ? "Adding..." : "Add Sweet"}
        </button>
      </div>

      {/* ===== Inventory ===== */}
      <div className="admin-section">
        <h2>Inventory</h2>

        {sweets
          .filter(s => s.name && s.price > 0)
          .map(s => (
            <div key={s._id} className="inventory-item">
              <div className="info">
                <strong>{s.name}</strong>
                <span className="muted">{s.category}</span>
              </div>

              <div className="price">₹{s.price}</div>

              <div className={`stock ${s.quantity > 0 ? "in" : "out"}`}>
                {s.quantity} in stock
              </div>

              <div className="actions">
                <button onClick={() => restockSweet(s._id)}>Restock</button>
                <button
                  className="danger"
                  onClick={() => deleteSweet(s._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
