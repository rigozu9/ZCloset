import { useEffect, useState } from 'react';
import { getUserInfo } from '../api/auth';
import { uploadClothingItem, getCategories } from '../api/wardrobe';
import {
  Container,
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
} from '@mui/material';

const Home = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  const [categories, setCategories] = useState([]);       // [{slug, name, subcategories:[{slug,name}] }]
  const [subcategories, setSubcategories] = useState([]); // aktiivisen kategorian subit

  const [category, setCategory] = useState('');           // tallennetaan slug
  const [subcategory, setSubcategory] = useState('');     // tallennetaan slug

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1) Hae käyttäjä + kategoriat
  useEffect(() => {
    getUserInfo()
      .then(res => setUsername(res.data.username))
      .catch(err => {
        console.error(err);
        setUsername('');
      });

    getCategories()
      .then(res => {
        setCategories(res.data || []);
      })
      .catch(err => {
        console.error('[getCategories] error:', err);
        setCategories([]);
      });
  }, []);

  // 2) Kun category vaihtuu → päivitä subcategories ja nollaa subcategory
  useEffect(() => {
    if (!category) {
      setSubcategories([]);
      setSubcategory('');
      return;
    }
    const selected = categories.find(c => c.slug === category);
    setSubcategories(selected?.subcategories ?? []);
    setSubcategory('');
  }, [category, categories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Kuva on liian suuri. Maksimikoko on 10MB.');
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Sallitut kuvamuodot ovat: JPEG, JPG, PNG, WebP');
        return;
      }
      setError('');
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
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
    formData.append('category', category);       // slug
    formData.append('subcategory', subcategory); // slug
    if (image) formData.append('image', image);

    try {
      await uploadClothingItem(formData);
      setSuccess('Vaate lisätty onnistuneesti!');
      setName('');
      setCategory('');       // nollaa valinnan
      setSubcategory('');
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error(err);
      setError('Lataus epäonnistui.');
    } finally {
      setIsLoading(false);
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

            {/* Kategoria (slug) */}
            <FormControl fullWidth required>
              <InputLabel id="category-label">Kategoria</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                label="Kategoria"
                onChange={(e) => setCategory(e.target.value)}
                disabled={!categories.length}
              >
                {categories.map((c) => (
                  <MenuItem key={c.slug} value={c.slug}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Alakategoria (slug) */}
            {category && (
              <FormControl fullWidth required>
                <InputLabel id="subcategory-label">Alakategoria</InputLabel>
                <Select
                  labelId="subcategory-label"
                  value={subcategory}
                  label="Alakategoria"
                  onChange={(e) => setSubcategory(e.target.value)}
                  disabled={!subcategories.length}
                >
                  {subcategories.map((s) => (
                    <MenuItem key={s.slug} value={s.slug}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Button variant="outlined" component="label" fullWidth>
              Valitse kuva
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                hidden
                onChange={handleImageChange}
              />
            </Button>

            {imagePreview && (
              <Card sx={{ maxWidth: 400, mx: 'auto' }}>
                <CardMedia
                  component="img"
                  height="320"
                  image={imagePreview}
                  alt="Valittu kuva"
                  sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5', imageRendering: 'crisp-edges' }}
                />
              </Card>
            )}

            <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
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

export default Home;
