import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
    number: false,
  });

  useEffect(() => {
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
      number: /[0-9]/.test(password),
    });

    if (password.length < 8) {
      setProgress(25);
    } else if (password.length < 10) {
      setProgress(50);
    } else if (password.length < 12) {
      setProgress(75);
    } else {
      setProgress(100);
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setShowNotification(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('registrationSuccess', 'true');
        navigate('/login');
      } else {
        setErrorMessage(data.message || "Erreur lors de l'inscription");
        setShowNotification(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      setShowNotification(true);
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <>
      {showNotification && (
        <div className="notification error">
          <button className="close-btn" onClick={handleCloseNotification}>✕</button>
          <span>{errorMessage}</span>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      <div className="insc-container">
        <div className="auth-card">
          <h2>Inscription</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Nom d'utilisateur :</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
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
              <div className="password-strength-bar">
                <div
                  className="strength"
                  style={{
                    width: `${progress}%`,
                    backgroundColor:
                      progress < 50 ? 'red' : progress < 75 ? 'orange' : progress < 100 ? 'lightgreen' : 'green',
                  }}
                ></div>
              </div>
              <div className="password-critere">
                <p className={passwordCriteria.length ? 'valid' : 'invalid'}>Au moins 8 caractères</p>
                <p className={passwordCriteria.uppercase ? 'valid' : 'invalid'}>Au moins une majuscule</p>
                <p className={passwordCriteria.specialChar ? 'valid' : 'invalid'}>Au moins un caractère spécial</p>
                <p className={passwordCriteria.number ? 'valid' : 'invalid'}>Au moins un chiffre</p>
              </div>
            </div>
            <div className="form-group mb-3">
              <label>Confirmer le mot de passe :</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">S'inscrire</button>
          </form>

          {/* Bouton de retour à la page de connexion */}
          <button
            className="btn btn-secondary w-100 mt-3"
            onClick={() => navigate('/login')}
          >
            Retour à la page de connexion
          </button>
        </div>
      </div>
    </>
  );
};

export default Register;
