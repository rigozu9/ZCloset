import { useState } from 'react';
import { detectClothingAndCategoryColor, deleteClothingItem  } from '../api/wardrobe';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from '@mui/material';

const WardrobeItem = ({ item, onDelete }) => {
  const [color, setColor] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDetectColor = async () => {
    try {
      setLoading(true);
      const response = await detectClothingAndCategoryColor(item.id);
      setColor(response.data.color);
      setCategory(response.data.category);
    } catch (err) {
      console.error('Värin tai kategorian tunnistus epäonnistui', err);
      setColor('Tuntematon');
      setCategory('Tuntematon');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClothingItem(item.id);
      onDelete(item.id); // ilmoitetaan parent-komponentille
    } catch (err) {
      console.error('Vaatteen poistaminen epäonnistui:', err);
    }
  };

  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="280"
        image={`http://localhost:8000${item.image}`}
        alt={item.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Väri: {item.color}
        </Typography>
        {color && (
          <Typography variant="body2" color="text.secondary">
            Tunnistettu väri: {color}
          </Typography>
        )}
        {category && (
          <Typography variant="body2" color="text.secondary">
            Tunnistettu kategoria: {category}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ flexDirection: 'column', gap: 1 }}>
        <Button 
          variant="outlined" 
          onClick={handleDetectColor} 
          disabled={loading}
          fullWidth
          size="small"
        >
          {loading ? 'Tunnistetaan...' : 'Tunnista väri ja kategoria'}
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleDelete}
          fullWidth
          size="small"
        >
          Poista
        </Button>
      </CardActions>
    </Card>
  );
};

export default WardrobeItem;
