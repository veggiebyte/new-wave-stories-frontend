import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import * as boardsService from '../../services/boardsService';

const BoardShow = () => {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [error, setError] = useState('');

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

    if (error) {
        return (
            <main>
                <p>{error}</p>
                <Link to="/boards">Back to Boards</Link>
            </main>
        );
    }

    if (!board) {
        return <main><p>Loading...</p></main>;
    }

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


    return (
        <main>
            <h1>{board.title}</h1>
            <p> <Link to={`/boards/${boardId}/edit`}>Edit Board</Link></p>
            <button onClick={handleDelete}>Delete Board</button>


            <p><Link to="/boards">← Back to Boards</Link></p>

            {/* Placeholder for future: catalog + board items */}
            <section>
                <h2>Board Items</h2>
                <p>Coming next: add/remove/reorder items.</p>
            </section>
        </main>
    );
};

export default BoardShow;
