import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState(''); // success or error
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifie si l'inscription a réussi
    if (localStorage.getItem('registrationSuccess') === 'true') {
      setNotificationMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setNotificationType('success');
      setShowNotification(true);
      localStorage.removeItem('registrationSuccess');
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
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Stocke le token, l'image de profil et l'ID dans le localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('profile_image', data.user.profile_image);
        localStorage.setItem('user_id', data.user.id);
  
        // Redirige l'utilisateur vers la page de profil
        navigate('/profile');
      } else {
        setNotificationMessage(data.message || 'Email ou mot de passe incorrect');
        setNotificationType('error');
        setShowNotification(true);
        startProgressBar();
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setNotificationMessage('Une erreur est survenue. Veuillez réessayer.');
      setNotificationType('error');
      setShowNotification(true);
      startProgressBar();
    }
  };  

  return (
    <>
      {showNotification && (
        <div className={`notification ${notificationType}`}>
          <button className="close-btn" onClick={handleCloseNotification}>✕</button>
          <span>{notificationMessage}</span>
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
