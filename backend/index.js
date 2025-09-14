const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4322;
const Portfolio = require('./models/Portfolio.js');
const User = require('./models/User.js');

app.get('/', (req, res) => {
  res.send('server is up idk');
});

app.listen(PORT, () => {
  console.log('Server running on port 4322');
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.post('/portfolio', async (req, res) => {
  try {
    if (User.plan === 'free') {
      const count = await Portfolio.countDocuments({ userId: req.user.id });
      if (count > 1) {
        return res.status(400).json({ error: 'Free plans allow 1 portfolio. Please upgrade for more' });
      }
    }
    const portfolio = new Portfolio({
      ...req.body, userId: req.user.id
    });
    await portfolio.save();
    res.status(201).send(portfolio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/portfolio', auth, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user.id });
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/portfolio/:userId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.params.userId });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    return res.status(200).json(portfolio);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/register', async (req, res) => {
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

app.post('/login', async (req, res) => {
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token, auth denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

app.patch('/upgrade', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({error: 'User not found'});

    user.plan = 'pro';
    await user.save();

    res.json({message: 'Upgraded successfully', plan: user.plan});
  } catch (err) {
    res.status(500).json({error: 'Server error'});
  }
});

app.put('/portfolio/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      {_id: req.params.id, userId: req.user.id },
      { ...req.body },
      { new: true }
    );
    if (!portfolio) {
      return res.status(404).json({error: 'Portfolio not found' });
      res.json(portfolio);
    }
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/portfolio/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    res.json({ message: 'Portfolio deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});