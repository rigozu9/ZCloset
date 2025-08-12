import { useEffect, useState } from 'react';
import { getMyWardrobe } from '../api/wardrobe';
import { getUserInfo } from '../api/auth';
import { createOutfit } from '../api/outfits';
import useNavigationHelpers from '../hooks/useNavigationHelpers';
import WardrobeItem from '../components/WardrobeItem';
import {
  Box,
  Typography,
  Button,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
} from '@mui/material';

const Wardrobe = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [showOutfitDialog, setShowOutfitDialog] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  const [outfitNotes, setOutfitNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState({
    top: null,
    bottom: null,
    outerwear: null,
    shoes: null,
    accessory: [],
    other: []
  });
  const { goToHome } = useNavigationHelpers();

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

  const handleItemDelete = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Ryhmittele vaatteet kategorioiden mukaan
  const groupItemsByCategory = () => {
    return items.reduce((groups, item) => {
      const category = item.category || 'other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {});
  };

  const handleCategorySelect = (category, itemId) => {
    setSelectedItems(prev => {
      if (category === 'accessory' || category === 'other') {
        // Multiple selection for accessory and other
        const currentItems = prev[category] || [];
        if (currentItems.includes(itemId)) {
          return {
            ...prev,
            [category]: currentItems.filter(id => id !== itemId)
          };
        } else {
          return {
            ...prev,
            [category]: [...currentItems, itemId]
          };
        }
      } else {
        // Single selection for other categories
        return {
          ...prev,
          [category]: prev[category] === itemId ? null : itemId
        };
      }
    });
  };

  const handleCreateOutfit = async () => {
    if (!outfitName.trim()) {
      setError('Anna outfitille nimi');
      return;
    }

    // Collect all selected items
    const allSelectedItems = [];
    Object.entries(selectedItems).forEach(([category, value]) => {
      if (category === 'accessory' || category === 'other') {
        value.forEach(itemId => {
          allSelectedItems.push({ item: itemId, slot: category });
        });
      } else if (value) {
        allSelectedItems.push({ item: value, slot: category });
      }
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
      
      // Reset form
      setOutfitName('');
      setOutfitNotes('');
      setSelectedItems({
        top: null,
        bottom: null,
        outerwear: null,
        shoes: null,
        accessory: [],
        other: []
      });
      setShowOutfitDialog(false);
      setError('');
    } catch (err) {
      console.error('Failed to create outfit:', err);
      setError('Outfitin luominen epäonnistui');
    }
  };


  return (
    <Box sx={{ mt: 6, mx: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {username ? `${username}:n vaatekaappi` : 'Oma vaatekaappi'}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => setShowOutfitDialog(true)}
          disabled={items.length === 0}
        >
          Luo outfit
        </Button>
      </Box>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {items.map(item => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
            <WardrobeItem item={item} onDelete={handleItemDelete}/>
          </Grid>
        ))}
      </Grid>
      
      <Button 
        variant="outlined" 
        onClick={goToHome}
        size="large"
      >
        Palaa kotisivulle
      </Button>

      {/* Outfit Creation Dialog */}
      <Dialog open={showOutfitDialog} onClose={() => setShowOutfitDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Luo uusi outfit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Outfit nimi"
            fullWidth
            variant="outlined"
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <TextField
            margin="dense"
            label="Muistiinpanot (valinnainen)"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={outfitNotes}
            onChange={(e) => setOutfitNotes(e.target.value)}
            sx={{ mb: 3 }}
          />

          {/* Category Selection */}
          {Object.entries(groupItemsByCategory()).map(([category, categoryItems]) => (
            <Card key={category} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  {(category === 'accessory' || category === 'other') && ' (voi valita useita)'}
                </Typography>
                
                <FormControl fullWidth>
                  <Select
                    multiple={category === 'accessory' || category === 'other'}
                    displayEmpty
                    value={
                      category === 'accessory' || category === 'other' 
                        ? selectedItems[category] || []
                        : selectedItems[category] || ''
                    }
                    onChange={(e) => {
                      if (category === 'accessory' || category === 'other') {
                        setSelectedItems(prev => ({
                          ...prev,
                          [category]: e.target.value
                        }));
                      } else {
                        handleCategorySelect(category, e.target.value);
                      }
                    }}
                    renderValue={(selected) => {
                      if (category === 'accessory' || category === 'other') {
                        if (selected.length === 0) {
                          return `Valitse ${category}`;
                        }
                        return (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((itemId) => {
                              const item = categoryItems.find(i => i.id === itemId);
                              return <Chip key={itemId} label={item?.name || itemId} size="small" />;
                            })}
                          </Box>
                        );
                      } else {
                        if (!selected) {
                          return `Valitse ${category}`;
                        }
                        const item = categoryItems.find(i => i.id === selected);
                        return item?.name || '';
                      }
                    }}
                  >
                    {categoryItems.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOutfitDialog(false)}>Peruuta</Button>
          <Button 
            onClick={handleCreateOutfit}
            variant="contained"
            disabled={!outfitName.trim()}
          >
            Luo outfit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Wardrobe;
