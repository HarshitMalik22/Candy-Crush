import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import CandyCrush from './components/CandyCrush';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/game" element={<CandyCrush />} /> {/* Game page */}
      </Routes>
    </Router>
  );
};

export default App;
