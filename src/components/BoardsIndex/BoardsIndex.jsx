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

  return (
    <main>
      <h1>Your Boards</h1>

      <Link to="/boards/new">+ New Board</Link>

      {error && <p>{error}</p>}

      {!error && boards.length === 0 && <p>No boards yet.</p>}

      <ul>
        {boards.map((board) => (
          <li key={board.id}>
            <Link to={`/boards/${board.id}`}>{board.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default BoardsIndex;
