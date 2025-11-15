
import React, { useState } from "react";
import { API_BASE_URL } from "../App.jsx";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  guests: 2,
  date: "",
  time: "",
  newsletter: false
};

function Reservations() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateForm = () => {
    const v = {};
    if (!form.name.trim()) v.name = "Name is required.";
    if (!form.email.trim()) v.email = "Email is required.";
    if (!form.date) v.date = "Please choose a date.";
    if (!form.time) v.time = "Please choose a time.";
    const guestsNum = Number(form.guests);
    if (!guestsNum || guestsNum < 1 || guestsNum > 10) {
      v.guests = "Guests must be between 1 and 10.";
    }
    return v;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    const v = validateForm();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      setStatus("Please correct the highlighted fields.");
      return;
    }
    setErrors({});

    const datetime = `${form.date}T${form.time}`;

    try {
      const res = await fetch(`${API_BASE_URL}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          guests: Number(form.guests),
          datetime,
          newsletter: form.newsletter
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Server error. Please try again later.");
        return;
      }

      setStatus(
        `${data.message} Table ${data.table_number} at ${new Date(
          data.time_slot
        ).toLocaleString()}.`
      );
      setForm((prev) => ({
        ...initialForm,
        newsletter: prev.newsletter
      }));
    } catch (err) {
      console.error(err);
      setStatus("Server error. Please try again later.");
    }
  };

  return (
    <main className="page reservations-page">
      <section className="reservation-form-container">
        <h1>Reserve a Table</h1>
        <p>Please fill in the form below to request a reservation.</p>

        <form className="reservation-form" onSubmit={handleSubmit}>
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
              max="10"
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
