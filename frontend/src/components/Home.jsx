import { useEffect, useState } from 'react'
import { getWelcomeMessage } from '../api/welcome';
import { logout } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [message, setMessage] = useState("Ladataan...")
  const navigate = useNavigate();

  useEffect(() => {
    getWelcomeMessage()
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage("Virhe: " + err.message));
  }, []);

  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h2>ZCloset</h2>
      <p>{message}</p>
      <button onClick={handleLogout}>Kirjaudu ulos</button>
    </div>
  )
}

export default Home
