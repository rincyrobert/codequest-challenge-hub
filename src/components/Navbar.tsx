
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'navbar-link active' : 'navbar-link';
  };
  
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          CodeMaster
        </Link>
        <div className="navbar-menu">
          <Link to="/" className={isActive('/')}>
            Home
          </Link>
          <Link to="/challenges" className={isActive('/challenges')}>
            Challenges
          </Link>
          <Link to="/leaderboard" className={isActive('/leaderboard')}>
            Leaderboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
