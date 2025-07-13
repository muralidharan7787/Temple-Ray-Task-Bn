const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../firebase');
const SECRET_KEY = 'temple-ray';

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const userDoc = await db.collection('users').doc(email).get();

    if (userDoc.exists) {
      return res.status(409).json({ message: 'Email already taken' }); // 409 = Conflict
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection('users').doc(email).set({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await db.collection('users').doc(email).get();

    if (!userDoc.exists) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = userDoc.data();
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });

  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
