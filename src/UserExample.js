import CreatePerson from './pages/CreatePerson';
import CreateAppointment from './pages/CreateAppointment';
import Schedule from './pages/Schedule';
import axios from 'axios';
import url from './BackendURL';

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
        path: "newPerson",
        title: "Mitarbeiter anlegen",
        component: <CreatePerson />
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
        path: "appointment",
        title: "Termine anlegen",
        component: <CreateAppointment />
      },
      {
        path: "newCustomer",
        title: "Kunde anlegen",
        component: <CreatePerson />
      }
    ]
  },
  {
    role: "assembler"
  }
]

export function initiate() {
  createTeams();
  //createCustomers();
}

function createTeams() {
  const teams = [
    "Süd 1",
    "Süd 2",
    "West 1",
    "Ost 1",
    "Nord 1",
    "Nord 2",
    "Berlin"
  ]

  teams.map((team) => {
    try {
      axios.post(url + '/teams',
        { name: team, description: "" },
        { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      alert("createTeams", error);
    }
  })
}

function createCustomers() {

  const customers = [
    {
      firstname: "Kunde1",
      lastname: "Testkunde",
      company: "Testfirma",
      addresses: [
        createAddresses
      ]
    }, 
    {
      firstname: "Kunde2",
      lastname: "Testkunde2",
      description: "Hier könnte was stehen",
    },
    {
      company: "Testfirma 3",
      description: "Hier könnte noch was stehen",
    }
  ]

  customers.map((customer) => {
    try {
      axios.post(url + '/teams',
        {
          firstname: customer.firstname,
          lastname: customer.lastname,
          company: customer.company,
          description: customer.description
        },
        { headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      alert("createCustomers", error);
    }
  })
}

function createAddresses() {
  const addresses = [
    {
      country: "Land",
      street: "Straße",
      streetNumber: 123,
      city: "Stadt",
      zip: "012345",
      description: "string",
      addressSuffix: "Zusatzinfo",
      addressType: "DELIVERY"
    },
    {
      country: "Land1",
      street: "Straße1",
      streetNumber: 123,
      city: "Stadt",
      zip: "012345",
      description: "string1",
      addressSuffix: "Zusatzinfo1",
      addressType: "DELIVERY"
    }
  ]

  return addresses;
}

export default user;