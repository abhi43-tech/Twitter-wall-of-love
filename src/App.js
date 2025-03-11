import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
// import PublicWall from './pages/walls';
import Dashboard from './pages/dashboard';
import Profile from './pages/profile';
import Login from './components/auth/login';
import Signup from './components/auth/signup';
import RequestResetPassword from './components/auth/requestResetPass';
import ResetPassword from './components/auth/resetPassword'
import CreateWall from './pages/createWall';
import Tweets from './pages/tweets';
import CreateTweet from './pages/createTweet';
import EditWall from './pages/editWall';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/wall/:id" element={<PublicWall />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password/request" element={<RequestResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/create-wall" element={<CreateWall />} />
        <Route path="/walls/:wallId/tweets" element={<Tweets />} />
        <Route path="/walls/:wallId/create-tweet" element={<CreateTweet />} />
        <Route path="/walls/:wallId/edit" element={<EditWall />} />
      </Routes>
    </Router>
  );
}

export default App;