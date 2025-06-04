import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout'; // ou le chemin correct vers votre Layout
import Home from './pages/Home/Home';
import Counter from './pages/Counter/Counter';
import Users from './pages/Users/Users';
import About from './pages/About/About'; // ou le chemin correct vers About
import MovieDetails from './pages/MovieDetails/MovieDetails';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="counter" element={<Counter />} />
        <Route path="users" element={<Users />} />
        <Route path="about" element={<About />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Layout>
  );
}

export default App;
