import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import AssemblerDashboard from './pages/AssemblerDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/manager-dashboard' element={<ManagerDashboard />} />
        <Route path='/assembler-dashboard' element={<AssemblerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

