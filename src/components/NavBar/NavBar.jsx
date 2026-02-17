import { useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user && location.pathname === '/') return null;

  const handleSignOut = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <img
        src="/images/logo_color.png"
        alt="New Wave Stories"
        className="auth-logo"
      />

      <p className="auth-tagline">
        Create 1980s-inspired fashion collages
      </p>

      <nav className="auth-nav">
        {user ? (
          <>
            <NavLink to="/boards" className="btn btn-green">
              <span className="auth-nav-arrow">▶</span>
              My Boards
            </NavLink>
            <NavLink to="/boards/new" className="btn btn-green">
              <span className="auth-nav-arrow">▶</span>
              Create a Board
            </NavLink>
            <NavLink to="/" className="btn btn-green" onClick={handleSignOut}>
              <span className="auth-nav-arrow">▶</span>
              Sign Out
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" className="btn btn-green">
              <span className="auth-nav-arrow">▶</span>
              Home
            </NavLink>
            <NavLink to="/sign-in" className="btn btn-green">
              <span className="auth-nav-arrow">▶</span>
              Sign In
            </NavLink>
            <NavLink to="/sign-up" className="btn btn-green">
              <span className="auth-nav-arrow">▶</span>
              Sign Up
            </NavLink>
          </>
        )}
      </nav>

      {user && <p className="auth-user-greeting">Hi, {user.username}</p>}
    </>
  );
};

export default NavBar;