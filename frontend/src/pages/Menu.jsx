import React from "react";
import "./Menu.css";

export default function Menu() {
  const coffee = [
    { name: "Cappuccino", img: "/images/cappuccino.jpg", price: "Br300.00" },
    { name: "Latte", img: "/images/latte.jpg", price: "Br250.00" },
    { name: "Espresso", img: "/images/espresso.jpg", price: "Br120.00" },
    { name: "Macchiato", img: "/images/macchiato.jpg", price: "Br150.00" },
    { name: "Mocha", img: "/images/mocha.jpg", price: "$4.50" },
    { name: "Iced Latte", img: "/images/iced-latte.jpg", price: "Br200.00" },
    { name: "Cold Brew", img: "/images/cold-brew.jpg", price: "Br120.00" },
    { name: "Iced Americano", img: "/images/iced-americano.jpg", price: "Br150.00" },
  ];

  const pastries = [
    { name: "Croissant", img: "/images/croissant.jpg", price: "Br300.00" },
    { name: "Cinnamon Roll", img: "/images/cinnamon-roll.jpg", price: "Br300.50" },
    { name: "Churros", img: "/images/churros.jpg", price: "Br600.00" },
    { name: "Tiramisu", img: "/images/tiramisu.jpg", price: "Br500.00" },
  ];

  return (
    <main className="menu-page">
      <div className="menu-content">

        <section className="gloal-hero">
          <h1>Our Menu</h1>
          <p>Freshly prepared drinks and pastries made daily.</p>
        </section>

        <section>
          <h2>Coffee</h2>
          <div className="menu-row">
            {coffee.map((item, i) => (
              <div className="menu-card" key={i}>
                <img src={item.img} alt={item.name} />
                <h3>{item.name}</h3>
                <p className="price">{item.price}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Pastries</h2>
          <div className="menu-row">
            {pastries.map((item, i) => (
              <div className="menu-card" key={i}>
                <img src={item.img} alt={item.name} />
                <h3>{item.name}</h3>
                <p className="price">{item.price}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
