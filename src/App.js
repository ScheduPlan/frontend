import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<ManagerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
