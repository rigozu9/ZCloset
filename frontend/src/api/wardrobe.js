import api from './axiosInstance';

export const uploadClothingItem = (formData) => {
  return api.post('/api/wardrobe/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getCategories = () => {
  return api.get('/api/taxonomy/categories/');
};


export const getMyWardrobe = () => {
  return api.get('/api/wardrobe/');
};

export const detectClothingAndCategoryColor = (clothingId) => {
  return api.post('/api/detect-color_and_category/', {
    clothing_id: clothingId,
  });
};

export const deleteClothingItem = (id) => {
  return api.delete(`api/wardrobe/${id}/`);
};