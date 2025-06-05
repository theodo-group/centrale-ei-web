import { useParams } from 'react-router-dom';
import { useState, useEffect} from 'react';
import axios from 'axios';

function MovieDetail({ userId }) {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const GENRES = {
  28: 'Action',
  12: 'Aventure',
  16: 'Animation',
  35: 'Comédie',
  80: 'Crime',
  99: 'Documentaire',
  18: 'Drame',
  10751: 'Famille',
  14: 'Fantastique',
  36: 'Histoire',
  27: 'Horreur',
  10402: 'Musique',
  9648: 'Mystère',
  10749: 'Romance',
  878: 'Science-Fiction',
  10770: 'Téléfilm',
  53: 'Thriller',
  10752: 'Guerre',
  37: 'Western',
  // Genres séries TV
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics'
};

  const handleClick = (star) => setRating(star);
  const handleDoubleClick = () => setRating(0);
  const handleSubmit = (e) => {
  e.preventDefault();
  if (rating === 0 && comment.trim() === '') return;
  axios.post('http://localhost:8000/ratings', {
    user_id: userId, // <-- ici on utilise le user sélectionné
    movie_id: movie.id,
    rating,
    comment,
  }).then(() => setSubmitted(true));
};

  useEffect(() => {
    axios.get(`http://localhost:8000/movies/${id}`)
      .then(res => setMovie(res.data))
      .catch(() => setMovie(null));
  }, [id]);
  

  if (!movie) {
    return <div style={{ color: 'white', padding: '40px' }}>Chargement...</div>;
  }

  return (
    <div style={{ color: 'white', padding: '40px' }}>
      <h1>{movie.title}</h1>
      <p>Année : {movie.year}</p>
      <p>Note : {movie.vote_average ?? 'Non noté'}</p>
     <p>
      Genre :{' '}
      {Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0
        ? movie.genre_ids
            .map((id) => GENRES[parseInt(id, 10)] || id)
            .join(', ')
        : 'Non renseigné'}
    </p>
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          style={{ borderRadius: '10px', marginBottom: '20px' }}
        />
      )}

      <p style={{ maxWidth: 600 }}>{movie.overview}</p>
  
      <div style={{ marginTop: '20px' }}>
        <p>A quel point as-tu apprécié ce film ?  :</p>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleClick(star)}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            style={{
              cursor: 'pointer',
              fontSize: '30px',
              color: (hover || rating) >= star ? 'gold' : 'gray',
              marginRight: '5px',
              transition: 'color 0.2s',
              userSelect: 'none',
            }}
          >
            ★
          </span>
        ))}
        {rating > 0 && (
          <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
            Merci pour ta note
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
        <label htmlFor="comment" style={{ display: 'block', marginBottom: '10px' }}>
          Un commentaire ?:
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            resize: 'none',
          }}
          placeholder="Écris ce que tu as pensé du film..."
        />
        <button
          type="submit"
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Envoyer
        </button>
      </form>

      {submitted && (
        <p style={{ marginTop: '15px', color: 'lightgreen' }}>
          Merci pour ton avis ! 🎬
        </p>
      )}
    </div>
  );
}

export default MovieDetail;

