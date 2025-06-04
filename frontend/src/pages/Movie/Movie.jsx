function Movie({ movie, rank }) {
  // Date au format français, ou vide si pas dispo
  const releaseDate = movie.release_date || movie.first_air_date || '';
  const formattedDate = releaseDate
    ? new Date(releaseDate).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <div
      style={{
        position: 'relative',
        width: '180px',
        backgroundColor: '#222',
        borderRadius: '8px',
        overflow: 'hidden',
        color: 'white',
        boxShadow: '0 0 10px rgba(0,0,0,0.7)',
      }}
    >
      
      {rank && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: '#e50914',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 0 5px rgba(0,0,0,0.5)',
            zIndex: 10,
          }}
        >
          {rank}
        </div>
      )}

      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title || movie.name}
        style={{ width: '100%', display: 'block' }}
      />

      <div style={{ padding: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', minHeight: '40px' }}>
          {movie.title || movie.name}
        </h3>
        {formattedDate && (
          <p
            style={{
              margin: '5px 0 0 0',
              fontSize: '0.85rem',
              color: '#bbb',
            }}
          >
            {formattedDate}
          </p>
        )}
      </div>
    </div>
  );
}

export default Movie;
