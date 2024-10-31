import React, { useState, useEffect } from 'react';
import './PriceTable.css';

const Home = () => {
  const [cryptoPrices, setCryptoPrices] = useState([]);
  const [etfPrices, setEtfPrices] = useState([]);
  const [stockPrices, setStockPrices] = useState([]);
  const [activeTab, setActiveTab] = useState('crypto');
  const [loading, setLoading] = useState(true);

  const alphaVantageAPIKey = 'JMH3S8BBUZUURUSD';

  // Appel API pour obtenir les prix des cryptomonnaies
  useEffect(() => {
    const fetchCryptoPrices = async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,ripple,solana');
      const data = await response.json();
      setCryptoPrices(data);
    };

    const fetchEtfPrices = async () => {
      const symbols = ['VOO', 'SPY', 'QQQ', 'DIA', 'IWM'];
      const promises = symbols.map(symbol =>
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${alphaVantageAPIKey}`)
          .then(res => res.json())
      );
      const data = await Promise.all(promises);
      setEtfPrices(data.map(d => d['Global Quote']));
    };

    const fetchStockPrices = async () => {
      const symbols = ['AAPL', 'TSLA', 'AMZN', 'GOOGL', 'MSFT'];
      const promises = symbols.map(symbol =>
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${alphaVantageAPIKey}`)
          .then(res => res.json())
      );
      const data = await Promise.all(promises);
      setStockPrices(data.map(d => d['Global Quote']));
    };

    fetchCryptoPrices();
    fetchEtfPrices();
    fetchStockPrices();
    setLoading(false);
  }, []);

  // Gérer les onglets actifs
  const getActiveData = () => {
    switch (activeTab) {
      case 'crypto':
        return cryptoPrices.map(crypto => ({
          name: crypto.name,
          price: `$${crypto.current_price.toFixed(2)}`,
          change: crypto.price_change_percentage_24h.toFixed(2),
          icon: crypto.image,
        }));
      case 'etf':
        return etfPrices
          .filter(etf => etf && etf['01. symbol'] && etf['05. price'] && etf['10. change percent']) // Vérification des données
          .map(etf => ({
            name: etf['01. symbol'],
            price: `$${parseFloat(etf['05. price']).toFixed(2)}`,
            change: parseFloat(etf['10. change percent']).toFixed(2),
            icon: '', // Pas d'icône spécifique pour les ETF
          }));
      case 'stocks':
        return stockPrices
          .filter(stock => stock && stock['01. symbol'] && stock['05. price'] && stock['10. change percent']) // Vérification des données
          .map(stock => ({
            name: stock['01. symbol'],
            price: `$${parseFloat(stock['05. price']).toFixed(2)}`,
            change: parseFloat(stock['10. change percent']).toFixed(2),
            icon: '', // Pas d'icône spécifique pour les actions
          }));
      default:
        return [];
    }
  };
  

  return (
    <div className="home-containers">
      {/* Texte sur la gauche */}
      <div className="left-section">
        <h1>
          235,470,184<br />
          Utilisateurs nous font confiance
        </h1>
        <p>Adresse e-mail ou N° de téléphone</p>
        <div className="cta-buttons">
          <input type="email" placeholder="Adresse e-mail ou N° de téléphone" />
          <button className="cta-start">Commencer</button>
        </div>
        {/* <p className="other-options">Ou continuez avec :</p>
        <div className="login-options">
          <button className="google-login">Google</button>
          <button className="apple-login">Apple</button>
        </div> */}
      </div>

      {/* Tableau des prix sur la droite */}
      <div className="right-section">
        <div className="price-table-container">
          <div className="tabs">
            <button className={activeTab === 'crypto' ? 'active' : ''} onClick={() => setActiveTab('crypto')}>
              Cryptomonnaies
            </button>
            <button className={activeTab === 'etf' ? 'active' : ''} onClick={() => setActiveTab('etf')}>
              ETF
            </button>
            <button className={activeTab === 'stocks' ? 'active' : ''} onClick={() => setActiveTab('stocks')}>
              Actions
            </button>
          </div>
          <div className="price-list">
            {loading ? (
              <p>Chargement...</p>
            ) : (
              getActiveData().map((asset, index) => (
                <div key={index} className="price-row">
                  {asset.icon && <span className="asset-icon"><img src={asset.icon} alt={asset.name} width="20" /></span>}
                  <span className="asset-name">
                    <strong>{asset.name}</strong>
                  </span>
                  <span className="asset-price">{asset.price}</span>
                  <span className={`asset-change ${asset.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {asset.change}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
