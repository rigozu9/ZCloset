import { useEffect, useState } from 'react';
import { getUserInfo } from '../api/auth';
import { uploadClothingItem } from '../api/wardrobe';
import {
  Container,   // ← Tämä puuttui!
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';



const Home = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const subcategoryMap = {
    top: ['T-paita', 'Huppari', 'Kauluspaita', 'Knit', 'Svetari'],
    bottom: ['Farkut', 'Cargohousut', 'Shortsit', 'Hame', 'Puvun housut'],
    outerwear: ['Coach jacket', 'Bomber', 'Bleiseri'],
    shoes: ['Tennarit', 'Saappaat', 'Sandaalit'],
    accessory: ['Laukku', 'Vyö', 'Lippis', 'Kaulakoru'],
    other: ['Muu vaate'],
  };

  useEffect(() => {
    getUserInfo()
      .then(res => setUsername(res.data.username))
      .catch(err => {
        console.error(err);
        setUsername(''); // fallback
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tarkista tiedostokoko (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Kuva on liian suuri. Maksimikoko on 10MB.');
        return;
      }
      
      // Tarkista tiedostomuoto
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Sallitut kuvamuodot ovat: JPEG, JPG, PNG, WebP');
        return;
      }
      
      setError('');
      setImage(file);
      
      // Luo URL esikatselu varten
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('subcategory', subcategory);
    if (image) {
      formData.append('image', image);
    }

    try {
      await uploadClothingItem(formData);
      setSuccess('Vaate lisätty onnistuneesti!');
      setName('');
      setCategory('other');
      setSubcategory('');
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      setError('Lataus epäonnistui.');
    } finally {
      setIsLoading(false); // Piilota "Ladataan..."
    }
  };
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Tervetuloa ZClosettiin, {username}
        </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Vaatekappaleen nimi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />

          <FormControl fullWidth required>
            <InputLabel id="category-label">Kategoria</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Kategoria"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="top">Yläosa</MenuItem>
              <MenuItem value="bottom">Alaosa</MenuItem>
              <MenuItem value="outerwear">Takki</MenuItem>
              <MenuItem value="shoes">Kengät</MenuItem>
              <MenuItem value="accessory">Asuste</MenuItem>
              <MenuItem value="other">Muu</MenuItem>
            </Select>
          </FormControl>

          {category && (
            <FormControl fullWidth required>
              <InputLabel id="subcategory-label">Alakategoria</InputLabel>
              <Select
                labelId="subcategory-label"
                value={subcategory}
                label="Alakategoria"
                onChange={(e) => setSubcategory(e.target.value)}
              >
                {subcategoryMap[category].map((sub, idx) => (
                  <MenuItem key={idx} value={sub}>
                    {sub}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button
            variant="outlined"
            component="label"
            fullWidth
          >
            Valitse kuva
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              hidden
              onChange={handleImageChange}
            />
          </Button>

          {/* Kuvan esikatselu */}
          {imagePreview && (
            <Card sx={{ maxWidth: 400, mx: 'auto' }}>
              <CardMedia
                component="img"
                height="320"
                image={imagePreview}
                alt="Valittu kuva"
                sx={{ 
                  objectFit: 'contain',
                  backgroundColor: '#f5f5f5',
                  imageRendering: 'crisp-edges'
                }}
              />
            </Card>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Ladataan...' : 'Lisää vaate'}
          </Button>

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

        </Stack>
      </form>
      </Box>
    </Container>
  );
};

export default Home
