const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    console.log('route hit req.body:', req.body);
    try {
        const { email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
        return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = new User({ email, password: hashed });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
})

module.exports = router;