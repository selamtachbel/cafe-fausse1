import os
import random
import re
from datetime import datetime

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

# ------------------ Setup ------------------ #

load_dotenv()  # reads .env file

app = Flask(__name__)

# Database config (SQLite)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "SQLALCHEMY_DATABASE_URI", "sqlite:///cafe_fausse.db"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
CORS(app, origins=["http://localhost:5173"])

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

ADMIN_KEY = os.getenv("ADMIN_KEY", "Selam2024")  # you can change in .env

# ------------------ Models ------------------ #


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


with app.app_context():
    db.create_all()

# ------------------ Routes ------------------ #


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200


# ========== Newsletter ========== #


@app.route("/api/newsletter", methods=["POST"])
def signup_newsletter():
    data = request.get_json() or {}

    name = (data.get("name") or "").strip() or None
    email = (data.get("email") or "").strip()

    # Validation
    if not email:
        return jsonify({"error": "Email is required."}), 400
    if not EMAIL_REGEX.match(email):
        return jsonify({"error": "Please enter a valid email address."}), 400

    # Existing subscriber?
    existing = NewsletterSubscriber.query.filter_by(email=email).first()
    if existing:
        return jsonify({"message": "You are already subscribed with this email."}), 200

    # Create new subscriber
    subscriber = NewsletterSubscriber(name=name, email=email)
    db.session.add(subscriber)
    db.session.commit()

    return jsonify({"message": "Thank you for subscribing!"}), 200


# ========== Reservations ========== #


@app.route("/api/reservations", methods=["POST"])
def create_reservation():
    data = request.get_json() or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    phone = (data.get("phone") or "").strip() or None
    guests = data.get("guests")
    datetime_str = data.get("datetime")
    newsletter = bool(data.get("newsletter"))

    # ----- Validation -----
    if not name:
        return jsonify({"error": "Name is required."}), 400
    if len(name) < 2:
        return jsonify({"error": "Please enter your full name."}), 400

    if not email:
        return jsonify({"error": "Email is required."}), 400
    if not EMAIL_REGEX.match(email):
        return jsonify({"error": "Please enter a valid email address."}), 400

    if guests is None:
        return jsonify({"error": "Number of guests is required."}), 400

    try:
        guests = int(guests)
    except (TypeError, ValueError):
        return jsonify({"error": "Guests must be a number."}), 400

    if guests < 1 or guests > 10:
        return jsonify({"error": "Guests must be between 1 and 10."}), 400

    if not datetime_str:
        return jsonify({"error": "Date and time are required."}), 400

    # Expecting something like "2025-11-28T18:00"
    try:
        time_slot = datetime.fromisoformat(datetime_str)
    except ValueError:
        return jsonify({"error": "Invalid date/time format."}), 400

    if time_slot < datetime.now():
        return jsonify({"error": "You cannot book a time in the past."}), 400

    # Prevent duplicate reservation for same email + same time_slot
    existing_for_user = Reservation.query.filter_by(
        email=email, time_slot=time_slot
    ).first()
    if existing_for_user:
        return jsonify(
            {"error": "You already have a reservation for this time slot."}
        ), 400

    # Table availability: max 30 tables per time slot
    MAX_TABLES = 30
    existing = Reservation.query.filter_by(time_slot=time_slot).all()
    taken_tables = {r.table_number for r in existing}

    if len(taken_tables) >= MAX_TABLES:
        return jsonify(
            {"error": "This time slot is fully booked. Please choose another time."}
        ), 400

    available_tables = [t for t in range(1, MAX_TABLES + 1) if t not in taken_tables]
    table_number = random.choice(available_tables)

    # Create reservation
    reservation = Reservation(
        name=name,
        email=email,
        phone=phone,
        guests=guests,
        time_slot=time_slot,
        table_number=table_number,
        newsletter_opt_in=newsletter,
    )
    db.session.add(reservation)

    # If they opted into newsletter, ensure they are subscribed
    if newsletter:
        existing_subscriber = NewsletterSubscriber.query.filter_by(email=email).first()
        if not existing_subscriber:
            subscriber = NewsletterSubscriber(name=name, email=email)
            db.session.add(subscriber)

    db.session.commit()

    return (
        jsonify(
            {
                "message": "Reservation confirmed!",
                "table_number": table_number,
                "time_slot": time_slot.isoformat(),
            }
        ),
        200,
    )


# ========== Admin Overview (with Admin Key) ========== #


@app.route("/api/admin/overview", methods=["GET"])
def admin_overview():
    """
    Returns reservations and newsletter subscribers
    WITHOUT checking any key here.
    The frontend handles the admin key.
    """
    try:
        reservations = Reservation.query.order_by(
            Reservation.time_slot.asc()
        ).all()

        subscribers = NewsletterSubscriber.query.order_by(
            NewsletterSubscriber.created_at.desc()
        ).all()

        reservations_data = [
            {
                "id": r.id,
                "name": r.name,
                "email": r.email,
                "phone": r.phone,
                "guests": r.guests,
                "time_slot": r.time_slot.isoformat() if r.time_slot else None,
                "table_number": r.table_number,
                "newsletter": r.newsletter_opt_in,
            }
            for r in reservations
        ]

        subscribers_data = [
            {
                "id": s.id,
                "name": s.name,
                "email": s.email,
                "subscribed_at": s.created_at.isoformat()
                if s.created_at
                else None,
            }
            for s in subscribers
        ]

        return jsonify(
            {
                "reservations": reservations_data,
                "subscribers": subscribers_data,
            }
        ), 200

    except Exception as e:
        print("ADMIN OVERVIEW ERROR:", e)
        return jsonify({"error": "Server error"}), 500


# ------------------ Main ------------------ #

if __name__ == "__main__":
    app.run(debug=True)
