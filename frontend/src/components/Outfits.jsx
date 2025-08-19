import React, { useEffect, useState } from 'react';
import { getOutfits, deleteOutfit } from '../api/outfits';
import { getUserInfo } from '../api/auth';
import OutfitItem from './OutfitItem';
import {
  Box,
  Typography,
  Button,
  Alert,
} from '@mui/material';

const Outfits = () => {
  const [outfits, setOutfits] = useState([]);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  // uploaded_at

  useEffect(() => {
    getOutfits()
      .then(res =>  {
        const sortedOutfitList = [...res.data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setOutfits(sortedOutfitList)
      })
      .catch(err => {
        setError('Virhe haettaessa asuja');
        console.error(err);
      });
    getUserInfo()
        .then(res => setUsername(res.data.username))
        .catch(err => {
        console.error(err);
        setUsername(''); // fallback
        });
  }, []);

  const handleDeleteOutfit = async (outfitId) => {
    try {
      await deleteOutfit(outfitId);
      setOutfits(prev => prev.filter(outfit => outfit.id !== outfitId));
    } catch (err) {
      setError('Virhe poistettaessa asua');
      console.error(err);
    }
  };

  return (
    <Box sx={{ mt: 6, mx: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {username ? `${username}:n outfitit` : 'Omat outfitit'}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5">{outfit.name}</Typography>
              <Button 
                variant="contained" 
                color="error" 
                size="small"
                onClick={() => handleDeleteOutfit(outfit.id)}
              >
                Poista asu
              </Button>
            </Box>
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
    </Box>
  );
};

export default Outfits;
