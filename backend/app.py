# backend/app.py

import os
import re
from datetime import datetime

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# ---------------- Setup ---------------- #

load_dotenv()  # reads .env file

app = Flask(__name__)

# Database config (SQLite)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///instance/cafe_fausse.db"

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# CORS: allow local dev + Render frontend
CORS(
    app,
    resources={r"/api/*": {"origins": [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://cafe-fausse1-frontend-selam.onrender.com",
    ]}},
    supports_credentials=False,
)

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
ADMIN_KEY = os.getenv("ADMIN_KEY", "Selam2024")

# ---------------- Models ---------------- #


class NewsletterSubscriber(db.Model):
    tablename = "newsletter_subscribers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)


class Reservation(db.Model):
    tablename = "reservations"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    guests = db.Column(db.Integer, nullable=False)
    time_slot = db.Column(db.DateTime, nullable=False)
    table_number = db.Column(db.Integer, nullable=False)
    newsletter_opt_in = db.Column(db.Boolean, default=False, nullable=False)


# Create tables (local + Render)
with app.app_context():
    try:
        db.create_all()
        print("✅ Database tables are ready.")
    except Exception as e:
        print("❌ Error creating tables:", e)


# ---------------- Routes ---------------- #


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200


# ---- Newsletter signup ---- #
@app.route("/api/newsletter", methods=["POST"])
def newsletter_signup():
    data = request.get_json() or {}

    name = data.get("name", "").strip() or None
    email = (data.get("email") or "").strip().lower()

    if not email or not EMAIL_REGEX.match(email):
        return jsonify({"error": "Invalid email address."}), 400

    try:
        # If already subscribed, just return success
        existing = NewsletterSubscriber.query.filter_by(email=email).first()
        if existing:
            return jsonify({"message": "Already subscribed."}), 200

        subscriber = NewsletterSubscriber(name=name, email=email)
        db.session.add(subscriber)
        db.session.commit()

        return jsonify({"message": "Subscribed successfully."}), 201
    except Exception as e:
        print("❌ Newsletter error:", e)
        db.session.rollback()
        return jsonify({"error": "Server error."}), 500


# ---- Create reservation ---- #
@app.route("/api/reservations", methods=["POST"])
def create_reservation():
    data = request.get_json() or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    phone = (data.get("phone") or "").strip() or None
    guests = data.get("guests")
    date_str = data.get("date")  # e.g. "2025-11-22"
    time_str = data.get("time")  # e.g. "18:00"
    newsletter_opt_in = bool(data.get("newsletter_opt_in"))

    # Basic validation
    if not name or not email or not guests or not date_str or not time_str:
        return jsonify({"error": "Missing required fields."}), 400

    if not EMAIL_REGEX.match(email):
        return jsonify({"error": "Invalid email address."}), 400

    try:
        # combine date + time into datetime
        # expect ISO-like strings from frontend, adjust if needed
        time_slot = datetime.fromisoformat(f"{date_str} {time_str}")# you can make a smarter table_number; here just a simple placeholder
        table_number = int(data.get("table_number") or 1)

        reservation = Reservation(
            name=name,
            email=email,
            phone=phone,
            guests=int(guests),
            time_slot=time_slot,
            table_number=table_number,
            newsletter_opt_in=newsletter_opt_in,
        )
        db.session.add(reservation)

        # If user ticked newsletter, upsert subscriber
        if newsletter_opt_in:
            existing = NewsletterSubscriber.query.filter_by(email=email).first()
            if not existing:
                subscriber = NewsletterSubscriber(name=name, email=email)
                db.session.add(subscriber)

        db.session.commit()
        return jsonify({"message": "Reservation created."}), 201

    except Exception as e:
        print("❌ Reservation error:", e)
        db.session.rollback()
        return jsonify({"error": "Server error."}), 500


# ---- Admin overview (with admin key) ---- #
@app.route("/api/admin/overview", methods=["GET"])
def admin_overview():
    # First: check the admin key
    key = request.args.get("key", "")

    if key != ADMIN_KEY:
        return jsonify({"error": "Invalid admin key"}), 401

    try:
        # ---- Reservations ----
        reservations_list = Reservation.query.order_by(Reservation.id).all()
        reservations_data = []
        for r in reservations_list:
            reservations_data.append({
                "id": r.id,
                "name": r.name,
                "email": r.email,
                "phone": r.phone,
                "guests": r.guests,
                "time_slot": r.time_slot.isoformat() if r.time_slot else None,
                "table_number": r.table_number,
                "newsletter": r.newsletter_opt_in,
            })

        # ---- Subscribers ----
        subs_list = NewsletterSubscriber.query.order_by(NewsletterSubscriber.id).all()
        subscribers_data = []
        for s in subs_list:
            subscribers_data.append({
                "id": s.id,
                "name": s.name,
                "email": s.email,
                "subscribed_at": s.created_at.isoformat() if s.created_at else None,
            })

        # All good: return data
        return jsonify({
            "reservations": reservations_data,
            "subscribers": subscribers_data,
        }), 200

    except Exception as e:
        # TEMPORARY: show the real error so we can debug Render
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": f"{type(e).__name__}: {str(e)}"
        }), 500


# ------------- Main ------------- #

if __name__ == "__main__":
    # Local dev
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
        