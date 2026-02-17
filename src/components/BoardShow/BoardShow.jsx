import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

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

const BoardShow = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [items, setItems] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [activeCategory, setActiveCategory] = useState('accessories');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const boardData = await boardsService.show(boardId);
        setBoard(boardData);
        const itemsData = await boardItemsService.index(boardId);
        setItems(itemsData);
        const catalogData = await catalogService.index();
        setCatalog(catalogData);
      } catch (err) {
        setError(err.message || 'Failed to load board');
      }
    };
    fetchAll();
  }, [boardId]);

  const handleAddToBoard = async (catalogItemId) => {
    try {
      await boardItemsService.create(boardId, catalogItemId);
      const updated = await boardItemsService.index(boardId);
      setItems(updated);
    } catch (err) {
      setError(err.message || 'Failed to add item');
    }
  };

  const handleRemoveFromBoard = async (boardItemId) => {
    try {
      await boardItemsService.remove(boardId, boardItemId);
      const updated = await boardItemsService.index(boardId);
      setItems(updated);
    } catch (err) {
      setError(err.message || 'Failed to remove item');
    }
  };

  const handleDeleteBoard = async () => {
    if (!window.confirm('Delete this board? This cannot be undone.')) return;
    try {
      await boardsService.remove(boardId);
      navigate('/boards');
    } catch (err) {
      setError(err.message || 'Failed to delete board');
    }
  };

  const moveItem = (boardItemId, direction) => {
    const idx = items.findIndex(i => i.board_item_id === boardItemId);
    if (idx === -1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const next = [...items];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    setItems(next);
  };

  const filteredCatalog = catalog.filter(item => item.category === activeCategory);

  if (!board) return <p className="auth-error">Loading...</p>;

  return (
    <div className="auth-form-card">

      <h1 className="auth-form-title">{board.title}</h1>
      <div className="divider divider--center divider--wide" />

      <div className="board-top">

        <div className="board-top-info">
          <p className="board-detail">City: {board.city}</p>
          <p className="board-detail">Vibe: {board.vibe}</p>
          <p className="board-detail">Song: {board.song}</p>
          <Link to={`/boards/${boardId}/edit`} className="btn-sm btn-green-sm">
            Edit Info
          </Link>
        </div>

        {board.song && SONG_INSPO_IMAGES[board.song] && (
          <div className="board-top-inspo">
            <div className="board-inspo-starburst">
              <span>INSPO</span>
            </div>
            <img
              src={SONG_INSPO_IMAGES[board.song]}
              alt={board.song}
              className="board-inspo-img"
            />
            <p className="song-inspo-label">{board.song}</p>
          </div>
        )}

      </div>

      <div className="board-divider" />

      {error && <p className="auth-error">{error}</p>}

      <div className="board-show-layout">

        <div className="board-catalog-section">
          <h2 className="board-section-title">Catalog</h2>
          <p className="board-instructions">
            Click an item to add it to your fashion board.
            Hover over items on your board to move or remove them.
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
            {filteredCatalog.map((catItem) => (
              <div
                key={catItem.id}
                className="board-catalog-item"
                onClick={() => handleAddToBoard(catItem.id)}
              >
                <img
                  src={catItem.image_url}
                  alt={catItem.name}
                  className="board-catalog-img"
                />
                <p className="board-catalog-name">{catItem.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="board-canvas-section">
          <h2 className="board-section-title">Your Fashion Board</h2>
          <div className="board-canvas">
            {items.length === 0 && (
              <p className="board-canvas-empty">
                Your board is empty — click items from the catalog to build your look
              </p>
            )}
            <div className="board-canvas-grid">
              {items.map((item) => (
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
                      className="board-canvas-btn board-canvas-remove"
                      onClick={() => handleRemoveFromBoard(item.board_item_id)}
                      type="button"
                      aria-label="Remove item"
                    >✕</button>
                    <button
                      className="board-canvas-btn"
                      onClick={() => moveItem(item.board_item_id, 'down')}
                      type="button"
                      aria-label="Move down"
                    >↓</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="board-story-section">
        <h2 className="board-section-title">Scene Story</h2>
        {board.story ? (
          <p className="board-story-text">{board.story}</p>
        ) : (
          <p className="board-canvas-empty">No story generated yet.</p>
        )}
        <div className="board-story-actions">
          <button className="btn btn-primary" type="button">
            Generate Story
          </button>
          <button
            className="btn-sm btn-green-sm"
            onClick={handleDeleteBoard}
            type="button"
          >
            Delete Board
          </button>
        </div>
      </div>

    </div>
  );
};

export default BoardShow;