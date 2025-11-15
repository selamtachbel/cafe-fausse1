
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Gallery from "./pages/Gallery.jsx";
import About from "./pages/About.jsx";
import Reservations from "./pages/Reservations.jsx";
import Admin from "./pages/Admin.jsx";
import "./styles/App.css";
import "./styles/Home.css";


import "./styles/Admin.css";

export const API_BASE_URL = "http://127.0.0.1:5000";

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
