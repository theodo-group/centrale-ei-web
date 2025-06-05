import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
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
    </header>
  );
};

export default Header;
