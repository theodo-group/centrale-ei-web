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
    <div className="Header-wrapper">
      <div className="Header-container">
        <Link className="Link" to="/">
          Home
        </Link>
        <div>|</div>
        <Link className="Link" to="/counter">
          Counter
        </Link>
        <div>|</div>
        <Link className="Link" to="/details">
          Details
        </Link>
        <div>|</div>
        <Link className="Link" to="/users">
          Users
        </Link>
        <div>|</div>
        <Link className="Link" to="/about">
          About
        </Link>
      </div>
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
    </div>
  );
}

export default Header;
