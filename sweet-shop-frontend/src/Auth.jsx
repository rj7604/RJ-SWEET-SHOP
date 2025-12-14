import { useState } from "react";
import api from "./api";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setLoading(true);

    try {
      const url = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { username: form.username, password: form.password }
        : form;

      const res = await api.post(url, payload);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);

        // decode role from JWT
        const payload = JSON.parse(atob(res.data.token.split(".")[1]));
        localStorage.setItem("role", payload.role);

        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>🍬 Sweet Shop</h1>
        <p className="subtitle">
          {isLogin ? "Welcome back!" : "Create your account"}
        </p>

        {error && <div className="error">{error}</div>}

        <input
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        {!isLogin && (
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        )}

        <button onClick={submit} disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>

        <p className="switch">
          {isLogin ? "New here?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Create account" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
