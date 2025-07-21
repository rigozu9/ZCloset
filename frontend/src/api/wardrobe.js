import api from './axiosInstance';

export const uploadClothingItem = (formData) => {
  return api.post('/api/wardrobe/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getMyWardrobe = () => {
  return api.get('/api/wardrobe/');
};

export const detectClothingColor = (clothingId) => {
  return api.post('/api/detect-color/', {
    clothing_id: clothingId,
  });
};