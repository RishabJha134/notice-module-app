const apiBase = import.meta.env.VITE_API_URL || '';

const buildHeaders = (role) => ({
  'Content-Type': 'application/json',
  'x-user-role': role
});

const request = async (path, options = {}) => {
  const response = await fetch(`${apiBase}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const getNotices = () => request('/api/notices');
export const createNotice = (payload, role) =>
  request('/api/notices', {
    method: 'POST',
    headers: buildHeaders(role),
    body: JSON.stringify(payload)
  });
export const updateNotice = (id, payload, role) =>
  request(`/api/notices/${id}`, {
    method: 'PUT',
    headers: buildHeaders(role),
    body: JSON.stringify(payload)
  });
export const deleteNotice = (id, role) =>
  request(`/api/notices/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(role)
  });