import AssemblerDashboard from './pages/AssemblerDashboard';
import Schedule from './pages/Schedule';
import axios from 'axios';
import url from './BackendURL';
import ListItems from './pages/ListItems';

const user = {
  is_loged_in: true,
  role: "",
  firstname: "Max",
  lastname: "Mustermann",
  email: "max@muster.de"
}

export const roles = [
  {
    role: "admin",
    links: [
      {
        path: "employees",
        title: "Mitarbeiter anzeigen",
        component: <ListItems items="employees" h1="Alle Mitarbeiter" />
      },
      {
        path: "teams",
        title: "Teams anzeigen",
        component: <ListItems items="teams" h1="Alle Teams" />
      }
    ]
  },
  {
    role: "manager",
    links: [
      {
        path: "schedule",
        title: "Planungsassistent",
        component: <Schedule />
      },
      {
        path: "orders",
        title: "Aufträge anzeigen",
        component: <ListItems items="orders" h1="Alle Aufträge" />
      },
      {
        path: "customers",
        title: "Kunden anzeigen",
        component: <ListItems items="customers" h1="Alle Kunden" />
      }
    ]
  },
  {
    role: "assembler",
    links: [
      {
        path: "calendar",
        title: "Terminkalender",
        component: <AssemblerDashboard />
      }
    ]
  }
]

export const testEmployees = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    firstName: "Mitarbeiter1",
    lastName: "Test",
    employeeNumber: 1234,
    //position: "Monteur", Wofür?
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afb7",
    firstName: "Mitarbeiter2",
    lastName: "Test",
    employeeNumber: 1235,
    //position: "Monteur", Wofür?
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa8",
    firstName: "Mitarbeiter3",
    lastName: "Test",
    employeeNumber: 1236,
    //position: "Monteur", Wofür?
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afb8",
    firstName: "Mitarbeiter4",
    lastName: "Test",
    employeeNumber: 1237,
    //position: "Monteur", Wofür?
  }
]

export default user;