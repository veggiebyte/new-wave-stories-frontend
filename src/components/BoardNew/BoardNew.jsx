import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as boardsService from '../../services/boardsService';

const BoardNew = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
  });

  const [error, setError] = useState('');

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const createdBoard = await boardsService.create(formData);
      // assumes backend returns the created board with an id
      navigate(`/boards/${createdBoard.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create board');
    }
  };

  return (
    <main>
      <h1>New Board</h1>

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

        <button type="submit">Create Board</button>
      </form>
    </main>
  );
};

export default BoardNew;
