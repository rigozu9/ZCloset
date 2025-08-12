import api from './axiosInstance';

export const getOutfits = () => {
  return api.get('/api/outfits/');
};

export const deleteOutfit = (id) => {
  return api.delete(`/api/outfits/${id}/`);
};

export const createOutfit = (outfitData) => {
  return api.post('/api/outfits/', outfitData);
};
