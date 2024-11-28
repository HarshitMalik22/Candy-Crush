import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import CandyCrush from './components/CandyCrush';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Always show the AuthPage first, regardless of authentication */}
{/*         <Route path="/" element={<AuthPage />} />
         */}
        {/* Game page route */}
        <Route path="/game" element={<CandyCrush />} />
      </Routes>
    </Router>
  );
};

export default App;
