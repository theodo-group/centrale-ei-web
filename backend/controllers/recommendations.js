import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.sqlite3');

export const getRecommendations = (req, res) => {
  const userId = req.params.userId;

  // Étape 1 : Récupérer les genres des films notés par l'utilisateur
  db.all(
    `SELECT g.name AS genre
     FROM ratings r
     JOIN movies m ON r.movie_id = m.id
     JOIN genres_movies gm ON m.id = gm.movie_id
     JOIN genres g ON gm.genre_id = g.id
     WHERE r.user_id = ?`,
    [userId],
    (err, genres) => {
      if (err) {
        console.error('Erreur lors de la récupération des genres :', err);

        return res.status(500).json({ error: 'Erreur interne du serveur' });
      }

      const genreNames = genres.map((g) => g.genre);

      // Étape 2 : Trouver des films similaires dans les genres notés
      db.all(
        `SELECT m.id, m.title, AVG(r.rating) AS average_rating
         FROM movies m
         JOIN genres_movies gm ON m.id = gm.movie_id
         JOIN genres g ON gm.genre_id = g.id
         LEFT JOIN ratings r ON m.id = r.movie_id
         WHERE g.name IN (?)
         GROUP BY m.id
         HAVING average_rating >= 3
         ORDER BY average_rating DESC
         LIMIT 5`,
        [genreNames.join(',')],
        (err, recommendations) => {
          if (err) {
            console.error(
              'Erreur lors de la récupération des recommandations :',
              err
            );

            return res.status(500).json({ error: 'Erreur interne du serveur' });
          }

          res.json(recommendations);
        }
      );
    }
  );
};
