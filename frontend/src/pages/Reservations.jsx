// frontend/src/pages/Reservations.jsx
import React, { useState } from "react";

// Hard-code backend URL so there is NO confusion
const API_BASE_URL = "https://cafe-fausse-backend-selam.onrender.com";

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

  // ------- Handle form inputs -------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // clear field error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ------- Basic validation on frontend -------
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    if (!form.guests || Number(form.guests) <= 0) {
      newErrors.guests = "Guests must be at least 1.";
    }
    if (!form.date) newErrors.date = "Date is required.";
    if (!form.time) newErrors.time = "Time is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------- Submit reservation -------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!validate()) {
      setStatus("Please fix the highlighted fields.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          guests: Number(form.guests),
          date: form.date,          // "YYYY-MM-DD"
          time: form.time,          // "HH:MM"
          newsletter_opt_in: form.newsletter,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(data.error || "Server error. Please try again.");
        return;
      }

      // success
      setStatus("Reservation created. Thank you!");
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
      <section className="reservation-card">
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
              min="1"
              name="guests"
              value={form.guests}
              onChange={handleChange}
            />
            {errors.guests && (
              <span className="error-text">{errors.guests}</span>
            )}
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

          {/* Clock picker */}
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