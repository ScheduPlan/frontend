import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { AuthProvider } from './AuthProvider';
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
import Event from './components/Event';
import FormPatchEvent from './forms/FormPatchEvent';

export default function App() {

  /*function redirect() {
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
  }*/

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

            <Route path='/administrator' >
              <Route path='' element={<Dashboard />} />

              <Route path='employees'>
                <Route path='' element={<ListItems items={Employee} path="/employees" h1="Alle Mitarbeiter" />} />
                <Route path='new' element={<FormCreateEmployee />} />
                <Route path=':id' element={<FormPatchEmployee />} />
              </Route>

              <Route path='teams'>
                <Route path='' element={<ListItems items={Team} path="/teams" h1="Alle Teams" />} />
                <Route path='new' element={<FormCreateTeam />} />
                <Route path=':id' element={<FormPatchTeam />} />
              </Route>
            </Route>

            <Route path='/manager'>
              <Route path='' element={<Dashboard />} />
              <Route path='schedule' element={<Schedule path="/orders" />} />

              <Route path='customers'>
                <Route path='' element={<ListItems items={Customer} path="/customers" h1="Alle Kunden" />} />
                <Route path='new' element={<FormCreateCustomer />} />
                <Route path=':id' element={<FormPatchCustomer />} />
              </Route>

              <Route path='orders'>
                <Route path='' element={<ListItems items={Order} path="/orders" h1="Alle Aufträge" />} />
                <Route path='new' element={<FormCreateOrder />} />
                <Route path=':id' element={<FormPatchOrder />} />
              </Route>

              <Route path='events'>
                <Route path='' element={<ListItems items={Event} path="/events" h1="Alle Termine" />} />
                <Route path=':id' element={<FormPatchEvent />} />
              </Route>
            </Route>

            <Route path='/fitter'>
              <Route path='' element={<Dashboard />} />
              <Route path='calendar' element={<AssemblerDashboard />} />
            </Route>

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

