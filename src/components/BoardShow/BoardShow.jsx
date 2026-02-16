import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import * as boardsService from '../../services/boardsService';
import * as boardItemsService from '../../services/boardItemsService';
import * as catalogService from '../../services/catalogService';

const BoardShow = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [error, setError] = useState('');

  const [items, setItems] = useState([]);
  const [itemsError, setItemsError] = useState('');

  const [catalog, setCatalog] = useState([]);
  const [catalogError, setCatalogError] = useState('');

  const refreshItems = async () => {
    try {
      const data = await boardItemsService.index(boardId);
      setItems(data);
      setItemsError('');
    } catch (err) {
      setItemsError(err.message || 'Failed to load board items');
    }
  };

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const data = await boardsService.show(boardId);
        setBoard(data);
      } catch (err) {
        setError(err.message || 'Failed to load board');
      }
    };
    fetchBoard();
  }, [boardId]);

  useEffect(() => {
    refreshItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await catalogService.index();
        setCatalog(data);
      } catch (err) {
        setCatalogError(err.message || 'Failed to load catalog');
      }
    };
    fetchCatalog();
  }, []);

  const handleDeleteBoard = async () => {
    const ok = confirm('Delete this board? This cannot be undone.');
    if (!ok) return;

    try {
      await boardsService.remove(boardId);
      navigate('/boards');
    } catch (err) {
      setError(err.message || 'Failed to delete board');
    }
  };

  const handleAddToBoard = async (catalogItemId) => {
    try {
      await boardItemsService.create(boardId, catalogItemId);
      await refreshItems();
    } catch (err) {
      setItemsError(err.message || 'Failed to add item');
    }
  };

  const handleRemoveFromBoard = async (boardItemId) => {
    try {
      await boardItemsService.remove(boardId, boardItemId);
      await refreshItems();
    } catch (err) {
      setItemsError(err.message || 'Failed to remove item');
      alert(err.message || 'Failed to remove item');
    }
  };

  if (error) {
    return (
      <main>
        <p>{error}</p>
        <Link to="/boards">Back to Boards</Link>
      </main>
    );
  }

  if (!board) {
    return (
      <main>
        <p>Loading...</p>
      </main>
    );
  }

  const normalizeOrder = (list) => {
    const sorted = [...list].sort((a, b) => {
      const ai = a.sort_index ?? 0;
      const bi = b.sort_index ?? 0;
      if (ai !== bi) return ai - bi;

      const aid = a.board_item_id ?? a.id ?? 0;
      const bid = b.board_item_id ?? b.id ?? 0;
      return aid - bid;
    });

    return sorted.map((it, idx) => ({ ...it, sort_index: idx }));
  };

  const persistTwo = async (a, b) => {
    await Promise.all([
      boardItemsService.update(boardId, a.board_item_id, { sort_index: a.sort_index }),
      boardItemsService.update(boardId, b.board_item_id, { sort_index: b.sort_index }),
    ]);
  };

  const moveItem = async (boardItemId, direction) => {
    try {
      setItemsError('');

      const normalized = normalizeOrder(items);
      const idx = normalized.findIndex((x) => x.board_item_id === boardItemId);
      if (idx === -1) return;

      const swapWith = direction === 'up' ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= normalized.length) return;

      const next = [...normalized];
      const a = { ...next[idx] };
      const b = { ...next[swapWith] };

      // swap sort_index
      const temp = a.sort_index;
      a.sort_index = b.sort_index;
      b.sort_index = temp;

      next[idx] = a;
      next[swapWith] = b;

      // optimistic UI
      setItems(next);

      // persist to backend
      await persistTwo(a, b);

      // re-fetch for safety
      await refreshItems();
    } catch (err) {
      setItemsError(err.message || 'Failed to reorder items');
      await refreshItems();
    }
  };




  return (
    <main>
      <h1>{board.title}</h1>

      <p>
        <Link to={`/boards/${boardId}/edit`}>Edit Board</Link>
      </p>

      <button onClick={handleDeleteBoard}>Delete Board</button>

      <p>
        <Link to="/boards">← Back to Boards</Link>
      </p>

      <section>
        <h2>Catalog</h2>

        {catalogError && <p>{catalogError}</p>}

        {!catalogError && catalog.length === 0 && <p>No catalog items yet.</p>}

        <ul>
          {catalog.map((catItem) => (
            <li key={catItem.id}>
              {catItem.name || catItem.title}
              <button onClick={() => handleAddToBoard(catItem.id)}>
                Add to Board
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Board Items</h2>

        {itemsError && <p>{itemsError}</p>}

        {!itemsError && items.length === 0 && <p>No items on this board yet.</p>}

        <ul>
          {items.map((item) => {
            // Try hard to find the board_item id (the one your DELETE route needs)
            const boardItemId =
              item.board_item_id ??
              item.boardItemId ??
              item.board_item?.id ??
              item.boardItem?.id ??
              item.board_item?.board_item_id ??
              item.id; // LAST resort

            const label = item.name || item.title || item.catalog_name || 'Item';

            return (
              <li key={boardItemId}>
                <div>{label}</div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      if (!boardItemId) {
                        setItemsError('Missing board item id. Check API response shape.');
                        return;
                      }
                      moveItem(boardItemId, 'up');
                    }}
                    aria-label="Move item up"
                    type="button"
                  >
                    ↑
                  </button>

                  <button
                    onClick={() => {
                      if (!boardItemId) {
                        setItemsError('Missing board item id. Check API response shape.');
                        return;
                      }
                      moveItem(boardItemId, 'down');
                    }}
                    aria-label="Move item down"
                    type="button"
                  >
                    ↓
                  </button>

                  <button
                    onClick={() => {
                      if (!boardItemId) {
                        setItemsError('Missing board item id. Check API response shape.');
                        return;
                      }
                      handleRemoveFromBoard(boardItemId);
                    }}
                    type="button"
                  >
                    Remove
                  </button>
                </div>


              </li>
            );
          })}
        </ul>

      </section>
    </main>
  );
};

export default BoardShow;
