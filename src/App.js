import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import AuthContext, { AuthProvider } from './AuthProvider';
import axios from 'axios';
import user from './UserExample'; //später raus
import Layout from './components/Layout';
import RequireAuth from './RequireAuth';

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

  function redirect() {
    if (user.role=="admin") {
      window.location.href = 'admin';
      return (
        <Navigate to="/admin" replace />
      )
    } else if (user.role=="manager") {
      return (
        <Navigate to="/manager" replace />
      )
    } else if (user.role=="assembler") {
      return (
        <Navigate to="/assembler" replace />
      )
    } else {
      return (
        <Navigate to="/error" replace />
      )
    }
  }

  return (
    <BrowserRouter>
      {/*<AuthProvider>*/}
      <Layout>
        <Routes>
          {/*<Route path='/' element={(user.is_loged_in === true ? redirect : <Login />)} />*/}
          <Route path='/' element={<Login />} />

          <Route element={<RequireAuth allowedRoles="admin" />}>
            <Route path='/admin' element={<AdminDashboard />} />
          </Route>

          <Route path='/manager' element={<ManagerDashboard />} />
            <Route path='/manager/appointment' element={<CreateAppointment />} />
            
          {/*<Route element={<RequireAuth allowedRoles="manager" />}>
            <Route path='/manager' element={<ManagerDashboard />} />
            <Route path='/manager/appointment' element={<CreateAppointment />} />
          </Route>*/}
          
          <Route path='/assembler' element={user.role=="assembler" ? <AssemblerDashboard /> : redirect} />

          <Route path='/password' element={<ChangePassword />} />
          <Route path='*' element={<Error404 />} />
          <Route path='/error' element={<Error404 />} />
        </Routes>
      </Layout>
      {/*</AuthProvider>*/}
    </BrowserRouter>
  );
}

