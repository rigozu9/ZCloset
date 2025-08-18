import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import useNavigationHelpers from '../hooks/useNavigationHelpers';

const Navbar = () => {
  const { goToHome, goToWardrobe, goToOutfits, goToLogin } = useNavigationHelpers();

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
          <Button color="inherit" onClick={goToLogin}>
            Kirjaudu ulos
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
