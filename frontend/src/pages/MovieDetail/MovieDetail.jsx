import { useParams } from 'react-router-dom';
import { useState } from 'react';

function MovieDetail() {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleClick = (star) => setRating(star);
  const handleDoubleClick = () => setRating(0);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 && comment.trim() === '') return;
    // Tu peux ici envoyer la note + commentaire à ton backend
    console.log('Commentaire envoyé :', { id, rating, comment });
    setSubmitted(true);
  };

  return (
    <div style={{ color: 'white', padding: '40px' }}>
      <h1>Détails du film {id}</h1>

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



