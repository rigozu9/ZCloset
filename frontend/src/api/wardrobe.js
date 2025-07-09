import api from './axiosInstance';

export const uploadClothingItem = (formData) => {
  return api.post('/api/wardrobe/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
