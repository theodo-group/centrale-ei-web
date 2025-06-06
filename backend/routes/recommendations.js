const express = require('express');
const router = express.Router();
const { recommendMovies } = require('../controllers/recommendations');

// GET /api/recommendations/:userId
router.get('/:userId', async (req, res) => {
  console.log('Route recommendations called for userId:', req.params.userId);
  const userId = parseInt(req.params.userId, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const movies = await recommendMovies(userId);

    if (!Array.isArray(movies)) {
      return res.status(500).json({ error: 'Invalid data from recommendation engine' });
    }

    res.json(movies);
  } catch (error) {
    console.error('Error in recommendation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
