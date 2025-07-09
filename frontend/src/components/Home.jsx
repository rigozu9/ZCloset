import { useState } from 'react';
import { logout } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { uploadClothingItem } from '../api/wardrobe';

const Home = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('name', name);
    if (image) {
      formData.append('image', image);
    }

    try {
      await uploadClothingItem(formData);
      setSuccess('Vaate lisätty onnistuneesti!');
      setName('');
      setImage(null);
    } catch (err) {
      console.error(err);
      setError('Lataus epäonnistui.');
    }
  };

  return (
    <div>
      <h2>ZCloset – Oma vaatekaappi</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Vaatekappaleen nimi:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Valitse kuva:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit">Lisää vaate</button>
      </form>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleLogout}>Kirjaudu ulos</button>
    </div>
  );
};

export default Home
