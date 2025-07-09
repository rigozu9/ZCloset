import { useState } from 'react';
import { login } from '../api/auth';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await login(username, password);
      setSuccess('Kirjautuminen onnistui!');
    } catch (err) {
      console.error(err);
      setError('Väärä käyttäjätunnus tai salasana.');
    }
  };

  return (
    <div>
      <h2>Kirjaudu sisään</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Käyttäjätunnus:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Salasana:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Kirjaudu</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default SignIn;
