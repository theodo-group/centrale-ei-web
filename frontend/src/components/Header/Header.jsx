import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Header.css';

function Header() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/users/prenoms')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(console.error);
  }, []);

  return (
    <header className="Header">
      <div className="Logo">
        <Link to="/">🍿 PopCorn Advisor</Link>
      </div>
      <nav className="NavLinks">
        <Link className="NavButton" to="/counter">Counter</Link>
        <Link className="NavButton" to="/details">Details</Link>
        <Link className="NavButton" to="/users">Users</Link>
        <Link className="NavButton" to="/about">About</Link>
      </nav>
      <div
        style={{
          marginTop: '0px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Choisir un prénom --</option>
          {users.map((user, index) => (
            <option key={index} value={user.firstname}>
              {user.firstname}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}

export default Header;
