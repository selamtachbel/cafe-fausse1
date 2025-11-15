
import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">CAFÉ FAUSSE</div>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/gallery">Gallery</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/reservations">Reservations</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
