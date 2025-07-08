import { useEffect, useState } from 'react'
import { getWelcomeMessage } from '../api/welcome';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [message, setMessage] = useState("Ladataan...")
  const navigate = useNavigate();

  useEffect(() => {
    getWelcomeMessage()
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage("Virhe: " + err.message));
  }, []);
  
  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div>
      <h2>ZCloset</h2>
      <p>{message}</p>
      <button onClick={goToRegister}>Rekisteröidy</button>
    </div>
  )
}

export default Home
