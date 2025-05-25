import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dayquest from "./pages/Dayquest";
import Community from "./pages/Community";
import WritePost from "./pages/WritePost";
import PostDetail from "./pages/PostDetail";
import Ranking from "./pages/Ranking";
import MyPage from "./pages/MyPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

//라우터 연결
function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/dayquest" element={<Dayquest />} />
      <Route path="/community" element={<Community />} />
      <Route path="/community/writepost" element={<WritePost />} />
      <Route path="/community/postdetail/:id" element={<PostDetail />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
