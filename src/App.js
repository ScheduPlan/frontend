import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { Component, useContext } from 'react';
import AuthContext from './AuthProvider';
import { AuthProvider } from './AuthProvider';
import TestUser, { roles } from './UserExample'; //später raus
import Layout from './components/Layout';

// import pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChangePassword from './forms/FormChangePassword';
import Error404 from './pages/Error404';
import Schedule from './pages/Schedule';
import ListItems from './pages/ListItems';
import FormCreateOrder from './forms/FormCreateOrder';
import FormCreateCustomer from './forms/FormCreateCustomer';
import FormCreateEmployee from './forms/FormCreateEmployee';
import FormCreateTeam from './forms/FormCreateTeam';
import Customer from './components/Customer';
import Employee from './components/Employee';
import Team from './components/Team';
import Order from './components/Order';
import FormPatchTeam from './forms/FormPatchTeam';
import Unauthorized from './pages/Unauthorized';
import AssemblerDashboard from './pages/AssemblerDashboard';
import FormPatchEmployee from './forms/FormPatchEmployee';
import FormPatchCustomer from './forms/FormPatchCustomer';
import FormPatchOrder from './forms/FormPatchOrder';

export default function App() {

  function redirect() {
    const userRole = TestUser.role.toLowerCase();
    if (userRole == "admin") {
      window.location.href = 'admin';
      return (
        <Navigate to="/admin" replace />
      )
    } else if (userRole == "manager") {
      window.location.href = '/manager';
      return (
        <Navigate to="/manager" replace />
      )
    } else if (userRole == "assembler") {
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
      <AuthProvider>
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

            <Route path='/administrator' element={<Dashboard />} />
            <Route path='/administrator/employees' element={<ListItems items={Employee} path="/employees" h1="Alle Mitarbeiter" />} />
            <Route path='/administrator/employees/new' element={<FormCreateEmployee />} />
            <Route path='/administrator/employees/:id' element={<FormPatchEmployee />} />
            <Route path='/administrator/teams' element={<ListItems items={Team} path="/teams" h1="Alle Teams" />} />
            <Route path='/administrator/teams/new' element={<FormCreateTeam />} />
            <Route path='/administrator/teams/:id' element={<FormPatchTeam />} />

            <Route path='/manager' element={<Dashboard />} />
            <Route path='/manager/schedule' element={<Schedule />} />
            <Route path='/manager/orders' element={<ListItems items={Order} path="/orders" h1="Alle Aufträge" />} />
            <Route path='/manager/orders/new' element={<FormCreateOrder />} />
            <Route path='/manager/orders/:id' element={<FormPatchOrder />} />
            <Route path='/manager/customers' element={<ListItems items={Customer} path="/customers" h1="Alle Kunden" />} />
            <Route path='/manager/customers/new' element={<FormCreateCustomer />} />
            <Route path='/manager/customers/:id' element={<FormPatchCustomer />} />


            <Route path='/fitter' element={<Dashboard />} />
            <Route path='/fitter/calendar' element={<AssemblerDashboard />} />

            <Route path='/unauthorized' element={<Unauthorized />} />
            <Route path='/password' element={<ChangePassword />} />
            <Route path='*' element={<Error404 />} />
            <Route path='/error' element={<Error404 />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

