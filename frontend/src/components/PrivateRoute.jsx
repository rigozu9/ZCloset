import { Navigate } from 'react-router-dom';

const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // dekoodaa payload
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000); // aika sekunteina
    return exp > now; // palauttaa true jos ei ole vanhentunut
  } catch {
    return false; // jos jokin menee pieleen
  }
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');

    return isTokenValid(token) ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
