import { useNavigate } from 'react-router-dom';

const useNavigationHelpers = () => {
  const navigate = useNavigate();

  return {
    goToHome: () => navigate('/home'),
    goToWardrobe: () => navigate('/wardrobe'),
    goToLogin: () => navigate('/login'),
    goToRegister: () => navigate('/'),
    goBack: () => navigate(-1),
  };
};

export default useNavigationHelpers;
