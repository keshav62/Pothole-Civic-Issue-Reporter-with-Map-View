import { apiFetch } from './api.js';

/**
 * Fetches overview KPI cards for the logged-in user.
 * @returns {Promise<Object>} Analytics overview data
 */
export const fetchOverview = async () => {
  const json = await apiFetch('/api/analytics/overview');
  return json.data;
};

/**
 * Fetches issue trends, ward volume, and funnel data.
 * @returns {Promise<Object>} Issue analytics data
 */
export const fetchIssueTrends = async () => {
  const json = await apiFetch('/api/analytics/issues');
  return json.data;
};

/**
 * Fetches worker leaderboard or personal stats.
 * @returns {Promise<Object>} Worker analytics data
 */
export const fetchWorkerStats = async () => {
  const json = await apiFetch('/api/analytics/workers');
  return json.data;
};
