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

  // Handle all inputs (text / number / checkbox)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    if (!form.guests) newErrors.guests = "Number of guests is required.";
    if (!form.date) newErrors.date = "Date is required.";
    if (!form.time) newErrors.time = "Time is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setErrors({});

    if (!validate()) {
      setStatus("Please fix the errors above.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || null,
      guests: Number(form.guests),
      date: form.date,                // e.g. "2025-11-22"
      time: form.time,                // e.g. "18:00"
      newsletter_opt_in: form.newsletter,
      table_number: 1,                // simple default table number
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(data.error || "Server error. Please try again.");
        return;
      }

      setStatus("Reservation created successfully!");
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
    }
  };

  return (
    <main className="page reservations-page">
      <section className="card">
        <h1>Reserve a Table</h1>
        <p>Book your spot at Café Fausse.</p>

        <form onSubmit={handleSubmit} className="reservation-form">
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
            {errors.guests && (
              <span className="error-text">{errors.guests}</span>
            )}
          </label>

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

          <button type="submit">Confirm Reservation</button>
        </form>

        {status && <p className="status-text">{status}</p>}
      </section>
    </main>
  );
}

export default Reservations;