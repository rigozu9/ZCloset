import { useState } from 'react';
import { login } from '../api/auth';
import useNavigationHelpers from '../hooks/useNavigationHelpers';
import {
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Stack,
  Box,
} from '@mui/material';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { goToRegister, goToHome } = useNavigationHelpers();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await login(username, password);
      setSuccess('Kirjautuminen onnistui!');
      goToHome();
    } catch (err) {
      console.error(err);
      setError('Väärä käyttäjätunnus tai salasana.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Kirjaudu sisään
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Käyttäjätunnus"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Salasana"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Kirjaudu
            </Button>
          </Stack>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        <Button
          onClick={goToRegister}
          variant="text"
          fullWidth
          sx={{ mt: 2 }}
        >
          Rekisteröidy
        </Button>
      </Box>
    </Container>
  );
};

export default SignIn;
