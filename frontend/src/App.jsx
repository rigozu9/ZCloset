import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Home from './components/Home';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import PrivateRoute from './components/PrivateRoute';
import Wardrobe from './components/Wardrobe';
import Outfits from './components/Outfits';
import Navbar from './components/Navbar';
import OutfitBuilder from './components/OutfitBuilder';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Box sx={{ mt: 15 }}> {/* Add margin-top to account for fixed navbar */}
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          {/* Private routet on vain kirjautuneille */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} /> 
          <Route path="/wardrobe" element={<PrivateRoute><Wardrobe /></PrivateRoute>} /> 
          <Route path="/outfits" element={<PrivateRoute><Outfits /></PrivateRoute>} /> 
          <Route path="/outfitbuilder" element={<PrivateRoute><OutfitBuilder /></PrivateRoute>} /> 
        </Routes>
      </Box>
    </Router>
  );
};

export default App
