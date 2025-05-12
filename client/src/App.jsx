import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Ranking from './pages/Ranking';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
    </Router>
  );
}

export default App;
