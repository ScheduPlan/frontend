import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { Component, useContext } from 'react';
import AuthContext from './AuthProvider';
import TestUser , {roles} from './UserExample'; //später raus
import Layout from './components/Layout';

// import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChangePassword from './pages/ChangePassword';
import Error404 from './pages/Error404';
import Schedule from './pages/Schedule';
import ListItems from './pages/ListItems';
import FormCreateOrder from './forms/FormCreateOrder';
import FormCreateCustomer from './forms/FormCreateCustomer';
import FormCreateEmployee from './forms/FormCreateEmployee';
import FormCreateTeam from './forms/FormCreateTeam';
import Customer from './components/Customer';

export default function App() {

  const { auth } = useContext(AuthContext);

  function redirect() {
    if (TestUser.role=="admin") {
      window.location.href = 'admin';
      return (
        <Navigate to="/admin" replace />
      )
    } else if (TestUser.role=="manager") {
      return (
        <Navigate to="/manager" replace />
      )
    } else if (TestUser.role=="assembler") {
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
          {/*{roles.map((role, index) => (
            <Route key={index} path={role.role} element={<Dashboard />}> {// für jede Rolle wird ein Pfad erstellt und das Dashboard ausgegeben}
              {role.links?.map((link, index) => (
                console.log(link.path),
                <Route key={index} path={link.path} element={link.component} /> // jede Rolle hat eigene Unterseiten & Menülinks wozu hier separate Routen erzeugt werden
              ))}
            </Route>
          ))}*/}

          <Route path='/' element={<Login />} />

          <Route path='/admin' element={<Dashboard />} />
            <Route path='/admin/employees' element={<ListItems items={Customer} path="/employees" h1="Alle Mitarbeiter" />} />
            <Route path='/admin/employees/new' element={<FormCreateEmployee />} />
            <Route path='/admin/teams' element={<ListItems items={Customer} path="/teams" h1="Alle Mitarbeiter" />} />
            <Route path='/admin/teams/new' element={<FormCreateTeam />} />
      
          <Route path='/manager' element={<Dashboard />} />
            <Route path='/manager/schedule' element={<Schedule />} />
            <Route path='/manager/orders' element={<ListItems items={Customer} path="/orders" h1="Alle Aufträge" />} />
            <Route path='/manager/orders/new' element={<FormCreateOrder />} />
            <Route path='/manager/customers' element={<ListItems items={Customer} path="/customers" h1="Alle Kunden" />} />
            <Route path='/manager/customers/new' element={<FormCreateCustomer />} />
        

          <Route path='/assembler' element={<Dashboard />} />

          <Route path='/password' element={<ChangePassword />} />
          <Route path='*' element={<Error404 />} />
          <Route path='/error' element={<Error404 />} />
        </Routes>
      </Layout>
      {/*</AuthProvider>*/}
    </BrowserRouter>
  );
}

