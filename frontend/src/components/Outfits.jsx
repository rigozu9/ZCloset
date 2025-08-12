import React, { useEffect, useState } from 'react';
import { getOutfits } from '../api/outfits';
import OutfitItem from './OutfitItem';

const Outfits = () => {
  const [outfits, setOutfits] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getOutfits()
      .then(res => setOutfits(res.data))
      .catch(err => {
        setError('Virhe haettaessa asuja');
        console.error(err);
      });
  }, []);

  return (
    <div>
      <h1>Outfits</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {outfits.length === 0 && !error ? (
        <p>Loading outfits...</p>
      ) : (
        outfits.map(outfit => (
          <div key={outfit.id} style={{ border: '1px solid #333', margin: '1rem', padding: '1rem', borderRadius: '8px' }}>
            <h2>{outfit.name}</h2>
            <p>{outfit.notes}</p>
            <p>Created: {new Date(outfit.created_at).toLocaleString()}</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {outfit.items.map(item => (
                <OutfitItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Outfits;
