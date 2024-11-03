import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { FaHome, FaWallet, FaCog, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import './Profile.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, TimeScale);

const Profile = () => {
  const [portfolioValue, setPortfolioValue] = useState([]);
  const [timeframe, setTimeframe] = useState('1h');
  const [totalValue, setTotalValue] = useState(0);
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profile_image') || '/img/default-profile.jpg');
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Utilisateur');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioValue = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/portfolio-value?timeframe=${timeframe}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 403) {
          throw new Error("Accès refusé : Jeton d'authentification manquant ou invalide.");
        }

        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        setPortfolioValue(data.details || []);
        setTotalValue(data.totalValue || 0);
      } catch (error) {
        console.error("Erreur lors de la récupération de la valeur du portefeuille :", error);
        setError(error.message);
        setPortfolioValue([]);
        setTotalValue(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioValue();
  }, [timeframe]);

  const chartData = {
    labels: (portfolioValue || []).map((point) => point.date || ''),
    datasets: [
      {
        label: 'Valeur du portefeuille',
        data: (portfolioValue || []).map((point) => point.value || 0),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `$${tooltipItem.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeframe === '1h' ? 'minute' : timeframe === '1d' ? 'hour' : 'day',
          displayFormats: {
            minute: 'HH:mm',
            hour: 'MMM dd, HH:mm',
            day: 'MMM dd',
          },
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          callback: (value) => `$${value.toFixed(2)}`,
        },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
    },
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      // Ici, ajoutez une logique pour gérer l'upload vers le serveur
    }
  };

  return (
    <div className="profile-container">
      <div className="sidebar">
        <div className="logo">
          <img src="/img/Icon.png" alt="Logo" className="sidebar-icon-logo" />
          <img src="/img/logo.png" alt="Logo Déployé" className="sidebar-expanded-logo" />
        </div>

        <div className="profile-image-container">
          <label htmlFor="file-input">
            <img src={profileImage} alt="Profil" className="profile-image-large" />
            <FaUserEdit className="edit-icon" />
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <span className="username">{username}</span>
        </div>

        <ul className="sidebar-menu">
          <li className="menu-item" title="Accueil">
            <FaHome className="icon" />
            <span className="menu-text">Accueil</span>
          </li>
          <li className="menu-item" title="Portefeuille">
            <FaWallet className="icon" />
            <span className="menu-text">Portefeuille</span>
          </li>
          <li className="menu-item" title="Paramètres">
            <FaCog className="icon" />
            <span className="menu-text">Paramètres</span>
          </li>
        </ul>

        <div className="logout-container">
          <FaSignOutAlt className="icon logout-icon" title="Déconnexion" />
        </div>
      </div>

      <div className="content">
        <h2>Mon Portefeuille</h2>
        <div className="total-value-display">
          <h3>Total : ${totalValue.toFixed(2)}</h3>
        </div>
        <div className="timeframe-buttons">
          {['1h', '1d', '1w', '1m', '3m', '6m', '1y', 'all'].map((period) => (
            <button key={period} onClick={() => setTimeframe(period)}>
              {period.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="chart-container">
          {loading ? (
            <p>Chargement des données...</p>
          ) : error ? (
            <p>Erreur : {error}</p>
          ) : (
            <Line data={chartData} options={chartOptions} key={timeframe} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
