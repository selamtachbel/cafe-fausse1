
import React, { useState } from "react";
import { API_BASE_URL } from "../App.jsx";
import "../styles/Home.css";


function Home() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setErrors({});

    if (!form.email.trim()) {
      setErrors({ email: "Email is required." });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim() || null,
          email: form.email.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Server error. Please try again later.");
        return;
      }

      setStatus(data.message || "Subscribed successfully.");
    } catch (err) {
      console.error(err);
      setStatus("Server error. Please try again later.");
    }
  };

    return (
    <main className="page home-page">
      <section className="home-hero-full">
        
          <h1>Welcome to Café Fausse</h1>
          <p className="lead">
          <p>A cozy place in Addis Ababa to enjoy specialty coffee, desserts, and relaxed evenings with friends.</p>
</p>
          {/* keep your newsletter form here */}
          {/* Stay in touch section */}
        
      </section>

      <section className="newsletter-section">
        <h2>Stay in touch</h2>
        <p>Sign up for our newsletter to hear about new menu items and events.</p>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <label>
            Name (optional)
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </label>
          <button type="submit">Subscribe</button>
        </form>
        {status && <p className="status-text">{status}</p>}
      </section>
    </main>
  );
}

export default Home;
