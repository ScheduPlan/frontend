import React, { useEffect, useState } from 'react'
import Calendar from '../components/ScheduleCalendar'
import Sidebar from '../components/Sidebar'
import axios from 'axios'
import url from '../BackendURL'
import style from './Schedule.module.css'
import sortItems from '../utility/sortItems'

export default function Schedule() {
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);

  const [activeOrder, setActiveOrder] = useState({});

  const [activeTeamId, setActiveTeamId] = useState("");
  const [activeEvents, setActiveEvents] = useState([]);

  useEffect(() => {
    getTeams();
    getEvents();
    getOrders();
  }, []);

  useEffect(() => {
    getActiveEvents();
  }, [activeTeamId]);

  /**
   * gets all teams from API, sorts them & sets the setActiveTeamId as the first element
   */
  function getTeams() {
    axios.get(url + "/teams").then(res => {
      const t = sortItems(res.data, "description", "name");
      setTeams(t);
      setActiveTeamId(t.at(0).id);
    });
  }

  /**
   * gets all events from API
   */
  function getEvents() {
    axios.get(url + "/events").then(res => {
      setEvents(res.data);
    });
  }

  function getOrders() {
    axios.get(url + "/orders").then(res => {
      setOrders(res.data);
    });
  }

  /**
   * filters all events for currently active team
   */
  function getActiveEvents() {
    setActiveEvents(events.filter(event => (event.order?.team?.id == activeTeamId)));
  }

  return (
    <>
      <div className='content-container'>
        <h1>Planungsassistent</h1>
      </div>
      <div className='content-wrapper'>
        <Sidebar activeTeamId={activeTeamId} activeOrder={(e) => setActiveOrder(e)} />

        <div className={style.calendar_wrapper}>
          <div className={style.tab_bar}>
            {teams.map(team => {
              return (
                <button key={team.id} className={"btn tab " + ((activeTeamId == team.id) ? "active" : "")} id={team.id} onClick={() => setActiveTeamId(team.id)}>{team.description.name}</button>
              )
            })}
          </div>

          {teams.map(team => {
            return (
              <div key={team.id} id={"team " + team.id} className={style.tab_container}>
                <Calendar events={activeEvents} activeOrder={activeOrder} />
              </div>)
          })}
        </div>
      </div>
    </>
  )
}
