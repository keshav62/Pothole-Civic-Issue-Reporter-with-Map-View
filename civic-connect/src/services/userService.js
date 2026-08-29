import { apiFetch } from './api.js';

export const fetchUsers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const path = `/api/users${query ? `?${query}` : ''}`;
  const json = await apiFetch(path);
  return json.data;
};

export const fetchUserById = async (id) => {
  const json = await apiFetch(`/api/users/${id}`);
  return json.data;
};

export const createUser = async (userData) => {
  const json = await apiFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  return json.data;
};

export const updateUser = async (id, userData) => {
  const json = await apiFetch(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData)
  });
  return json.data;
};

export const deleteUser = async (id) => {
  const json = await apiFetch(`/api/users/${id}`, {
    method: 'DELETE'
  });
  return json.data;
};
