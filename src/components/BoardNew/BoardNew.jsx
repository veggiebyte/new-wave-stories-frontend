import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as boardsService from '../../services/boardsService';

const SONG_INSPO_IMAGES = {
  'Love Will Tear Us Apart - Joy Division': '/images/bands/joy_division.jpg',
  'Say Hello Wave Goodbye - Soft Cell': '/images/bands/soft_cell.jpg',
  'Fade to Grey - Visage': '/images/bands/visage.jpg',
  'Enola Gay - OMD': '/images/bands/omd.jpg',
  'Soap Commercial - Psychedelic Furs': '/images/bands/psych_furs.jpg',
  'I Ran - Flock of Seagulls': '/images/bands/flock.jpg',
  'The Metro - Berlin': '/images/bands/berlin.jpg',
  "Don't You Want Me - The Human League": '/images/bands/human_league.jpg',
  'Vienna - Ultravox': '/images/bands/ultravox.jpg',
  "Bela Lugosi's Dead - Bauhaus": '/images/bands/bauhaus.jpg',
  'A Forest - The Cure': '/images/bands/cure.jpg',
  'Cities In Dust - Siouxsie And The Banshees': '/images/bands/siouxsie.jpg',
  'Love Missile F1-11 - Sigue Sigue Sputnik': '/images/bands/sigue.jpg',
  'Ants Invasion - Adam & the Ants': '/images/bands/adam_ant.jpg',
  'Time - Culture Club': '/images/bands/culture_club.jpg',
  'Lies - The Thompson Twins': '/images/bands/thompson_twins.jpg',
  'Rise - Public Image Ltd': '/images/bands/pil.jpg',
  "Rock Lobster - The B-52's": '/images/bands/B52s.jpg',
};

const BoardNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    vibe: '',
    song: '',
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
    <div className="auth-form-card">
      <h1 className="auth-form-title">Create Your Board</h1>
      <div className="divider divider--center" />

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
            <option value="Manchester">Manchester</option>
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
            <option value="Gender Fluid">Gender Fluid</option>
            <option value="Punk / DIY">Punk / DIY</option>
            <option value="Futuristic">Futuristic</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="song">Song Inspiration *</label>
          <select
            id="song"
            name="song"
            value={formData.song}
            onChange={handleChange}
            required
          >
            <option value="">Select a song</option>
            <option value="Blue Monday - New Order">Blue Monday - New Order</option>
            <option value="This Charming Man - The Smiths">This Charming Man - The Smiths</option>
            <option value="Love Will Tear Us Apart - Joy Division">Love Will Tear Us Apart - Joy Division</option>
            <option value="Say Hello Wave Goodbye - Soft Cell">Say Hello Wave Goodbye - Soft Cell</option>
            <option value="Fade to Grey - Visage">Fade to Grey - Visage</option>
            <option value="Enola Gay - OMD">Enola Gay - OMD</option>
            <option value="Soap Commercial - Psychedelic Furs">Soap Commercial - Psychedelic Furs</option>
            <option value="I Ran - Flock of Seagulls">I Ran - Flock of Seagulls</option>
            <option value="The Metro - Berlin">The Metro - Berlin</option>
            <option value="Don't You Want Me - The Human League">Don't You Want Me - The Human League</option>
            <option value="Vienna - Ultravox">Vienna - Ultravox</option>
            <option value="Bela Lugosi's Dead - Bauhaus">Bela Lugosi's Dead - Bauhaus</option>
            <option value="A Forest - The Cure">A Forest - The Cure</option>
            <option value="Cities In Dust - Siouxsie And The Banshees">Cities In Dust - Siouxsie And The Banshees</option>
            <option value="Love Missile F1-11 - Sigue Sigue Sputnik">Love Missile F1-11 - Sigue Sigue Sputnik</option>
            <option value="Ants Invasion - Adam & the Ants">Ants Invasion - Adam & the Ants</option>
            <option value="Time - Culture Club">Time - Culture Club</option>
            <option value="Lies - The Thompson Twins">Lies - The Thompson Twins</option>
            <option value="Rise - Public Image Ltd">Rise - Public Image Ltd</option>
            <option value="Rock Lobster - The B-52's">Rock Lobster - The B-52's</option>
          </select>
        </div>

        {formData.song && SONG_INSPO_IMAGES[formData.song] && (
          <div className="song-inspo">
            <img
              src={SONG_INSPO_IMAGES[formData.song]}
              alt={formData.song}
              className="song-inspo-img"
            />
          </div>
        )}

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
  );
};

export default BoardNew;