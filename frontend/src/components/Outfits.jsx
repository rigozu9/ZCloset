import React, { useEffect, useState } from 'react';
import { getOutfits } from '../api/outfits';
import OutfitItem from './OutfitItem';
import useNavigationHelpers from '../hooks/useNavigationHelpers';
import {
  Box,
  Typography,
  Button,
  Alert,
} from '@mui/material';

const Outfits = () => {
  const [outfits, setOutfits] = useState([]);
  const [error, setError] = useState('');
  const { goToHome } = useNavigationHelpers();

  useEffect(() => {
    getOutfits()
      .then(res => setOutfits(res.data))
      .catch(err => {
        setError('Virhe haettaessa asuja');
        console.error(err);
      });
  }, []);

  return (
    <Box sx={{ mt: 6, mx: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Asut
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {outfits.length === 0 && !error ? (
        <Typography>Ladataan asuja...</Typography>
      ) : (
        outfits.map(outfit => (
          <Box 
            key={outfit.id} 
            sx={{ 
              border: '1px solid #333', 
              margin: '1rem 0', 
              padding: '1rem', 
              borderRadius: '8px',
              backgroundColor: 'background.paper'
            }}
          >
            <Typography variant="h5" gutterBottom>{outfit.name}</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {outfit.notes}
            </Typography>
            <Typography variant="body2" color="text.disabled" gutterBottom>
              Luotu: {new Date(outfit.created_at).toLocaleString()}
            </Typography>
            <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', mt: 2 }}>
              {outfit.items.map(item => (
                <OutfitItem key={item.id} item={item} />
              ))}
            </Box>
          </Box>
        ))
      )}
      
      <Box sx={{ mt: 4 }}>
        <Button 
          variant="outlined" 
          onClick={goToHome}
          size="large"
        >
          Palaa kotisivulle
        </Button>
      </Box>
    </Box>
  );
};

export default Outfits;
