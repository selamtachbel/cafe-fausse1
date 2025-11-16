// frontend/src/pages/Admin.jsx
import React, { useState } from "react";
import { API_BASE_URL } from "../config";

export default function Admin() {
  const [inputKey, setInputKey] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  // ---- Handle login with admin key ----
  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const key = inputKey.trim();

      const res = await fetch(
        `${API_BASE_URL}/api/admin/overview?key=${encodeURIComponent(key)}`
      );

      // Wrong admin key
      if (res.status === 401) {
        setStatus("Incorrect admin key.");
        setIsAuthed(false);
        setLoading(false);
        return;
      }

      // Any other error from the server
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Admin overview error:", res.status, text);
        setStatus("Server error. Please try again.");
        setLoading(false);
        return;
      }

      // Success
      const data = await res.json();
      setReservations(data.reservations || []);
      setSubscribers(data.subscribers || []);
      setIsAuthed(true);
      setStatus("");
    } catch (err) {
      console.error("ADMIN LOGIN ERROR:", err);
      setStatus("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ========= LOGIN VIEW =========
  if (!isAuthed) {
    return (
      <main className="page admin-page">
        <section className="admin-card">
          <h1>Admin Access</h1>
          <p>Please enter the admin key to continue.</p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <input
              type="password"
              placeholder="Admin key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Checking..." : "Enter"}
            </button>
          </form>

          {status && <p className="form-status error">{status}</p>}
        </section>
      </main>
    );
  }

  // ========= DASHBOARD VIEW =========
  return (
    <main className="page admin-page">
      <section className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <p>View all reservations and newsletter subscribers for Café Fausse.</p>

        <h2>Reservations</h2>
        {reservations.length === 0 ? (
          <p className="empty-text">No reservations yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Guests</th>
                <th>Time Slot</th>
                <th>Table</th>
                <th>Newsletter?</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r, index) => (
                <tr key={r.id}>
                  <td>{index + 1}</td>
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.phone || "—"}</td>
                  <td>{r.guests}</td>
                  <td>
                    {r.time_slot
                      ? new Date(r.time_slot).toLocaleString()
                      : "—"}
                  </td>
                  <td>{r.table_number}</td>
                  <td>{r.newsletter ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2>Newsletter Subscribers</h2>
        {subscribers.length === 0 ? (
          <p className="empty-text">No subscribers yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, index) => (
                <tr key={s.id}>
                  <td>{index + 1}</td>
                  <td>{s.name || "—"}</td>
                  <td>{s.email}</td>
                  <td>
                    {s.subscribed_at || s.created_at
                      ? new Date(s.subscribed_at || s.created_at).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}