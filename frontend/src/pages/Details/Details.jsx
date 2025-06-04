import { useEffect, useState } from 'react';
import './Details.css';

const posterURL = 'https://image.tmdb.org/t/p/w500';

const dateFr = new Date('2001-11-16').toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

function StarRating({ storageKey = 'userRating' }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setRating(parseFloat(saved));
    }
  }, [storageKey]);

  const handleClick = (e, starIndex) => {
    const { left, width } = e.target.getBoundingClientRect();
    const x = e.clientX - left;
    const newRating = x < width / 2 ? starIndex + 0.5 : starIndex + 1;

    const final = newRating === rating ? 0 : newRating;
    setRating(final);
    localStorage.setItem(storageKey, final);
  };

  const handleMouseMove = (e, starIndex) => {
    const { left, width } = e.target.getBoundingClientRect();
    const x = e.clientX - left;
    const hover = x < width / 2 ? starIndex + 0.5 : starIndex + 1;
    setHoverRating(hover);
  };

  const displayValue = hoverRating || rating;

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => {
        let className = 'star';
        if (displayValue >= i + 1) {
          className += ' full';
        } else if (displayValue >= i + 0.5) {
          className += ' half';
        }

        return (
          <span
            key={i}
            className={className}
            onClick={(e) => handleClick(e, i)}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => setHoverRating(0)}
            style={{ cursor: 'pointer' }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

function Details() {
  return (
    <div className="App-content">
      <img
        className="poster"
        src={posterURL + '/fbxQ44VRdM2PVzHSNajUseUteem.jpg'}
        alt="Affiche du film"
      />
      <div className="text-content">
        <h1>Harry Potter à l'école des sorciers</h1>
        <h2>Harry Potter and the Philosopher's Stone</h2>
        <h3>{'Date de sortie : ' + dateFr}</h3>
        <p>
          {
            "Orphelin, le jeune Harry Potter peut enfin quitter ses tyranniques oncle et tante Dursley lorsqu'un curieux messager lui révèle qu'il est un sorcier. À 11 ans, Harry va enfin pouvoir intégrer la légendaire école de sorcellerie de Poudlard, y trouver une famille digne de ce nom et des amis, développer ses dons, et préparer son glorieux avenir."
          }
        </p>
        <h4>{'Note des spectateurs : ' + '3.95'}</h4>
        <StarRating storageKey="noteHarryPotter" />
      </div>
    </div>
  );
}

export default Details;
