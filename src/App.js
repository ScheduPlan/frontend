import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AuthContext, { AuthProvider } from './AuthProvider';
import axios from 'axios';
import user from './UserExample'; //später raus

// import pages
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import AssemblerDashboard from './pages/AssemblerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ChangePassword from './pages/ChangePassword';
import CreateAppointment from './pages/CreateAppointment';
import Error404 from './pages/Error404';

export default function App() {

  const { auth } = useContext(AuthContext);

  function getDashboard() {
    if (user.is_admin === true) {
      return (
        <AdminDashboard />
      );
    } else if (user.is_manager === true) {
      return (
        <ManagerDashboard />
      );
    } else if (user.is_assembler === true) {
      return (
        <AssemblerDashboard />
      );
    }
  }

  return (
    <BrowserRouter>
      {/*<AuthProvider>*/}
      <Routes>
        {/*<Route path='/' element={(user.is_loged_in === true ? getDashboard() : <Login />)} />*/}

        <Route path='/' element={<Login />} />
        <Route path='/admin' element={user.is_admin ? <AdminDashboard /> : <Error404 />} />
        <Route path='/manager' element={user.is_manager ? <ManagerDashboard /> : <Error404 />} />
        <Route path='/assembler' element={user.is_assembler ? <AssemblerDashboard /> : <Error404 />} />
        <Route path='/password' element={<ChangePassword />} />
        <Route path='/appointment' element={<CreateAppointment />} />
        <Route path='*' element={<Error404 />} />
        <Route path='/error' element={<Error404 />} />
      </Routes>
      {/*</AuthProvider>*/}
    </BrowserRouter>
  );
}

