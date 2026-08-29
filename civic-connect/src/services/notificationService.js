import { apiFetch } from './api.js';

/**
 * Fetches paginated notifications for the logged-in user.
 * @param {Object} [params] - Query parameters
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Results per page
 * @param {boolean} [params.isRead] - Filter by read status
 * @returns {Promise<Object>} Paginated notifications
 */
export const fetchNotifications = async ({ page, limit, isRead } = {}) => {
  const query = new URLSearchParams();
  if (page !== undefined) query.append('page', page);
  if (limit !== undefined) query.append('limit', limit);
  if (isRead !== undefined) query.append('isRead', isRead);
  
  const queryString = query.toString() ? `?${query.toString()}` : '';
  const json = await apiFetch(`/api/notifications${queryString}`);
  return json.data;
};

/**
 * Marks a single notification as read.
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Updated notification data
 */
export const markAsRead = async (id) => {
  const json = await apiFetch(`/api/notifications/${id}/read`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  });
  return json.data;
};

/**
 * Marks all notifications as read.
 * @returns {Promise<Object>} Update result
 */
export const markAllAsRead = async () => {
  const json = await apiFetch('/api/notifications/read-all', {
    method: 'PATCH',
    body: JSON.stringify({}),
  });
  return json.data;
};
