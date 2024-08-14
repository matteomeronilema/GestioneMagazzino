require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// Costanti per la durata dei token
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const app = express();
app.use(express.json());
app.use(cors());

const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
      'view_inventory',
      'edit_inventory',
      'delete_inventory',
      'view_reservations',
      'manage_reservations',
      'view_reports',
      'manage_users'
  ],
  [ROLES.USER]: [
      'view_inventory',
      'edit_inventory',
      'view_reservations',
      'view_reports'
  ]
};

module.exports = { ROLES, ROLE_PERMISSIONS };

// Usa le variabili d'ambiente per le chiavi segrete
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  console.error('Token secrets not set in environment variables');
  process.exit(1);
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user || !ROLE_PERMISSIONS[req.user.role].includes(requiredPermission)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next();
  };
};

app.get('/verify-token', authenticateToken, (req, res) => {
  res.json({ 
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      permissions: ROLE_PERMISSIONS[req.user.role]
    } 
  });
});

// Simula un database di utenti
const users = [
  { id: 1, username: 'admin', password: '$2b$10$4nNBlNQbaThbWPexut5vf.z.CxMq.7jeYxkn.x.e6eu3IBgf2hef6', role: ROLES.ADMIN },
  { id: 2, username: 'dipendente', password: '$2b$10$fGSEzwBRFO4mSDkLkrbvIOTM3mHynzvoLRtQu9IPD2y5b.Bn50ulK', role: ROLES.USER }
];

const blacklistedTokens = new Set();

app.post('/reservations/:id/accept', authenticateToken, checkPermission('manage_reservations'), (req, res) => {
  const reservationId = req.params.id;
  console.log(`Accettazione prenotazione con ID: ${reservationId}`);
  // Qui dovresti implementare la logica per aggiornare il database
  // Per ora, simuliamo una risposta di successo
  res.json({ message: 'Prenotazione accettata con successo', id: reservationId });
});

app.post('/reservations/:id/reject', authenticateToken, checkPermission('manage_reservations'), (req, res) => {
  const reservationId = req.params.id;
  console.log(`Rifiuto prenotazione con ID: ${reservationId}`);
  // Qui dovresti implementare la logica per aggiornare il database
  // Per ora, simuliamo una risposta di successo
  res.json({ message: 'Prenotazione rifiutata con successo', id: reservationId });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user && await bcrypt.compare(password, user.password)) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Salva il refresh token (in un database nella pratica)
    user.refreshToken = refreshToken;

    res.json({ 
      accessToken, 
      refreshToken,
      user: { id: user.id, username: user.username, role: user.role, permissions: ROLE_PERMISSIONS[user.role] }
    });
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
});

app.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  const user = users.find(u => u.refreshToken === refreshToken);
  if (!user) return res.sendStatus(403);

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ id: user.id, username: user.username, role: user.role });
    res.json({ accessToken });
  });
});

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
}

app.post('/logout', authenticateToken, (req, res) => {
    const tokenId = req.user.tokenId;
    blacklistedTokens.add(tokenId);
    res.json({ message: 'Logout successful' });
});

app.get('/inventory', authenticateToken, checkPermission('view_inventory'), (req, res) => {
  res.json({ message: 'Inventory data' });
});

app.post('/inventory', authenticateToken, checkPermission('edit_inventory'), (req, res) => {
  res.json({ message: 'Product added to inventory' });
});

app.listen(3001, () => console.log('Server running on port 3001'));