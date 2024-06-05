import { useParams } from 'react-router-dom';
import './DetailsMovie.css';

function DetailsMovie(props) {

    let {idMovie} = useParams();
    
    return (
      <div>
        Bonjour {idMovie}
      </div>
    );
  }
  
  export default DetailsMovie;