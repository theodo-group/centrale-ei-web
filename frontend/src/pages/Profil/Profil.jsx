import './Profil.css';

const sampleMovies = [
  {
    id: 1,
    title: 'Inception',
    poster_path: '/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
  },
  {
    id: 2,
    title: 'Interstellar',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  },
  {
    id: 3,
    title: 'The Dark Knight',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  },
  // Ajoute d'autres films ici
];

const posterURL = 'https://image.tmdb.org/t/p/w500';

function Profil() {
  const user = {
    firstName: 'Jean',
    lastName: 'Dupont',
    avatar: '/chat.jpg', // Assure-toi d’avoir une image dans ton dossier public
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={user.avatar} alt="Avatar" className="profile-avatar" />
        <h1>
          {user.firstName} {user.lastName}
        </h1>
      </div>

      <div className="profile-section">
        <h2>Votre collection :</h2>
        <div className="profile-movie-list">
          {sampleMovies.map((movie) => (
            <div key={movie.id} className="profile-movie-item">
              <img
                src={posterURL + movie.poster_path}
                alt={movie.title}
                className="profile-movie-poster"
              />
              <p>{movie.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profil;