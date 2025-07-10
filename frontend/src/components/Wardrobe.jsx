import { useEffect, useState } from 'react';
import { getMyWardrobe } from '../api/wardrobe';
import { getUserInfo } from '../api/auth';


const Wardrobe = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Hae vaatteet
    getMyWardrobe()
      .then(res => setItems(res.data))
      .catch(err => {
        console.error(err);
        setError("Virhe haettaessa vaatteita");
      });

    // Hae käyttäjänimi
    getUserInfo()
      .then(res => setUsername(res.data.username))
      .catch(err => {
        console.error(err);
        setUsername(''); // fallback
      });
  }, []);


  return (
    <div>
      <h2>{username ? `${username}:n vaatekaappi` : 'Oma vaatekaappi'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {items.map(item => (
          <div key={item.id}>
            <img
              src={`http://localhost:8000${item.image}`}
              alt={item.name}
              style={{ width: '150px', borderRadius: '8px' }}
            />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;
