import { useEffect, useState } from 'react'
import { getWelcomeMessage } from '../api/welcome';

const Home = () => {
  const [message, setMessage] = useState("Ladataan...")

  useEffect(() => {
    getWelcomeMessage()
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage("Virhe: " + err.message));
  }, []);

  return (
    <div>
      <h2>ZCloset</h2>
      <p>{message}</p>
    </div>
  )
}

export default Home
