import { useState } from 'react'; // Ajoute ceci
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import Counter from './pages/Counter/Counter';
import Users from './pages/Users/Users';
import MovieDetail from './pages/MovieDetail/MovieDetail';

function App() {
  const [userId, setUserId] = useState(1); // Ajoute ceci
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home userId={userId} setUserId={setUserId} />} />
        <Route path="counter" element={<Counter />} />
        <Route path="users" element={<Users />} />
        <Route path="about" element={<About />} />
        <Route path="/movie/:id" element={<MovieDetail userId={userId} />} />
      </Routes>
    </Layout>
  );
}

export default App;