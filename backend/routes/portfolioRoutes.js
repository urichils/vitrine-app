const express = require('express');
const multer = require('multer');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.plan === 'free') {
      const count = await Portfolio.countDocuments({ userId: req.user.id });
      if (count > 1) {
        return res.status(400).json({ error: 'Free plans allow 1 portfolio. Please upgrade for more' });
      }
    }

    if (!req.body.slug) {
      return res.status(400).json({ error : 'Username required' });
    }

    const slug = req.body.slug.toLowerCase();

    const exists = await Portfolio.findOne({ slug: new RegExp(`^${slug}$`, 'i') });

    if (exists) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    // while (exists) {
    //   slug = generateSlug(req.body.name || 'site');
    //   exists = await Portfolio.findOne({ slug });
    // }

    const portfolio = new Portfolio({
      ...req.body, userId: req.user.id
    });
    await portfolio.save();
    res.status(201).send(portfolio);

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ userId: req.user.id });
    res.json(portfolios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.params.userId });
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    return res.status(200).json(portfolio);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      {_id: req.params.id, userId: req.user.id },
      { ...req.body },
      { new: true }
    );
    if (!portfolio) {
      return res.status(404).json({error: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch(err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
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
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/:portfolioId/section/:sectionIndex/upload', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { portfolioId, sectionIndex } = req.params;
    const portfolio = await Portfolio.findOne({ _id: portfolioId, userId: req.user.id });
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

    if (!portfolio.sections[sectionIndex]) {
      return res.status(400).json({ error: 'Section not found' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const fileUrls = req.files.map(file => baseUrl + file.filename);

    portfolio.sections[sectionIndex].images = fileUrls;
    await portfolio.save();

    res.json({ message: 'Images uploaded', images: fileUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;