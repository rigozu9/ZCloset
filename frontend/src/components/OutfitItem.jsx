// OutfitItem.jsx
import React from 'react';

const OutfitItem = ({ item }) => {
  if (!item || !item.item) return null;
  const clothing = item.item;
  return (
    <div style={{ minWidth: '120px' }}>
      {clothing.image && (
        <img src={`http://localhost:8000${clothing.image}`} alt={clothing.name} style={{ width: '100px', borderRadius: '8px' }} />
      )}
      <p>{clothing.name}</p>
      <p>Slot: {item.slot}</p>
      <p>Color: {clothing.color}</p>
      <p>Category: {clothing.category}</p>
    </div>
  );
};

export default OutfitItem;
