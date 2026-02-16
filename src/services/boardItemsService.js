const BASE_URL = `${import.meta.env.VITE_API_URL}/boards`;

const index = async (boardId) => {
  const res = await fetch(`${BASE_URL}/${boardId}/items`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const data = await res.json();
  if (data.err) throw new Error(data.err);
  return data;
};

const create = async (boardId, catalogItemId) => {
  const res = await fetch(`${BASE_URL}/${boardId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ catalog_item_id: catalogItemId }),
  });

  const data = await res.json();
  if (data.err) throw new Error(data.err);
  return data;
};

const remove = async (boardId, boardItemId) => {
  const res = await fetch(`${BASE_URL}/${boardId}/items/${boardItemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  if (res.status === 204) return {};

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
throw new Error(data.err || `Failed to remove item (status ${res.status})`);
  }

  if (data.err) throw new Error(data.err);
  return data;
};

const update = async (boardId, boardItemId, payload) => {
  const res = await fetch(`${BASE_URL}/${boardId}/items/${boardItemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (data.err) throw new Error(data.err);
  return data;
};

export { index, create, remove, update };
