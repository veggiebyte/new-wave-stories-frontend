import { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import './NavBar.css';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();

  // Hide navbar entirely on landing page when logged out
  if (!user && location.pathname === '/') return null;

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <header className="navbar">
      <nav className="navbar-inner" aria-label="Primary navigation">

        <div className="navbar-brand">
          <NavLink to="/">
            <img
              src="/images/logo_color.png"
              alt="New Wave Stories"
              className="navbar-logo"
            />
          </NavLink>
        </div>

        <div className="navbar-links">
          {user ? (
            <>
              <NavLink to="/boards" className="navbar-item">
                My Boards
              </NavLink>
              <NavLink to="/boards/new" className="navbar-item">
                Create a Board
              </NavLink>
              <span className="navbar-welcome">Hi, {user.username}</span>
              <button
                className="navbar-item navbar-signout"
                type="button"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/sign-in" className="navbar-item">
                Sign In
              </NavLink>
              <NavLink to="/sign-up" className="navbar-item">
                Sign Up
              </NavLink>
            </>
          )}
        </div>

      </nav>
    </header>
  );
};

export default NavBar;