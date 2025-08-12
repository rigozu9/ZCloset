import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Home from './components/Home';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import PrivateRoute from './components/PrivateRoute';
import Wardrobe from './components/Wardrobe';
import Outfits from './components/Outfits';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Box sx={{ mt: 15 }}> {/* Add margin-top to account for fixed navbar */}
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} /> 
          <Route path="/login" element={<SignIn />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/outfits" element={<Outfits />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App
