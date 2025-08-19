import React, { useEffect, useState } from 'react';
import { getMyWardrobe } from '../api/wardrobe';
import { Box, Typography, Paper } from '@mui/material';

const OutfitBuilder = () => {
  const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({
    top: [],
    bottom: [],
    shoes: [],
    accessory: [],
    })

  useEffect(() => {
    getMyWardrobe()
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);

  // Ryhmitellään vaatteet kategorioittain
  const categories = {
    top: items.filter(i => i.category === 'top'),
    bottom: items.filter(i => i.category === 'bottom'),
    shoes: items.filter(i => i.category === 'shoes'),
    accessory: items.filter(i => i.category === 'accessory'),
  };

// mapping oikeanpuoleisten labelien -> category key
  const dropTargets = [
    { label: 'Tops', key: 'top' },
    { label: 'Bottoms', key: 'bottom' },
    { label: 'Shoes', key: 'shoes' },
    { label: 'Accessories', key: 'accessory' },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 4, mt: 4 }}>
      {/* Vaatelistat vasemmalla */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5">Vaatteet</Typography>
        {Object.entries(categories).map(([cat, catItems]) => (
          <Box key={cat} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {cat}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {catItems.map(item => (
                <img
                  key={item.id}
                  src={`http://localhost:8000${item.image}`}
                  alt={item.name}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("itemId", item.id);
                    e.dataTransfer.setData("itemCategory", item.category);
                  }}
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    cursor: 'grab',
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Drop-alueet oikealla */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5">Outfit builder</Typography>
        {dropTargets.map((target) => (
          <Paper
            key={target.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const itemId = e.dataTransfer.getData("itemId");
              const item = items.find(i => i.id.toString() === itemId);
              if (item) {
                setSelectedItems(prev => ({
                  ...prev,
                  [target.key]: [...prev[target.key], item],
                }));
              }
            }}
            sx={{
              height: 200,
              mb: 2,
              color: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #aaa',
              borderRadius: 2,
              backgroundColor: '#fafafa',
              position: 'relative',
            }}
          >
            {selectedItems[target.key].length > 0 ? (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedItems[target.key].map((item) => (
                <img
                    key={item.id}
                    src={`http://localhost:8000${item.image}`}
                    alt={item.name}
                    style={{ width: 170, height: 170, objectFit: 'contain' }}
                />
                ))}
            </Box>
            ) : (
            <Typography>{target.label}, drag item/items here</Typography>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default OutfitBuilder;
