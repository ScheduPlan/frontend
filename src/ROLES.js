import ListItems from './pages/ListItems';
import Schedule from './pages/Schedule';
import AssemblerDashboard from './pages/AssemblerDashboard';

const roles = [
    {
        role: "administrator",
        title: "Admin",
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
        title: "Manager",
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
        role: "fitter",
        title: "Monteur",
        links: [
            {
                path: "calendar",
                title: "Terminkalender",
                component: <AssemblerDashboard />
            }
        ]
    }
];

export default roles;