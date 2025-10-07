const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 4322;
const Portfolio = require('./models/Portfolio.js');
const User = require('./models/User.js');
const auth = require('./middleware/auth.js');

app.use('/auth', require('./routes/authRoutes.js'));
app.use('/portfolio', require('./routes/portfolioRoutes.js'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
  res.send('server is up idk');
});

app.listen(PORT, () => {
  console.log('Server running on port 4322');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// app.post('/portfolio', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     if (user.plan === 'free') {
//       const count = await Portfolio.countDocuments({ userId: req.user.id });
//       if (count > 1) {
//         return res.status(400).json({ error: 'Free plans allow 1 portfolio. Please upgrade for more' });
//       }
//     }

//     if (!req.body.slug) {
//       return res.status(400).json({ error : 'Username required' });
//     }

//     const slug = req.body.slug.toLowerCase();

//     const exists = await Portfolio.findOne({ slug: new RegExp(`^${slug}$`, 'i') });

//     if (exists) {
//       return res.status(400).json({ error: 'Username already in use' });
//     }

//     // while (exists) {
//     //   slug = generateSlug(req.body.name || 'site');
//     //   exists = await Portfolio.findOne({ slug });
//     // }

//     const portfolio = new Portfolio({
//       ...req.body, userId: req.user.id
//     });
//     await portfolio.save();
//     res.status(201).send(portfolio);

//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: error.message });
//   }
// });

// app.get('/portfolio', auth, async (req, res) => {
//   try {
//     const portfolios = await Portfolio.find({ userId: req.user.id });
//     res.json(portfolios);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get('/portfolio/:userId', async (req, res) => {
//   try {
//     const portfolio = await Portfolio.findOne({ userId: req.params.userId });
//     if (!portfolio) {
//       return res.status(404).json({ error: 'Portfolio not found' });
//     }
//     return res.status(200).json(portfolio);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: error.message });
//   }
// });

// app.post('/register', async (req, res) => {
//   console.log('route hit req.body:', req.body);
//   try {
//     const { email, password } = req.body;

//     const existing = await User.findOne({ email });
//     if (existing) {
//       return res.status(400).json({ error: 'User already exists' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash(password, salt);

//     const user = new User({ email, password: hashed });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(200).json({ token });
//   } catch {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

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

// app.put('/portfolio/:id', auth, async (req, res) => {
//   try {
//     const portfolio = await Portfolio.findOneAndUpdate(
//       {_id: req.params.id, userId: req.user.id },
//       { ...req.body },
//       { new: true }
//     );
//     if (!portfolio) {
//       return res.status(404).json({error: 'Portfolio not found' });
//     }
//     res.json(portfolio);
//   } catch(err) {
//     console.error(err);
//     res.status(400).json({ error: err.message });
//   }
// });

// app.delete('/portfolio/:id', auth, async (req, res) => {
//   try {
//     const portfolio = await Portfolio.findOneAndDelete({
//       _id: req.params.id,
//       userId: req.user.id
//     });
//     if (!portfolio) {
//       return res.status(404).json({ error: 'Portfolio not found' });
//     }
//     res.json({ message: 'Portfolio deleted' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

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

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// });

// const upload = multer({ storage });

// app.post('/portfolio/:portfolioId/section/:sectionIndex/upload', auth, upload.array('images', 5), async (req, res) => {
//   try {
//     const { portfolioId, sectionIndex } = req.params;
//     const portfolio = await Portfolio.findOne({ _id: portfolioId, userId: req.user.id });
//     if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

//     if (!portfolio.sections[sectionIndex]) return res.status(400).json({ error: 'Section not found' });

//     const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
//     const fileUrls = req.files.map(file => baseUrl + file.filename);
//     portfolio.sections[sectionIndex].images = fileUrls;

//     await portfolio.save();

//     res.json({ message: 'Images uploaded', images: fileUrls });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });