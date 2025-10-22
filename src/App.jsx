import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import CreateProject from './pages/CreateProject';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';
import IPPortfolio from './pages/IPPortfolio';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/portfolio" element={<IPPortfolio />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App
