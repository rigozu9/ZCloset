import api from './axiosInstance';

// Rekisteröi uusi käyttäjä
export const register = (username, password) => {
  return api.post('api/register/', { username, password });
};

export const login = async (username, password) => {
  const response = await api.post('api/token/', { username, password })
  localStorage.setItem('accessToken', response.data.access);
  localStorage.setItem('refreshToken', response.data.refresh);

  return response.data; 
}