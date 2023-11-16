import CreatePerson from './pages/CreatePerson';
import CreateAppointment from './pages/CreateAppointment';
import Schedule from './pages/Schedule';

const user = {
    is_loged_in: true,
    role: "manager",
    firstname: "Max",
    lastname: "Mustermann",
    email: "max@muster.de"
}

export const roles = [
  {
    role: "admin",
    links: [
      {
        path: "admin/newPerson",
        title: "Mitarbeiter anlegen",
        component: <CreatePerson />
      }
    ]
  },
  {
    role: "manager",
    links: [
      {
        path: "/manager/schedule",
        title: "Planungsassistent",
        component: <Schedule />
      },
      {
        path: "/manager/appointment",
        title: "Termine anlegen",
        component: <CreateAppointment />
      }
    ]
  },
  {
    role: "assembler"
  }
]

export default user;