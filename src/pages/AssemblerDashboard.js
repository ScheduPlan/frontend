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
    getAllEvents();
  }, []);

  function getAllEvents() {
    axios.get(url + "/events").then(res => {
      setEvents(res.data.filter(event => event.order.team.id == user.teamId));
    });
    /*user.helpsOn.forEach(ev => axios.get(url + "/events/" + ev.id).then(res => {
      setEvents([...events, res.data]);
    })) */    
  }

  return (
    <div className='content-container'>
      <div className='topbar-header-wrapper'>
        <h1>Terminkalender</h1>
      </div>
      <CalendarComponent events={events} />
    </div>
  )
}
