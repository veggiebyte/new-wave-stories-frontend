const BASE_URL = `${import.meta.env.VITE_API_URL}/boards`;

const index = async () => {
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const data = await res.json();
  if (data.err) throw new Error(data.err);
  return data;
};

const show = async (boardId) => {
  const res = await fetch(`${BASE_URL}/${boardId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const data = await res.json();
  if (data.err) throw new Error(data.err);
  return data;
};

const create = async (formData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (data.err) throw new Error(data.err);
  return data;
};

const update = async (boardId, formData) => {
  const res = await fetch(`${BASE_URL}/${boardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (data.err) throw new Error(data.err);
  return data;
};

const remove = async (boardId) => {
  const res = await fetch(`${BASE_URL}/${boardId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const data = await res.json().catch(() => ({}));
  if (data.err) throw new Error(data.err);
  return data;
};

export { index, show, create, update, remove };
