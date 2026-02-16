import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <header className="navbar">
      <nav className="navbar__inner" aria-label="Primary navigation">
        <div className="navbar__left">
          <NavLink to="/" className="navbar__brand">
            New Wave Stories
          </NavLink>
          {user && <span className="navbar__welcome">Welcome, {user.username}</span>}
        </div>

        <div className="navbar__right">
          <NavLink to="/" className="navbar__item">
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink to="/boards" className="navbar__item">
                My Boards
              </NavLink>

              <NavLink to="/boards/new" className="navbar__item">
                Create a Board
              </NavLink>

              <button className="navbar__item" type="button" onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/sign-in" className="navbar__item">
                Sign In
              </NavLink>

              <NavLink to="/sign-up" className="navbar__item">
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
