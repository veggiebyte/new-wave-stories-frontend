import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as catalogService from '../../services/catalogService';


import * as boardsService from '../../services/boardsService';
import * as boardItemsService from '../../services/boardItemsService';

const BoardShow = () => {
const { boardId } = useParams();
const navigate = useNavigate();

const [board, setBoard] = useState(null);
const [error, setError] = useState('');

const [items, setItems] = useState([]);
const [itemsError, setItemsError] = useState('');
const [catalog, setCatalog] = useState([]);
const [catalogError, setCatalogError] = useState('');



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
        const fetchItems = async () => {
            try {
                const data = await boardItemsService.index(boardId);
                setItems(data);
            } catch (err) {
                setItemsError(err.message || 'Failed to load board items');
            }
        };
        fetchItems();
    }, [boardId]);

    const handleDelete = async () => {
        const ok = confirm('Delete this board? This cannot be undone.');
        if (!ok) return;

        try {
            await boardsService.remove(boardId);
            navigate('/boards');
        } catch (err) {
            setError(err.message || 'Failed to delete board');
        }
    };

    const handleAddTestItem = async () => {
        try {
            // TEMP: change 1 to a real catalog_item_id in your DB
            await boardItemsService.create(boardId, 1);

            // refresh list
            const updatedItems = await boardItemsService.index(boardId);
            setItems(updatedItems);
        } catch (err) {
            setItemsError(err.message || 'Failed to add item');
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

    return (
        <main>
            <h1>{board.title}</h1>

            <p>
                <Link to={`/boards/${boardId}/edit`}>Edit Board</Link>
            </p>

            <button onClick={handleDelete}>Delete Board</button>

            <p>
                <Link to="/boards">← Back to Boards</Link>
            </p>

            <section>
                <h2>Board Items</h2>

                <button onClick={handleAddTestItem}>+ Add Test Item</button>


                {itemsError && <p>{itemsError}</p>}

                {!itemsError && items.length === 0 && (
                    <p>No items on this board yet.</p>
                )}

                <ul>
                    {items.map((item) => (
                        <li key={item.id}>
                            {item.name || item.title || `Item ${item.id}`}
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
};

export default BoardShow;
