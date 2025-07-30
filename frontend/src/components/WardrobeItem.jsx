import { useState } from 'react';
import { detectClothingAndCategoryColor, deleteClothingItem  } from '../api/wardrobe';

const WardrobeItem = ({ item, onDelete }) => {
  const [color, setColor] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDetectColor = async () => {
    try {
      setLoading(true);
      const response = await detectClothingAndCategoryColor(item.id);
      setColor(response.data.color);
      setCategory(response.data.category);
    } catch (err) {
      console.error('Värin tai kategorian tunnistus epäonnistui', err);
      setColor('Tuntematon');
      setCategory('Tuntematon');
    } finally {
      setLoading(false);
    }
  };
  console.log(item);

  const handleDelete = async () => {
    try {
      await deleteClothingItem(item.id);
      onDelete(item.id); // ilmoitetaan parent-komponentille
    } catch (err) {
      console.error('Vaatteen poistaminen epäonnistui:', err);
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
      <p>Item color: {item.color}</p>
      <button onClick={handleDetectColor} disabled={loading}>
        {loading ? 'Tunnistetaan...' : 'Tunnista väri ja kategoria'}
      </button>
      {color && <p>Väri: {color}</p>}
      {category && <p>Category: {category}</p>}
      <button onClick={handleDelete}>Poista</button>
    </div>
  );
};

export default WardrobeItem;
