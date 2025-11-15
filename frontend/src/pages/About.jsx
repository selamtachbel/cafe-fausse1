import "../styles/About.css";

export default function About() {
  return (
    <main className="page about-page">
      <section className="about-card">
        <header className="about-header">
          <h1>About Café Fausse</h1>
          <p>
            A neighborhood café in Addis Ababa serving specialty coffee,
            fresh pastries, and relaxed evenings with friends.
          </p>
        </header>

        <div className="about-content">
          <div className="about-story">
            <p>
              Café Fausse was created as a cozy escape from busy city life.
              We focus on simple things done well: carefully roasted coffee,
              homemade desserts, and a warm, welcoming atmosphere.
            </p>
            <p>
              Whether you&apos;re meeting friends, catching up on work,
              or just enjoying a quiet moment with a book, our baristas
              are here to make sure every visit feels special.
            </p>
            <p>
              We also host small gatherings, tasting events, and seasonal
              specials throughout the year.
            </p>

            <span className="about-badge">Since 2025</span>
          </div>

          <aside className="about-info">
            <h2>Visit Us</h2>

            <div className="about-info-section">
              <h3>Location</h3>
              <p>Addis Ababa</p>
              <p>Central district, near main street</p>
            </div>

            <div className="about-info-section">
              <h3>Opening Hours</h3>
              <p>Monday – Friday: 8:00 AM – 10:00 PM</p>
              <p>Saturday – Sunday: 9:00 AM – 11:00 PM</p>
            </div>

            <div className="about-info-section">
              <h3>Contact</h3>
              <p>Phone: +251-900-000000</p>
              <p>Email: hello@cafefausse.com</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
