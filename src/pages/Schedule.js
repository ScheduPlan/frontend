import React, { useEffect, useState } from 'react'
import Calendar from '../components/ScheduleCalendar'
import Sidebar from '../components/Sidebar'
import axios from 'axios'
import url from '../BackendURL'
import style from './Schedule.module.css'
import sortItems from '../utility/sortItems'

export default function Schedule(props) {
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);

  const [activeOrder, setActiveOrder] = useState({});
  const [showAllOrders, setShowAllOrders] = useState(false);

  const [activeTeamId, setActiveTeamId] = useState("");
  const [activeEvents, setActiveEvents] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);

  useEffect(() => {
    getAllTeams();
    getAllEvents();
    getAllOrders();
  }, []);

  useEffect(() => {
    getActiveEvents();
  }, [events, activeTeamId]);

  useEffect(() => {
    getActiveOrders();
  }, [orders, activeTeamId]);

  useEffect(() => {
    setCalendar();
    setSidebar();
  }, [activeEvents, activeOrders, activeTeamId]);

  /**
   * gets all teams from API, sorts them & sets the setActiveTeamId as the first element
   */
  function getAllTeams() {
    axios.get(url + "/teams").then(res => {
      const t = sortItems(res.data, "description", "name");
      setTeams(t);
      setActiveTeamId(t.at(0).id);
    });
  }

  /**
   * gets all events from API
   */
  function getAllEvents() {
    axios.get(url + "/events").then(res => {
      setEvents(res.data);
    });
  }

  /**
   * gets all orders from API
   */
  function getAllOrders() {
    axios.get(url + "/orders").then(res => {
      setOrders(sortItems(res.data.filter(order => order.state == "PLANNED"), "commissionNumber"));
    });
  }

  /**
   * filters all events for currently active team
   */
  function getActiveEvents() {
    setActiveEvents(events.filter(event => (event.order?.team?.id == activeTeamId)));
  }

  /**
   * filters all events for currently active team
   */
  function getActiveOrders() {
    showAllOrders ?
    setActiveOrders(orders)
    : setActiveOrders(orders.filter(order => (order.team?.id == activeTeamId)))
  }

  /**
   * HELP!!! --> works?!
   * @returns 
   */
  function setCalendar() {
    return (
      teams.map(team => {
        return (
          <div key={team.id} id={"team " + team.id} className={style.tab_container}>
            <Calendar events={activeEvents} getAllEvents={() => getAllEvents()} getOrders={getAllOrders} activeOrder={activeOrder} allOrdersDisplayed={showAllOrders} />
          </div>
        )
      })
    )
  }

  /**
   * rerenders sidebar
   */
  function setSidebar() {
    return (
      <Sidebar path={props.path} activeTeamId={activeTeamId} orders={activeOrders} getOrders={getAllOrders} activeOrder={(e) => setActiveOrder(e)} allOrdersDisplayed={showAllOrders} setAllOrdersDisplayed={(e) => setShowAllOrders(e)} />
    );
  }

  return (
    <>
      <div className='topbar-header-wrapper'>
        <h1>Planungsassistent</h1>
      </div>
      <div className='content-wrapper'>
        {setSidebar()}
        <div className={style.calendar_wrapper}>
          <div className={style.tab_bar}>
            {teams.map(team => {
              return (
                <button key={team.id}
                  className={"btn tab " + (((activeTeamId == team.id) && !showAllOrders) ? "active" : "")}
                  id={team.id}
                  onClick={() => {
                    setActiveTeamId(team.id);
                    setShowAllOrders(false)
                  }}>
                  {team.description.name}
                </button>
              )
            })}
          </div>
          <>
            {setCalendar()}
          </>
        </div>
      </div>
    </>
  )
}
