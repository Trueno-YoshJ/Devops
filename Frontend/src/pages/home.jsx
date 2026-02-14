import "../components/home.css";

export default function Home() {
  return (
    <div className="home-container">
      <header className="hero">
        <div className="hero-content">
          <h1>Welcome to AutoCare Service Center</h1>
          <p>Your trusted partner for reliable vehicle maintenance & repair.</p>
          <a href="/login" className="hero-btn">
            Get Started
          </a>
        </div>
      </header>

      <section className="services">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <img
              src="https://img.icons8.com/ios-filled/100/4a90e2/car-service.png"
              alt="Maintenance"
            />
            <h3>General Maintenance</h3>
            <p>Keep your vehicle running smoothly with our expert care.</p>
          </div>

          <div className="service-card">
            <img
              src="https://img.icons8.com/ios-filled/100/16a34a/engine.png"
              alt="Engine Repair"
            />
            <h3>Engine Repair</h3>
            <p>Diagnosing and fixing engine issues with precision.</p>
          </div>

          <div className="service-card">
            <img
              src="https://img.icons8.com/ios-filled/100/f59e0b/tire.png"
              alt="Tire Service"
            />
            <h3>Tire & Brake Service</h3>
            <p>Ensuring your safety with quality tire & brake solutions.</p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>© {new Date().getFullYear()} AutoCare Service Center. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
