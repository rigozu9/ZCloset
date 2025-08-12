import { useEffect, useState } from 'react';
import { getMyWardrobe } from '../api/wardrobe';
import { getUserInfo } from '../api/auth';
import useNavigationHelpers from '../hooks/useNavigationHelpers';
import WardrobeItem from '../components/WardrobeItem';
import {
  Box,
  Typography,
  Button,
  Alert,
  Grid,
} from '@mui/material';

const Wardrobe = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const { goToHome } = useNavigationHelpers();

  useEffect(() => {
    // Hae vaatteet
    getMyWardrobe()
      .then(res => setItems(res.data))
      .catch(err => {
        console.error(err);
        setError("Virhe haettaessa vaatteita");
      });

    // Hae käyttäjänimi
    getUserInfo()
      .then(res => setUsername(res.data.username))
      .catch(err => {
        console.error(err);
        setUsername(''); // fallback
      });
  }, []);

  const handleItemDelete = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };


  return (
    <Box sx={{ mt: 6, mx: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {username ? `${username}:n vaatekaappi` : 'Oma vaatekaappi'}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {items.map(item => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <WardrobeItem item={item} onDelete={handleItemDelete}/>
          </Grid>
        ))}
      </Grid>
      
      <Button 
        variant="outlined" 
        onClick={goToHome}
        size="large"
      >
        Palaa kotisivulle
      </Button>
    </Box>
  );
};

export default Wardrobe;
