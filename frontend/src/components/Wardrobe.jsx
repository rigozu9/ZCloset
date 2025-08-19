import { useEffect, useState } from 'react';
import { getMyWardrobe } from '../api/wardrobe';
import { getUserInfo } from '../api/auth';
import WardrobeItem from '../components/WardrobeItem';
import useNavigationHelpers from '../hooks/useNavigationHelpers';
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
  const { goToOutfitBuilder } = useNavigationHelpers();

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {username ? `${username}:n vaatekaappi` : 'Oma vaatekaappi'}
        </Typography>
        <Button 
          variant="contained" 
          onClick={goToOutfitBuilder}
          disabled={items.length === 0}
        >
          Luo outfit
        </Button>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {items.map(item => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
            <WardrobeItem item={item} onDelete={handleItemDelete}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Wardrobe;
