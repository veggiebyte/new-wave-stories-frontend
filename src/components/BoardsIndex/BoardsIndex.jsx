import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as boardsService from '../../services/boardsService';

const BoardsIndex = () => {
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await boardsService.index();
        setBoards(data);
      } catch (err) {
        setError(err.message || 'Failed to load boards');
      }
    };
    fetchBoards();
  }, []);

  const handleDelete = async (boardId) => {
    if (!window.confirm('Delete this board?')) return;
    try {
      await boardsService.deleteBoard(boardId);
      setBoards(boards.filter(b => b.id !== boardId));
    } catch (err) {
      setError(err.message || 'Failed to delete board');
    }
  };

  return (
    <div className="boards-container">
      <h1 className="auth-form-title">Your Boards</h1>
<div className="divider divider--center divider--wide" />

      {error && <p className="auth-error">{error}</p>}

      {!error && boards.length === 0 && (
        <p className="boards-empty">No boards yet. Create your first one!</p>
      )}

      <div className="boards-grid">
        {boards.map((board) => (
          <div key={board.id} className="board-card">
            <div className="board-thumbnail">
              <span>THUMBNAIL</span>
            </div>
            <h3 className="board-title">{board.title}</h3>
            <p className="board-detail">City: {board.city}</p>
            <p className="board-detail">Vibe: {board.vibe}</p>
            <p className="board-detail">Created: {new Date(board.createdAt).toLocaleDateString()}</p>
            
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
        ))}
      </div>
    </div>
  );
};

export default BoardsIndex;