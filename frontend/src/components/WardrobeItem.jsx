import { useState } from 'react';
import { detectClothingColor } from '../api/wardrobe';

const WardrobeItem = ({ item }) => {
  const [color, setColor] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDetectColor = async () => {
    try {
      setLoading(true);
      const response = await detectClothingColor(item.id);
      setColor(response.data.color);
    } catch (err) {
      console.error('Värin tunnistus epäonnistui', err);
      setColor('Tuntematon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <img
        src={`http://localhost:8000${item.image}`}
        alt={item.name}
        style={{ width: '150px', borderRadius: '8px' }}
      />
      <p>{item.name}</p>
      <button onClick={handleDetectColor} disabled={loading}>
        {loading ? 'Tunnistetaan...' : 'Tunnista väri'}
      </button>
      {color && <p>Väri: {color}</p>}
    </div>
  );
};

export default WardrobeItem;
