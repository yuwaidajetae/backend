/*const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, 'secretKey');
    if (verified.role === 'admin') {
      res.json({ data: 'Secret data for admin!' });
    } else {
      res.json({ data: 'Secret data for user!' });
    }
  } catch {
    res.status(401).send('Invalid Token');
  }
});

module.exports = router;*/ 
// Det gröna är mikaels kod. Jag har försökt jobba utifrån den. 


require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SecretKey = process.env.SECRET_KEY;

const router = express.Router();



router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    let userPasswordHash;
    if (email === process.env.ADMIN_EMAIL) {
      userPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    } else if (email === process.env.USER_EMAIL) {
      userPasswordHash = process.env.USER_PASSWORD_HASH;
    } else {
      return res.status(401).json({ error: 'Invalid User' });
    }

    bcrypt.compare(password, userPasswordHash, (err, isPasswordValid) => {
      if (err || !isPasswordValid) {
        return res.status(401).json({ error: 'Invalid login' });
      }

      const role = (email === process.env.ADMIN_EMAIL) ? 'admin' : 'user';
      const token = jwt.sign({ email, role }, process.env.SECRET_KEY, { expiresIn: '1h' });

      console.log(`Login success for user: ${email}`);
      res.json({ token });
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    if (verified.role === 'admin') {
      res.json({ data: 'Secret data for admin!' });
    } else {
      res.json({ data: 'Secret data for user!' });
    }
  } catch {
    res.status(401).send('Invalid Token');
  }
});

module.exports = router;


