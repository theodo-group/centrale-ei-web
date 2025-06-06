const express = require('express');
const { getRecommendations } = require('../controllers/recommendations.js');

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const recommendations = await getRecommendations(req.params.userId);
    res.json(recommendations);
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

router.get('/', async (req, res) => {
  try {
    const recommendations = await getRecommendations();
    res.json(recommendations);
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

module.exports = router;
