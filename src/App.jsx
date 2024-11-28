import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CandyCrush from './components/CandyCrush';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect directly to the game page */}
        <Route path="/" element={<Navigate to="/game" />} />
        
        {/* Game page route */}
        <Route path="/game" element={<CandyCrush />} />
      </Routes>
    </Router>
  );
};

export default App;
