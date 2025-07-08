import api from './axiosInstance';

export const getWelcomeMessage = () => {
  return api.get('/');
};
