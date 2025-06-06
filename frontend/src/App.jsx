// src/App.jsx
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import Counter from './pages/Counter/Counter';
import Users from './pages/Users/Users';
import Details from './pages/Details/Details';
import Profil from './pages/Profil/Profil';
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="counter" element={<Counter />} />
          <Route path="details/:id" element={<Details />} />
          <Route path="users" element={<Users />} />
          <Route path="about" element={<About />} />
          <Route path="profil" element={<Profil />} />
        </Routes>
      </Layout>
    </UserProvider>
  );
}

export default App;
