import './About.css';
import RecommendationSection from '../../components/RecommendationSection/RecommendationSection';
import useFetchMovies from '../Home/useFetchMovies';

function About() {
  const [movieName, setMovieName] = useState('');
  const movies = useFetchMovies();

  return (
    <div className="App">
      <header className="App-header">
        <div className="about">about page</div>
        {/* <RecommendationSection recommendations={movies} /> */}
      </header>
    </div>
  );
}

export default About;
