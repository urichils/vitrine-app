const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4322;
const Portfolio = require('./models/Portfolio.js');
const User = require('./models/User.js');
const auth = require('./middleware/auth.js');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use('/auth', require('./routes/authRoutes.js'));
app.use('/portfolio', require('./routes/portfolioRoutes.js'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
  res.send('server is up idk');
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});


app.patch('/upgrade', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({error: 'User not found'});

    user.plan = 'pro';
    await user.save();

    res.json({message: 'Upgraded successfully', plan: user.plan});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});

app.get('/p/:slug', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug }).populate('userId', 'email');
    if (!portfolio) return res.status(404).json({ error: 'Not found' });
    res.json(portfolio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
})

router.post('/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, password: "", googleId });
    }

    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h",});

    res.json({ token: authToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});