// import { useEffect, useState } from "react";
// import api from "./api";

// export default function Dashboard() {
//   const [sweets, setSweets] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   const role = localStorage.getItem("role");

//   /* =====================
//      FETCH SWEETS
//   ===================== */
//   useEffect(() => {
//     fetchSweets();
//   }, []);

//   const fetchSweets = async () => {
//     const res = await api.get("/api/sweets");
//     setSweets(res.data);
//   };

//   /* =====================
//      PURCHASE SWEET
//   ===================== */
//   const purchase = async id => {
//     setLoading(true);
//     try {
//       await api.post(`/api/sweets/${id}/purchase`);
//       fetchSweets(); // refresh stock
//     } catch (err) {
//       alert("Unable to purchase sweet");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =====================
//      LOGOUT
//   ===================== */
//   const logout = () => {
//     localStorage.clear();
//     window.location.href = "/";
//   };

//   /* =====================
//      DASHBOARD METRICS
//   ===================== */
//   const availableTypes = sweets.filter(s => s.quantity > 0).length;
//   const totalStock = sweets.reduce((sum, s) => sum + s.quantity, 0);

//   return (
//     <div className="dashboard-page">
//       {/* ===== HEADER ===== */}
//       <div className="dashboard-header">
//         <h1>🍬 Sweet Shop</h1>

//         <div className="header-actions">
//           <span className="role">{role}</span>

//           {role === "admin" && (
//             <button onClick={() => (window.location.href = "/admin")}>
//               Admin Panel
//             </button>
//           )}

//           <button className="logout" onClick={logout}>
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* ===== CONTENT ===== */}
//       <div className="dashboard-content">
//         <h2>Available Sweets</h2>

//         {/* ===== STATS ===== */}
//         {/* <div className="dashboard-stats">
//           <span>Available Types: {availableTypes}</span>
//           <span> Total Items in Stock: {totalStock}</span>
//         </div> */}

//         {/* ===== SEARCH ===== */}
//         <input
//           className="search"
//           placeholder="Search sweets..."
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//         />

//         {/* ===== SWEET LIST ===== */}
//         <div className="sweet-grid">
//           {sweets
//             .filter(s =>
//               s.name.toLowerCase().includes(search.toLowerCase())
//             )
//             .map(s => (
//               <div key={s._id} className="sweet-card">
//                 <h3>{s.name}</h3>
//                 <p className="category">{s.category}</p>

//                 <p className="price">₹{s.price}</p>

//                 <p className={`stock ${s.quantity > 0 ? "in" : "out"}`}>
//                   {s.quantity === 0
//                     ? "Out of stock"
//                     : s.quantity <= 5
//                     ? `Only ${s.quantity} left 🔥`
//                     : `${s.quantity} items left`}
//                 </p>

//                 <button
//                   disabled={s.quantity === 0 || loading}
//                   onClick={() => purchase(s._id)}
//                 >
//                   {s.quantity === 0 ? "Out of Stock" : "Purchase"}
//                 </button>
//               </div>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import api from "./api";

export default function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("role");

  /* =====================
     FETCH SWEETS
  ===================== */
  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    const res = await api.get("/api/sweets");
    setSweets(res.data);
  };

  /* =====================
     PURCHASE
  ===================== */
  const purchase = async id => {
    setLoading(true);
    try {
      await api.post(`/api/sweets/${id}/purchase`);
      fetchSweets();
    } catch {
      alert("Unable to purchase sweet");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     LOGOUT
  ===================== */
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* =====================
     FILTER LOGIC
  ===================== */
  const filteredSweets = sweets.filter(s => {
    const matchName = s.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "all" || s.category === category;

    const matchStock =
      !inStockOnly || s.quantity > 0;

    const matchPrice =
      priceRange === "all" ||
      (priceRange === "low" && s.price < 100) ||
      (priceRange === "mid" && s.price >= 100 && s.price <= 300) ||
      (priceRange === "high" && s.price > 300);

    return matchName && matchCategory && matchStock && matchPrice;
  });

  /* =====================
     METRICS
  ===================== */
  const availableTypes = sweets.filter(s => s.quantity > 0).length;
  const totalStock = sweets.reduce((sum, s) => sum + s.quantity, 0);

  /* =====================
     UNIQUE CATEGORIES
  ===================== */
  const categories = ["all", ...new Set(sweets.map(s => s.category))];

  return (
    <div className="dashboard-page">
      {/* ===== HEADER ===== */}
      <div className="dashboard-header">
        <h1>🍬 Sweet Shop</h1>

        <div className="header-actions">
          <span className="role">{role}</span>

          {role === "admin" && (
            <button onClick={() => (window.location.href = "/admin")}>
              Admin Panel
            </button>
          )}

          <button className="logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="dashboard-content">
        <h2>Available Sweets</h2>

        {/* ===== STATS ===== */}
        <div className="dashboard-stats">
          <span>Available Types: {availableTypes}</span>
          <span>Total Items in Stock: {totalStock}</span>
        </div>

        {/* ===== FILTER BAR ===== */}
        <div className="filter-bar">
          <input
            className="search"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={priceRange}
            onChange={e => setPriceRange(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="low">Below ₹100</option>
            <option value="mid">₹100 – ₹300</option>
            <option value="high">Above ₹300</option>
          </select>

          <label className="stock-filter">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={e => setInStockOnly(e.target.checked)}
            />
            In Stock Only
          </label>
        </div>

        {/* ===== SWEETS GRID ===== */}
        <div className="sweet-grid">
          {filteredSweets.map(s => (
            <div key={s._id} className="sweet-card">
              <h3>{s.name}</h3>
              <p className="category">{s.category}</p>

              <p className="price">₹{s.price}</p>

              <p className={`stock ${s.quantity > 0 ? "in" : "out"}`}>
                {s.quantity === 0
                  ? "Out of stock"
                  : s.quantity <= 5
                  ? `Only ${s.quantity} left 🔥`
                  : `${s.quantity} items left`}
              </p>

              <button
                disabled={s.quantity === 0 || loading}
                onClick={() => purchase(s._id)}
              >
                {s.quantity === 0 ? "Out of Stock" : "Purchase"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
