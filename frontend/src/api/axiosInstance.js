import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lisää token headeriin automaattisesti
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: jos access-token vanhentui (401) → uusi se
instance.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (
      err.response &&
      err.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: refreshToken
        });

        localStorage.setItem('accessToken', response.data.access);

        // Aseta uusi token headeriin ja yritä alkuperäinen pyyntö uudelleen
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Refresh epäonnistui", refreshError);
        // Voit ohjata käyttäjän uloskirjautumiseen tässä vaiheessa
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
