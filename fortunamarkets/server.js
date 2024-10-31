const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configurer la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // Mets ton mot de passe ici
  database: 'FortunaMarkets'
});

// Connecter à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
  } else {
    console.log('Connecté à la base de données MySQL.');
  }
});

// Clé secrète pour signer les JWT
const JWT_SECRET = 'your_jwt_secret_key';

// Route pour l'inscription
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Vérifier si l'utilisateur existe déjà
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
    if (result.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà enregistré' });
    }

    // Hacher le mot de passe
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur lors du hachage du mot de passe' });
      }

      // Insérer le nouvel utilisateur dans la base de données
      db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Erreur lors de l\'enregistrement' });
        }
        res.status(201).json({ message: 'Inscription réussie' });
      });
    });
  });
});

// Route pour la connexion
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Vérifier si l'utilisateur existe
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
    if (result.length === 0) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = result[0];

    // Comparer le mot de passe
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur interne' });
      }
      if (!isMatch) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Créer un token JWT
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      res.json({
        message: 'Connexion réussie',
        token,
        user: {
          email: user.email,
          profile_image: user.profile_image
        }
      });
    });
  });
});

// Route protégée avec vérification du token
app.get('/profile', (req, res) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  // Vérifier et décoder le token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    const userId = decoded.id;

    // Récupérer les infos de l'utilisateur à partir de la base de données
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, result) => {
      if (err || result.length === 0) {
        return res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
      }

      const user = result[0];
      res.json({
        email: user.email,
        profile_image: user.profile_image
      });
    });
  });
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
