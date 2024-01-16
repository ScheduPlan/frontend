import React, { useState, useEffect, useContext } from 'react';
import CalendarComponent from '../components/SimpleCalendar';
import AuthContext from '../AuthProvider';
import axios from 'axios';
import url from '../BackendURL';

export default function AssemblerDashboard() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);

  //get all appointments
  useEffect(() => {
    axios.get(url + "/events").then(res => {
      setEvents(res.data.filter(events => events.order.team.id == user.team?.id));
    });
  }, []);

  return (
    <div className='content-container'>
      <h1>Terminkalender</h1>
      <CalendarComponent events={events} />
    </div>
  )
}
