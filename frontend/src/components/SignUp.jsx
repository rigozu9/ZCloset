import { useState } from 'react';
import { register } from '../api/auth';
import useNavigationHelpers from '../hooks/useNavigationHelpers';

import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Stack,
  Alert,
} from '@mui/material';

const SignUp = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { goToLogin } = useNavigationHelpers();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await register(userName, password);
      console.log('Rekisteröinti onnistui:', res.data);
      goToLogin();
    } catch (err) {
      console.error('Rekisteröinti epäonnistui:', err);
      setError('Rekisteröinti epäonnistui. Tarkista kentät tai yritä myöhemmin.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Rekisteröidy
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Käyttäjänimi"
              variant="outlined"
              fullWidth
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <TextField
              label="Salasana"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button variant="contained" type="submit" fullWidth>
              Rekisteröidy
            </Button>
            <Button onClick={goToLogin} fullWidth>
              Kirjaudu sisään
            </Button>
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default SignUp;
