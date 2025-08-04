import { useEffect, useState } from 'react';
import { logout, getUserInfo } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { uploadClothingItem } from '../api/wardrobe';
import useNavigationHelpers from '../hooks/useNavigationHelpers';
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
} from '@mui/material';



const Home = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { goToWardrobe } = useNavigationHelpers();

  const subcategoryMap = {
    top: ['T-paita', 'Huppari', 'Kauluspaita', 'Knit'],
    bottom: ['Farkut', 'Shortsit', 'Hame', 'Puvun housut'],
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

  const handleLogout = () => {
    logout();
    navigate('/login');
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
      setImage(null);
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
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Button>

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

          <Button onClick={handleLogout} fullWidth variant="text">
            Kirjaudu ulos
          </Button>
          <Button onClick={goToWardrobe} fullWidth variant="text">
            Näytä vaatekaappi
          </Button>
        </Stack>
      </form>

      {isLoading && <p>Ladataan...</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      </Box>
    </Container>
  );
};

export default Home
