import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import LivePrices from './LivePrices'; // Affichage des cours en direct
import Services from './Services'; // Les services proposés (ex : Staking, Trading)
import BannerCarousel from './BannerCarousel'; // Bannières rotatives

const Home = () => {
  return (
    <div className="home-container">
      {/* Navbar avec menu avancé */}
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/img/logo.png" alt="Logo" className="navbar-logo-image" />
          </Link>
        </div>
        <ul className="navbar-links">
          <li className="dropdown">
            <Link to="/markets">Marchés</Link>
            <div className="dropdown-content">
              {/* Modification ici pour changer le lien vers la liste des cryptomonnaies */}
              <Link to="/crypto">Cryptomonnaies</Link> 
              <Link to="/stocks">Actions</Link>
              <Link to="/etf">ETF</Link>
            </div>
          </li>
          <li><Link to="/about">À propos</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/login" className="login-btn">Se connecter</Link></li>
        </ul>
      </nav>

      {/* Section des prix en direct */}
      <section className="live-prices-section">
        <LivePrices />
      </section>

      {/* Services proposés */}
      <section className="services-section">
        <h2>Nos Services</h2>
        <Services />
      </section>

      {/* Appel à l'action avec effet parallaxe */}
      <section className="cta-section parallax">
        <h2>Commencez votre voyage avec Fortuna Markets</h2>
        <Link to="/register" className="cta-btn">Créer un compte</Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Fortuna Markets. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
