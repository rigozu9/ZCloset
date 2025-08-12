import api from './axiosInstance';

export const getOutfits = () => {
  return api.get('/api/outfits/');
};
