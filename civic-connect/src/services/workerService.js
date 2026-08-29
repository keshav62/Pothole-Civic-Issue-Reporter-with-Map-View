import { apiFetch } from './api.js';

/**
 * Fetches the worker profile and task counts.
 * @returns {Promise<Object>} Worker profile data
 */
export const fetchWorkerProfile = async () => {
  const json = await apiFetch('/api/workers/me');
  return json.data;
};

/**
 * Fetches paginated tasks for the logged-in worker.
 * @param {Object} [params] - Query parameters
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Results per page
 * @param {string} [params.status] - Filter by task status
 * @returns {Promise<Object>} Paginated task list
 */
export const fetchWorkerTasks = async ({ page, limit, status } = {}) => {
  const query = new URLSearchParams();
  if (page) query.append('page', page);
  if (limit) query.append('limit', limit);
  if (status) query.append('status', status);
  
  const queryString = query.toString() ? `?${query.toString()}` : '';
  const json = await apiFetch(`/api/workers/me/tasks${queryString}`);
  return json.data;
};

/**
 * Fetches detail and timeline for a specific task.
 * @param {string} id - Task ID
 * @returns {Promise<Object>} Task detail data
 */
export const fetchTaskDetail = async (id) => {
  const json = await apiFetch(`/api/workers/me/tasks/${id}`);
  return json.data;
};

/**
 * Accepts an assigned task.
 * @param {string} id - Task ID
 * @returns {Promise<Object>} Updated task data
 */
export const acceptTask = async (id) => {
  const json = await apiFetch(`/api/workers/tasks/${id}/accept`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  });
  return json.data;
};

/**
 * Starts an accepted task.
 * @param {string} id - Task ID
 * @returns {Promise<Object>} Updated task data
 */
export const startTask = async (id) => {
  const json = await apiFetch(`/api/workers/tasks/${id}/start`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  });
  return json.data;
};

/**
 * Completes an in-progress task.
 * @param {string} id - Task ID
 * @returns {Promise<Object>} Updated task data
 */
export const completeTask = async (id) => {
  const json = await apiFetch(`/api/workers/tasks/${id}/complete`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  });
  return json.data;
};

/**
 * Uploads proof images and note for a task.
 * @param {string} id - Task ID
 * @param {Object} data - Proof data
 * @param {File[]} [data.beforeImages] - Before images
 * @param {File[]} [data.afterImages] - After images
 * @param {string} [data.note] - Work note
 * @returns {Promise<Object>} Updated task data
 */
export const uploadProof = async (id, { beforeImages = [], afterImages = [], note = '' }) => {
  const formData = new FormData();
  
  beforeImages.forEach(file => {
    formData.append('beforeImages', file);
  });
  
  afterImages.forEach(file => {
    formData.append('afterImages', file);
  });
  
  if (note) {
    formData.append('note', note);
  }

  const json = await apiFetch(`/api/workers/tasks/${id}/proof`, {
    method: 'POST',
    body: formData,
  });
  return json.data;
};
