import React, { useEffect, useState } from 'react'
import Calendar from '../components/ScheduleCalendar'
import Sidebar from '../components/Sidebar'
import axios from 'axios'
import url from '../BackendURL'
import style from './Schedule.module.css'
import { testTeams } from '../UserExample'

export default function Schedule() {
  const testAppointments = [
    {
      id: 1,
      start: new Date(2023, 11, 18, 8, 0),
      end: new Date(2023, 11, 18, 13, 0),
      category: "Montage"
    },
    {
      id: 2,
      start: new Date(2023, 12, 20, 9, 0),
      end: new Date(2023, 12, 20, 10, 30),
      category: "Reklamation"
    }
  ]

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getTeams();
  }, []);

  function getTeams() {
    axios.get(url + "/teams").then(res => {
      setTeams(
        res.data.sort(function (a, b) {
          if (a.description.name < b.description.name) { return -1; }
          if (a.description.name > b.description.name) { return 1; }
          return 0;
        })
      );
    });
  }

  /**
   * opens team tab with specific calendar
   * @param {*} e 
   */
  function openTab(e) {
    console.log(e.target);
    var i;
    var x = document.getElementsByClassName(style.tab_container);
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById("team" + e.target.id).style.display = "block";

    var y = document.getElementsByClassName("btn tab");
    for (i = 0; i < y.length; i++) {
      y[i].classList.remove("active");
    }
    document.getElementById(e.target.id).classList.add("active");
  }

  return (
    <>
      <div className='content-container'>
        <h1>Planungsassistent</h1>
      </div>
      <div className='content-wrapper'>
        <Sidebar />

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
              <div key={team.id} id={"team" + team.id} className={style.tab_container}>
                <Calendar appointments={testAppointments} />
              </div>)
          })}
        </div>
      </div>
    </>
  )
}
