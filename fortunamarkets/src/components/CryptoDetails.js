import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CryptoDetails.css'; // Fichier CSS pour les styles

const CryptoDetails = () => {
  const { id } = useParams(); // Récupère l'id de la crypto
  const [orderBook, setOrderBook] = useState([]); // Carnet d'ordres
  const [recentTrades, setRecentTrades] = useState([]); // Transactions récentes
  const [availableCryptos, setAvailableCryptos] = useState([]); // Cryptos disponibles pour trading
  const [selectedCrypto, setSelectedCrypto] = useState(id); // Crypto sélectionnée pour l'achat/vente
  const [price, setPrice] = useState(''); // Prix sélectionné pour l'achat/vente
  const [amount, setAmount] = useState(''); // Montant de crypto à acheter ou vendre

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      new window.TradingView.widget({
        symbol: selectedCrypto.toUpperCase() + "USD",  // Exemple : BTCUSD
        width: "100%",
        height: "500px",
        interval: "60",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "fr",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_legend: false,
        save_image: false,
        container_id: "tradingview_chart"
      });
    };

    fetchOrderBook();
    fetchRecentTrades();
    fetchAvailableCryptos();

    return () => {
      document.body.removeChild(script);
    };
  }, [selectedCrypto]);

  const fetchOrderBook = async () => {
    // Simuler la récupération des données du carnet d'ordres
    setOrderBook([
      { price: '66942.00', amount: '0.1', type: 'sell' },
      { price: '66941.50', amount: '0.05', type: 'buy' },
    ]);
  };

  const fetchRecentTrades = async () => {
    // Simuler des données de transactions récentes
    setRecentTrades([
      { price: '66942.00', amount: '0.1', type: 'buy', time: '18:32:36' },
      { price: '66941.80', amount: '0.2', type: 'sell', time: '18:32:20' },
    ]);
  };

  const fetchAvailableCryptos = async () => {
    // Appel API pour récupérer la liste des cryptomonnaies disponibles (CoinGecko par exemple)
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
    const data = await response.json();
    setAvailableCryptos(data);
  };

  const handleBuy = () => {
    alert(`Achat de ${amount} ${selectedCrypto.toUpperCase()} à ${price} USD`);
  };

  const handleSell = () => {
    alert(`Vente de ${amount} ${selectedCrypto.toUpperCase()} à ${price} USD`);
  };

  const handleCryptoChange = (e) => {
    setSelectedCrypto(e.target.value);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-light mb-4">Détails de la Cryptomonnaie : {selectedCrypto.toUpperCase()}</h2>
      <div className="row">
        {/* Section du graphique TradingView */}
        <div className="col-md-7">
          <div id="tradingview_chart"></div>
        </div>

        {/* Section du Carnet d'ordres */}
        <div className="col-md-5">
          <h4 className="text-light">Carnet d'ordres</h4>
          <div className="order-book">
            <table className="table table-dark">
              <thead>
                <tr>
                  <th>Prix (USD)</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                {orderBook.map((order, index) => (
                  <tr key={index} className={order.type === 'sell' ? 'text-danger' : 'text-success'}>
                    <td>{order.price}</td>
                    <td>{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section des Trades récents */}
      <div className="row mt-4">
        <div className="col-md-7">
          <h4 className="text-light">Transactions récentes</h4>
          <div className="recent-trades">
            <table className="table table-dark">
              <thead>
                <tr>
                  <th>Prix (USD)</th>
                  <th>Montant</th>
                  <th>Type</th>
                  <th>Heure</th>
                </tr>
              </thead>
              <tbody>
                {recentTrades.map((trade, index) => (
                  <tr key={index} className={trade.type === 'buy' ? 'text-success' : 'text-danger'}>
                    <td>{trade.price}</td>
                    <td>{trade.amount}</td>
                    <td>{trade.type === 'buy' ? 'Achat' : 'Vente'}</td>
                    <td>{trade.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section de Formulaire d'Achat et Vente */}
        <div className="col-md-5">
          <h4 className="text-light">Formulaire d'Achat / Vente</h4>
          <div className="trade-form">
            <form>
              <div className="form-group">
                <label>Cryptomonnaie</label>
                <select className="form-control" value={selectedCrypto} onChange={handleCryptoChange}>
                  {availableCryptos.map((crypto) => (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.name} ({crypto.symbol.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Prix (USD)</label>
                <input type="text" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Prix" />
              </div>
              <div className="form-group">
                <label>Montant</label>
                <input type="text" className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Montant" />
              </div>
              <div className="d-flex justify-content-between mt-3">
                <button type="button" className="btn btn-success" onClick={handleBuy}>
                  Acheter
                </button>
                <button type="button" className="btn btn-danger" onClick={handleSell}>
                  Vendre
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetails;
