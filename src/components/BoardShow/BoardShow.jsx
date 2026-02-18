import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as boardsService from '../../services/boardsService';
import * as boardItemsService from '../../services/boardItemsService';

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
  'This Charming Man - The Smiths': '/images/bands/the_smiths.jpg',
  'Blue Monday - New Order': '/images/bands/new_order.jpg',
};

const BoardShow = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const boardData = await boardsService.show(boardId);
        setBoard(boardData);
        const itemsData = await boardItemsService.index(boardId);
        setItems(itemsData);
      } catch (err) {
        setError(err.message || 'Failed to load board');
      }
    };
    fetchBoard();
  }, [boardId]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this board? This cannot be undone.')) return;
    try {
      await boardsService.remove(boardId);
      navigate('/boards');
    } catch {
      setError('Failed to delete board');
    }
  };

  if (!board) return <p className="auth-error">Loading...</p>;

  return (
    <div className="auth-form-card">
      <h1 className="auth-form-title">{board.title}</h1>
      <div className="divider divider--center divider--wide" />

      {error && <p className="auth-error">{error}</p>}

      <div className="board-view-top">
        <div>
          <p className="board-detail"><strong>City:</strong> {board.city}</p>
          <p className="board-detail"><strong>Vibe:</strong> {board.vibe}</p>
          <p className="board-detail"><strong>Song:</strong> {board.song}</p>
        </div>

        {board.song && SONG_INSPO_IMAGES[board.song] && (
          <div className="board-view-inspo">
            <img
              src={SONG_INSPO_IMAGES[board.song]}
              alt={board.song}
              className="board-inspo-img"
            />
            <p className="song-inspo-label"><strong>Band Inspo:</strong> {board.song.split(' - ')[1]}</p>
          </div>
        )}
      </div>

      <div className="board-divider" />

      <div className={board.story ? 'board-view-content-grid' : ''}>
        <div>
          <h2 className="board-section-title">Fashion Board</h2>
          <div className="board-view-canvas">
            {items.length === 0 ? (
              <p className="board-canvas-empty">No items on this board</p>
            ) : (
              <div className="board-view-grid">
                {items.map((item) => (
                  <div key={item.board_item_id} className="board-view-item">
                    <img src={item.image_url} alt={item.name} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {board.story && (
          <div>
            <h2 className="board-section-title">Scene Story</h2>
            <div className="board-view-story-box">
              <p className="board-story-text">{board.story}</p>
            </div>
          </div>
        )}
      </div>

      <div className="board-view-actions">
        <Link to={`/boards/${boardId}/edit`} className="btn-action">
          Edit Board
        </Link>
        <button onClick={handleDelete} className="btn-action btn-action-delete">
          Delete Board
        </button>
      </div>
      
      <p className="board-back-link">
        <Link to="/boards">← Back to My Boards</Link>
      </p>
    </div>
  );
};

export default BoardShow;