// frontend/src/pages/Reservations.jsx
import React, { useState } from "react";
import { API_BASE_URL } from "../config";

function Reservations() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "",
    date: "",
    time: "",
    newsletter: false,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // ----- handle input changes (text/number/checkbox) -----
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ----- client-side validation -----
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    if (!form.guests || Number(form.guests) <= 0) {
      newErrors.guests = "Guests must be at least 1.";
    }
    if (!form.date) newErrors.date = "Please choose a date.";
    if (!form.time) newErrors.time = "Please choose a time.";

    return newErrors;
  };

  // ----- submit handler -----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setErrors({});

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          guests: Number(form.guests),
          date: form.date,          // e.g. "2025-11-23"
          time: form.time,          // e.g. "23:00"
          newsletter_opt_in: form.newsletter,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus(data.error || "Server error. Please try again.");
        setLoading(false);
        return;
      }

      // success
      setStatus("Reservation submitted! We’ll see you soon.");
      setForm({
        name: "",
        email: "",
        phone: "",
        guests: "",
        date: "",
        time: "",
        newsletter: false,
      });
      setErrors({});
    } catch (err) {
      console.error("RESERVATION ERROR:", err);
      setStatus("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page reservations-page">
      <section className="reservations-card">
        <h1>Reserve a Table</h1>
        <p>Book your spot at Café Fausse.</p>

        <form onSubmit={handleSubmit} className="reservations-form">
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </label>

          <label>
            Phone (optional)
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Guests
            <input
              type="number"
              name="guests"
              min="1"
              value={form.guests}
              onChange={handleChange}
            />
            {errors.guests && <span className="error-text">{errors.guests}</span>}
          </label>

          {/* Calendar picker */}
          <label>
            Date
            <input
            type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </label>

          {/* Clock / time picker */}
          <label>
            Time
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
            />
            {errors.time && <span className="error-text">{errors.time}</span>}
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="newsletter"
              checked={form.newsletter}
              onChange={handleChange}
            />
            Sign me up for the newsletter.
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Confirm Reservation"}
          </button>
        </form>

        {status && <p className="status-text">{status}</p>}
      </section>
    </main>
  );
}

export default Reservations;