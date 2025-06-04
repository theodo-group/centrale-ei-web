import { useParams } from 'react-router-dom';

function MovieDetail() {
  const { id } = useParams();

  return (
    <div style={{ color: 'white', padding: '40px' }}>
      <h1>Détail du film {id}</h1>
      {/* Ajoute ici l'affichage des infos du film */}
    </div>
  );
}

export default MovieDetail;