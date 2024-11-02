import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si l'inscription a réussi
    if (localStorage.getItem('registrationSuccess') === 'true') {
      setShowNotification(true);
      localStorage.removeItem('registrationSuccess'); // Supprime l'indicateur après affichage
      startProgressBar();
    }
  }, []);

  const startProgressBar = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowNotification(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logique de connexion à implémenter ici
  };

  return (
    <>
      {showNotification && (
        <div className="notification">
          <button className="close-btn" onClick={handleCloseNotification}>✕</button>
          <span>Inscription réussie ! Vous pouvez maintenant vous connecter.</span>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      <div className="auth-container">
        <div className="auth-card">
          <h2>Connexion</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Email :</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Mot de passe :</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Se connecter</button>
          </form>
          <div className="text-center mt-3">
            <p>
              Nouveau sur la plateforme ? <Link to="/register">Inscrivez-vous</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
