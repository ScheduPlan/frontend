import React, {useState, useEffect} from 'react';
import CalendarComponent from '../components/SimpleCalendar';

export default function AssemblerDashboard() {
  const [appointments, setAppointments] = useState([]);

  const appoint = [
    {
      start: new Date(2023, 11, 23, 8, 0),
      end: new Date(2023, 11, 23, 13, 0),
      category: "Montage"
    },
    {
      start: new Date(2023, 10, 2, 9, 0),
      end: new Date(2023, 10, 2, 10, 30),
      category: "Reklamation"
    }
  ]

  //get all appointments
  useEffect(() => {
    let appointments = [];
    appoint.forEach((appointment) => {
        let elem = {
            title: appointment.category,
            start: new Date(appointment.start),
            end: new Date(appointment.end),
            appointment: appointment.category,
        };
        appointments = [...appointments, elem];
    });
    setAppointments(appointments);

    //get all events
    /*axios.get(url + "/events")
            .then(response => {
                const itemData = response.data;
                setOrders(itemData);
                console.log("Orders", itemData);
            });*/

}, [appointments]);

  return (
    <div>
      <CalendarComponent appointments={appoint} />
    </div>
  )
}
