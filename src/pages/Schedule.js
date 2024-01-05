import React, { useEffect, useState } from 'react'
import Calendar from '../components/ScheduleCalendar'
import Sidebar from '../components/Sidebar'
import axios from 'axios'
import url from '../BackendURL'
import style from './Schedule.module.css'
import sortItems from '../utility/sortItems'

export default function Schedule() {
  const [teams, setTeams] = useState([]);
  const [orders, setOrders] = useState([]);

  const [activeOrder, setActiveOrder] = useState({});

  const [activeTeamId, setActiveTeamId] = useState("");

  useEffect(() => {
    getTeams();
    getOrders();
  }, []);

  function getTeams() {
    axios.get(url + "/teams").then(res => {
      setTeams(sortItems(res.data, "description", "name"));
    });
  }

  function getOrders() {
    axios.get(url + "/orders").then(res => {
      setOrders(res.data);
    });
  }

  /**
   * opens team tab with specific calendar & sets the current team id
   * @param {*} e 
   */
  function openTab(e) {
    var i;
    var x = document.getElementsByClassName(style.tab_container);
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById("team " + e.target.id).style.display = "block";

    var y = document.getElementsByClassName("btn tab");
    for (i = 0; i < y.length; i++) {
      y[i].classList.remove("active");
    }
    document.getElementById(e.target.id).classList.add("active");

    setActiveTeamId(e.target.id);
  }

  return (
    <>
      <div className='content-container'>
        <h1>Planungsassistent</h1>
      </div>
      <div className='content-wrapper'>
        <Sidebar activeTeamId={activeTeamId} activeOrder={(e) => setActiveOrder(e)}/>

        <div className={style.calendar_wrapper}>
          <div className={style.tab_bar}>
            {teams.map(team => {
              return (
                <button key={team.id} className="btn tab" id={team.id} onClick={openTab}>{team.description.name}</button>
              )
            })}
          </div>

          {teams.map(team => {
            return (
              <div key={team.id} id={"team " + team.id} className={style.tab_container}>
                <Calendar activeOrder={activeOrder} />
              </div>)
          })}
        </div>
      </div>
    </>
  )
}
