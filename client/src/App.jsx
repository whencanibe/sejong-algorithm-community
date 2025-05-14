import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Ranking from './pages/Ranking';
import MyPage from './pages/MyPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
