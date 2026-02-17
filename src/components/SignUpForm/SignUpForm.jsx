import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
  });

  const { username, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <div className="auth-form-card">
      <h1 className="auth-form-title">Sign Up</h1>
      <div className="divider divider--center" />

      {message && <p className="auth-error">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            name="username"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            name="password"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="passwordConf">Confirm Password</label>
          <input
            type="password"
            id="passwordConf"
            value={passwordConf}
            name="passwordConf"
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isFormInvalid()}
          >
            Sign Up
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>

      <p className="auth-switch">
        Already have an account?{' '}
        <Link to="/sign-in">Sign in here.</Link>
      </p>
    </div>
  );
};

export default SignUpForm;