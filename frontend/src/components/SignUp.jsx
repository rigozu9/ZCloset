import { useState } from 'react'
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        const res = await register(userName, password)
        console.log("Rekisteröinti onnistui:", res.data);
        navigate('/login');
    } catch (err) {
        console.error("Rekisteröinti epäonnistui:", err);        
    }
  }

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <h2>ZCloset Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Käyttäjänimi"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Rekisteröidy</button>
      </form>
      <button onClick={goToLogin}>Kirjaudu sisään</button>
    </div>
  );
};

export default SignUp
