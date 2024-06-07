// Système d'info basé sur le contenu
// Evaluation sous forme de notes
SELECT * FROM movie ORDER BY 
    (SELECT SUM(score FROM score 
        JOIN movie ON movie.movieId = score.movieId 
        JOIN movie_genres_genre ON movie.movieId=movie_genres_genre.movieId 
        JOIN genre ON genre.id = movie_genres_genre.genreId) )


// donne le score de chaque genre
SELECT SUM(score.score), score.moviesId, score.usersId, mgg.genreId FROM score JOIN movie ON movie.id = score.moviesId JOIN movie_genres_genre AS mgg ON mgg.movieId = movie.id WHERE "usersId"=1 GROUP BY mgg.genreId

