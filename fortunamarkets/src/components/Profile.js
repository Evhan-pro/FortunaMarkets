import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const Profile = () => {
  const [portfolioValue, setPortfolioValue] = useState([]);
  const [timeframe, setTimeframe] = useState('1h'); // Plage de temps sélectionnée

  useEffect(() => {
    const fetchPortfolioValue = async () => {
      // Exemple de requête pour récupérer la valeur du portefeuille
      const response = await fetch('http://localhost:5000/portfolio-value', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setPortfolioValue(data);
    };

    fetchPortfolioValue();
    const intervalId = setInterval(fetchPortfolioValue, 10000); // Rafraîchir toutes les 10 secondes
    return () => clearInterval(intervalId);
  }, []);

  const chartData = {
    labels: portfolioValue.map((point) => point.date), // Adapter en fonction de vos données
    datasets: [
      {
        label: 'Valeur du portefeuille',
        data: portfolioValue.map((point) => point.value),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="profile-container">
      <h2>Mon Portefeuille</h2>
      <div className="timeframe-buttons">
        {['1h', '1d', '1w', '1m', '3m', '6m', '1y', 'all'].map((period) => (
          <button key={period} onClick={() => setTimeframe(period)}>
            {period.toUpperCase()}
          </button>
        ))}
      </div>
      <Line data={chartData} />
    </div>
  );
};

export default Profile;
