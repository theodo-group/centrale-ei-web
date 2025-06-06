import { Link } from 'react-router-dom';
import './Header.css';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../UserContext';

function Header() {
  const [users, setUsers] = useState([]);
  const { selectedUserId, updateContext } = useContext(UserContext);
  console.log(selectedUserId);

  useEffect(() => {
    fetch('http://localhost:8000/users/prenoms')
      .then((res) => res.json())
      .then((data) => {
        console.log('Données reçues :', data);
        setUsers(data);
        console.log(
          'IDs des users:',
          data.map((u) => u.id)
        );
      })
      .catch(console.error);
  }, []);

  return (
    <header className="Header">
      <div className="Logo">
        <Link to="/">🍿 PopCorn Advisor</Link>
      </div>
      <nav className="NavLinks">
        <Link className="NavButton" to="/users">
          Users
        </Link>
        <Link className="NavButton" to="/about">
          About
        </Link>
        <Link className="NavButton" to="/profil">
          Profil
        </Link>
      </nav>
      <div
        style={{
          marginTop: '0px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <select
          value={selectedUserId ?? ''}
          onChange={(e) => updateContext(e.target.value)}
        >
          <option value="">-- Choisir un prénom --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstname}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}

export default Header;
