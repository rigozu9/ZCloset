import api from './axiosInstance';

// Rekisteröi uusi käyttäjä
export const register = (username, password) => {
  return api.post('api/register/', { username, password });
};