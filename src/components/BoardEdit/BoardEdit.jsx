import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as boardsService from '../../services/boardsService';
import * as boardItemsService from '../../services/boardItemsService';
import * as catalogService from '../../services/catalogService';

const CATEGORIES = ['accessories', 'dresses', 'jackets', 'pants', 'shirts', 'shoes', 'skirts'];

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
  'This Charming Man - The Smiths': '/images/bands/smiths.jpg',
  'Blue Monday - New Order': '/images/bands/new_order.jpg',
};

const BoardEdit = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    vibe: '',
    song: '',
  });
  const [catalog, setCatalog] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('accessories');
  const [error, setError] = useState('');
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const boardData = await boardsService.show(boardId);
        setBoard(boardData);
        setFormData({
          title: boardData.title,
          city: boardData.city,
          vibe: boardData.vibe,
          song: boardData.song,
        });

        const itemsData = await boardItemsService.index(boardId);
        setSelectedItems(itemsData.map(item => ({
          id: item.catalog_item_id,
          board_item_id: item.board_item_id,
          name: item.name,
          category: item.category,
          image_url: item.image_url,
        })));

        const catalogData = await catalogService.index();
        setCatalog(catalogData);
      } catch {
        setError('Failed to load board');
      }
    };
    fetchData();
  }, [boardId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleAddItem = async (catalogItem) => {
    const alreadyAdded = selectedItems.some(item => item.id === catalogItem.id);
    if (alreadyAdded) {
      setError('This item is already on your board');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const newItem = await boardItemsService.create(boardId, catalogItem.id);
      setSelectedItems([...selectedItems, {
        id: catalogItem.id,
        board_item_id: newItem.id,
        name: catalogItem.name,
        category: catalogItem.category,
        image_url: catalogItem.image_url,
      }]);
    } catch {
      setError('Failed to add item');
    }
  };

  const handleRemoveItem = async (boardItemId) => {
    try {
      await boardItemsService.remove(boardId, boardItemId);
      setSelectedItems(selectedItems.filter(item => item.board_item_id !== boardItemId));
    } catch {
      setError('Failed to remove item');
    }
  };

  const moveItem = (boardItemId, direction) => {
    const idx = selectedItems.findIndex(i => i.board_item_id === boardItemId);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= selectedItems.length) return;
    const next = [...selectedItems];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    setSelectedItems(next);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await boardsService.update(boardId, formData);
      navigate(`/boards/${boardId}`);
    } catch (err) {
      setError(err.message || 'Failed to update board');
    }
  };

  const handleGenerateStory = async () => {
    try {
      setError('');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/boards/${boardId}/generate-story`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.err) {
        setError(data.err);
      } else {
        setBoard(data);
      }
    } catch {
      setError('Failed to generate story');
    }
  };

  const filteredCatalog = catalog.filter(item => item.category === activeCategory);

  if (!board) return <p className="auth-error">Loading...</p>;

  return (
    <div className="auth-form-card">
      <h1 className="auth-form-title">Edit Board</h1>
      <div className="divider divider--center divider--wide" />

      {error && <p className="auth-error">{error}</p>}

      <form onSubmit={handleSubmit}>
        
        <div className="board-form-layout">
          <div className="board-form-fields">
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
          </div>

          {formData.song && SONG_INSPO_IMAGES[formData.song] && (
            <div className="board-form-photo">
              <img
                src={SONG_INSPO_IMAGES[formData.song]}
                alt={formData.song}
                className="board-form-band-img"
              />
              <p className="song-inspo-label"><strong>Band Inspo:</strong> {formData.song.split(' - ')[1]}</p>
            </div>
          )}
        </div>

        <div className="board-divider" />

        <div className="board-show-layout">
          <div className="board-catalog-section">
            <h2 className="board-section-title">Catalog</h2>
            <p className="board-instructions">
              Click items to add them to your board (each item can only be added once).
            </p>
            <div className="board-category-tabs">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`board-category-tab${activeCategory === cat ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  type="button"
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="board-catalog-grid">
              {filteredCatalog.map((catItem) => {
                const isAdded = selectedItems.some(item => item.id === catItem.id);
                return (
                  <div
                    key={catItem.id}
                    className={`board-catalog-item${isAdded ? ' disabled' : ''}`}
                    onClick={() => !isAdded && handleAddItem(catItem)}
                  >
                    <img
                      src={catItem.image_url}
                      alt={catItem.name}
                      className="board-catalog-img"
                    />
                    <p className="board-catalog-name">{catItem.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="board-canvas-section">
            <h2 className="board-section-title">Your Fashion Board</h2>
            <div className="board-canvas board-canvas-fixed">
              {selectedItems.length === 0 && (
                <p className="board-canvas-empty">
                  Your board is empty — click items from the catalog to build your look
                </p>
              )}
              <div className="board-canvas-grid">
                {selectedItems.map((item) => (
                  <div key={item.board_item_id} className="board-canvas-item">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="board-canvas-img"
                    />
                    <div className="board-canvas-controls">
                      <button
                        className="board-canvas-btn"
                        onClick={() => moveItem(item.board_item_id, 'up')}
                        type="button"
                        aria-label="Move up"
                      >↑</button>
                      <button
                        className="board-canvas-btn"
                        onClick={() => moveItem(item.board_item_id, 'down')}
                        type="button"
                        aria-label="Move down"
                      >↓</button>
                      <button
                        className="board-canvas-btn-text"
                        onClick={() => handleRemoveItem(item.board_item_id)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="board-story-section">
          <div className="board-story-box">
            <h2 className="board-section-title">Scene Story</h2>
            <button className="story-btn" type="button" onClick={handleGenerateStory}>
              {board.story ? 'Regenerate Story' : 'Generate Story'}
            </button>
            {board.story ? (
              <p className="board-story-text">{board.story}</p>
            ) : (
              <p className="board-canvas-empty">No story generated yet.</p>
            )}
          </div>
        </div>

        <div className="auth-form-actions">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(`/boards/${boardId}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BoardEdit;