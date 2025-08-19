import React, { useEffect, useState } from 'react';
import { getMyWardrobe } from '../api/wardrobe';
import { Box, Typography, Paper, TextField, Button, Alert } from '@mui/material';
import { createOutfit } from '../api/outfits';

const OutfitBuilder = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({
    top: [],
    bottom: [],
    shoes: [],
    accessory: [],
  })
  const [outfitName, setOutfitName] = useState('');
  const [outfitNotes, setOutfitNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  // outfitin tallennus
  const handleCreateOutfit = async () => {
    if (!outfitName.trim()) {
      setError('Anna outfitille nimi');
      return;
    }

    // kerätään kaikki valitut itemit
    const allSelectedItems = [];
    Object.entries(selectedItems).forEach(([category, value]) => {
      value.forEach(item => {
        allSelectedItems.push({ item: item.id, slot: category });
      });
    });

    if (allSelectedItems.length === 0) {
      setError('Valitse vähintään yksi vaate');
      return;
    }

    try {
      await createOutfit({
        name: outfitName,
        notes: outfitNotes,
        items: allSelectedItems
      });
      setSuccess('Outfit luotu onnistuneesti!');
      setError('');
      // resetoi
      setOutfitName('');
      setOutfitNotes('');
      setSelectedItems({ top: [], bottom: [], shoes: [], accessory: [] });
    } catch (err) {
      console.error('Failed to create outfit:', err);
      setError('Outfitin luominen epäonnistui');
      setSuccess('');
    }
  };

  return (
    <Box sx={{ mt: 4, mx: 2 }}>
      <Typography variant="h4" gutterBottom>Outfit builder</Typography>
      <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
        Raahaa kategorian päälle vaate. Klikkaamalla kuvaa poistat sen.
      </Typography>

      {/* Nimi ja muistiinpanot */}
      <TextField 
        label="Outfitin nimi"
        fullWidth
        value={outfitName}
        onChange={(e) => setOutfitName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField 
        label="Muistiinpanot (valinnainen)"
        fullWidth
        multiline
        rows={2}
        value={outfitNotes}
        onChange={(e) => setOutfitNotes(e.target.value)}
        sx={{ mb: 3 }}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Vaatelistat vasemmalla */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5">Vaatteet</Typography>
          {Object.entries(categories).map(([cat, catItems]) => (
            <Box key={cat} sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>{cat}</Typography>
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
                height: 180,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed #aaa',
                color: 'black',
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
                      onClick={() => {
                        setSelectedItems(prev => ({
                          ...prev,
                          [target.key]: prev[target.key].filter(i => i.id !== item.id),
                        }));
                      }}
                      style={{ 
                        width: 150, 
                        height: 150, 
                        objectFit: 'contain', 
                        cursor: 'pointer',
                        border: '1px solid #ccc',
                        borderRadius: 4
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography>{target.label}, drag item/items here</Typography>
              )}
            </Paper>
          ))}
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCreateOutfit} 
            sx={{ mt: 3 }}
          >
            Tallenna outfit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default OutfitBuilder;
