const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrazione utente
router.post('/register', async (req, res) => {
  try {
    const { username, password, role, permissions } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role, permissions });
    await user.save();
    res.status(201).json({ message: 'Utente creato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nella creazione dell\'utente' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role, permissions: user.permissions },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token, user: { username: user.username, role: user.role, permissions: user.permissions } });
    } else {
      res.status(401).json({ message: 'Credenziali non valide' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Errore nel login' });
  }
});

// Ottieni tutti gli utenti (solo per admin)
router.get('/', async (req, res) => {
  try {
    // Qui dovresti aggiungere un middleware per verificare che l'utente sia admin
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero degli utenti' });
  }
});

module.exports = router;