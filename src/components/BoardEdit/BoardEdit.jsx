import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

import * as boardsService from '../../services/boardsService';

const BoardEdit = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const board = await boardsService.show(boardId);
        setFormData({ title: board.title || '' });
      } catch (err) {
        setError(err.message || 'Failed to load board');
      }
    };
    fetchBoard();
  }, [boardId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
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

  return (
    <main>
      <h1>Edit Board</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <button type="submit">Save</button>
      </form>

      <p>
        <Link to={`/boards/${boardId}`}>Cancel</Link>
      </p>
    </main>
  );
};

export default BoardEdit;
