import { useEffect, useState } from 'react';
import { logout, getUserInfo } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { uploadClothingItem } from '../api/wardrobe';
import useNavigationHelpers from '../hooks/useNavigationHelpers';

const Home = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [image, setImage] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
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
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
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
    }
  };
  const renderSubcategoryOptions = () => {
    const options = subcategoryMap[category] || [];
    return (
      <div>
        <label>Alakategoria:</label>
        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          required
        >
          <option value="">Valitse...</option>
          {options.map((sub, idx) => (
            <option key={idx} value={sub}>{sub}</option>
          ))}
        </select>
      </div>
    );
  };
  return (
    <div>
      <h2>Tervetuloa ZClosettiin: {username}</h2>

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
          <label>Kategoria:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="top">Yläosa</option>
            <option value="bottom">Alaosa</option>
            <option value="outerwear">Takki</option>
            <option value="shoes">Kengät</option>
            <option value="accessory">Asuste</option>
            <option value="other">Muu</option>
          </select>
        </div>
        {category && renderSubcategoryOptions()}
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
      <button onClick={goToWardrobe}>Näytä vaatekaappi</button>
    </div>
  );
};

export default Home
