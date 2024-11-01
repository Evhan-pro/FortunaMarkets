import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import './CryptoList.css'; // Fichier CSS personnalisé

const CryptoList = () => {
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('market_cap_desc'); // par défaut, tri par market cap descendant
  const [currency, setCurrency] = useState('usd');

  useEffect(() => {
    fetchData();
  }, [sortType, currency]);

  const fetchData = () => {
    // Appel API pour récupérer la liste des cryptos avec devise et tri dynamique
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${sortType}&sparkline=true`
    )
      .then((response) => response.json())
      .then((data) => {
        setCryptos(data);
      })
      .catch((error) =>
        console.error('Erreur lors de la récupération des données des cryptos :', error)
      );
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortType(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {/* Menu de Navigation */}
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

      {/* Barre de recherche, filtres et changement de devise */}
      <div className="row mb-4 mt-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher une cryptomonnaie"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-md-4">
          <select className="form-control" value={sortType} onChange={handleSortChange}>
            <option value="market_cap_desc">Capitalisation décroissante</option>
            <option value="market_cap_asc">Capitalisation croissante</option>
            <option value="volume_desc">Volume décroissant</option>
            <option value="volume_asc">Volume croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="price_asc">Prix croissant</option>
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-control" value={currency} onChange={handleCurrencyChange}>
            <option value="usd">USD - Dollar US</option>
            <option value="eur">EUR - Euro</option>
            <option value="gbp">GBP - Livre Sterling</option>
          </select>
        </div>
      </div>

      <h2 className="text-light mb-4">Liste des Cryptomonnaies</h2>
      <table className="table table-dark table-hover">
        <thead>
          <tr>
            <th>Marché</th>
            <th>Prix</th>
            <th>Tendance sur 24h</th>
            <th>24h %</th>
            <th>Volume</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCryptos.map((crypto) => (
            <tr key={crypto.id}>
              <td>
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  style={{ width: '24px', marginRight: '10px' }}
                />
                {crypto.symbol.toUpperCase()}/{currency.toUpperCase()}
              </td>
              <td>
                {crypto.current_price
                  ? new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: currency.toUpperCase(),
                    }).format(crypto.current_price)
                  : 'N/A'}
              </td>
              <td>
                <Sparklines data={crypto.sparkline_in_7d ? crypto.sparkline_in_7d.price : []} width={100} height={20}>
                  <SparklinesLine
                    color={crypto.price_change_percentage_24h >= 0 ? 'green' : 'red'}
                  />
                </Sparklines>
              </td>
              <td style={{ color: crypto.price_change_percentage_24h >= 0 ? 'green' : 'red' }}>
                {crypto.price_change_percentage_24h
                  ? crypto.price_change_percentage_24h.toFixed(2) + '%'
                  : 'N/A'}
              </td>
              <td>
                {crypto.total_volume
                  ? new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: currency.toUpperCase(),
                    }).format(crypto.total_volume)
                  : 'N/A'}
              </td>
              <td>
                <a href={`/crypto/${crypto.id}`} className="btn btn-primary">
                  Voir le Graphique
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoList;
