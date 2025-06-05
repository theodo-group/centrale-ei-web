import express from 'express';
const router = express.Router();
import { getRecommendations } from '../controllers/recommendations.js';


router.get('/', getRecommendations);

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const recommendations = await getRecommendations(userId);
    res.json(recommendations);
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des recommandations :',
      error
    );
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
