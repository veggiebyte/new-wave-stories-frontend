import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as boardsService from '../../services/boardsService';
import * as boardItemsService from '../../services/boardItemsService';

const BoardsIndex = () => {
  const [boards, setBoards] = useState([]);
  const [boardItems, setBoardItems] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await boardsService.index();
        setBoards(data);
        
        const itemsMap = {};
        for (const board of data) {
          try {
            const items = await boardItemsService.index(board.id);
            itemsMap[board.id] = items.slice(0, 1);
          } catch {
            itemsMap[board.id] = [];
          }
        }
        setBoardItems(itemsMap);
      } catch (err) {
        setError(err.message || 'Failed to load boards');
      }
    };
    fetchBoards();
  }, []);

  const handleDelete = async (boardId) => {
    if (!window.confirm('Delete this board?')) return;
    try {
      await boardsService.remove(boardId);
      setBoards(boards.filter(b => b.id !== boardId));
    } catch (err) {
      setError(err.message || 'Failed to delete board');
    }
  };

  return (
    <div className="container">
      <h1 className="auth-form-title">Your Boards</h1>
      <div className="divider divider--center divider--wide" />

      {error && <p className="auth-error">{error}</p>}

      {!error && boards.length === 0 && (
        <p className="boards-empty">No boards yet. Create your first one!</p>
      )}

      <div className="boards-grid">
        {boards.map((board) => {
          const items = boardItems[board.id] || [];
          return (
            <div key={board.id} className="board-card">
              <div className="board-thumbnail">
                {items.length > 0 ? (
                  <img src={items[0].image_url} alt={items[0].name} className="board-thumbnail-img" />
                ) : (
                  <span>NO ITEMS</span>
                )}
              </div>
              <h3 className="board-title">{board.title}</h3>
              <p className="board-detail"><strong>City:</strong> {board.city}</p>
              <p className="board-detail"><strong>Vibe:</strong> {board.vibe}</p>
              <p className="board-detail"><strong>Created:</strong> {new Date(board.created_at).toLocaleDateString()}</p>

              <div className="board-actions">
                <Link to={`/boards/${board.id}`} className="btn btn-green">View</Link>
                <Link to={`/boards/${board.id}/edit`} className="btn btn-outline">Edit</Link>
                <button
                  onClick={() => handleDelete(board.id)}
                  className="btn btn-outline"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BoardsIndex;