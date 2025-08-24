import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import useNavigationHelpers from '../hooks/useNavigationHelpers';
import { logout } from '../api/auth';

const Navbar = () => {
  const { goToHome, goToWardrobe, goToOutfits, goToLogin, goToOutfitBuilder } = useNavigationHelpers();
  const isLoggedIn = !!localStorage.getItem('accessToken');
  
  const handleLogout = () => {
    logout();
    goToLogin()
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={goToHome}
        >
          ZCloset
        </Typography>

        {isLoggedIn && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={goToHome}>
              Koti
            </Button>
            <Button color="inherit" onClick={goToWardrobe}>
              Vaatekaappi
            </Button>
            <Button color="inherit" onClick={goToOutfits}>
              Outfitit
            </Button>
            <Button color="inherit" onClick={goToOutfitBuilder}>
              Luo uusi outfit
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Kirjaudu ulos
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
