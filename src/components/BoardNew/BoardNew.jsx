import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as boardsService from '../../services/boardsService';

const BoardNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    vibe: '',
    song_title: '',
    song_artist: '',
  });
  const [error, setError] = useState('');

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const createdBoard = await boardsService.create(formData);
      navigate(`/boards/${createdBoard.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create board');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <h1 className="auth-form-title">Create Your Board</h1>
        <div className="divider divider--center" />

        <div className="auth-form-card">
          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City Vibe *</label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              >
                <option value="">Select a city</option>
                <option value="New York">New York</option>
                <option value="London">London</option>
                <option value="Los Angeles">Los Angeles</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="vibe">Style Vibe *</label>
              <select
                id="vibe"
                name="vibe"
                value={formData.vibe}
                onChange={handleChange}
                required
              >
                <option value="">Select a vibe</option>
                <option value="Dark / Gothic">Dark / Gothic</option>
                <option value="Colorful / Neon">Colorful / Neon</option>
                <option value="Minimal / Stark">Minimal / Stark</option>
                <option value="Androgynous">Androgynous</option>
                <option value="Punk / DIY">Punk / DIY</option>
                <option value="Futuristic">Futuristic</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="song_title">Song Title *</label>
              <input
                id="song_title"
                name="song_title"
                value={formData.song_title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="song_artist">Song Artist *</label>
              <input
                id="song_artist"
                name="song_artist"
                value={formData.song_artist}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-form-actions">
              <button type="submit" className="btn btn-primary">
                Create Board
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/boards')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default BoardNew;