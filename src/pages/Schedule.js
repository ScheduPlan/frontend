import React, { useEffect, useState } from 'react'
import Calendar from '../components/Calendar'
import Sidebar from '../components/Sidebar'
import axios from 'axios'
import url from '../BackendURL'
import { testTeams } from '../UserExample'

export default function Schedule() {
  const testAppointments = [
    {
      start: new Date(2023, 10, 17, 8, 0),
      end: new Date(2023, 10, 17, 13, 0),
      category: "Montage"
    },
    {
      start: new Date(2023, 10, 2, 9, 0),
      end: new Date(2023, 10, 2, 10, 30),
      category: "Reklamation"
    }
  ]

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getTeams();
  }, []);

  function getTeams() {
    setTeams(testTeams);
  }

  function openCity(e) {
    console.log(e.target.id);
    var i;
    var x = document.getElementsByClassName("tab-container");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById("team" + e.target.id).style.display = "block";
  }

  return (
    <>
      <div className='content-container'>
        <h1>Planungsassistent</h1>
      </div>
      <div className='content-wrapper'>
        <Sidebar />

        <div className='calendar-wrapper'>
          <div className="tab-bar">
            {teams.map(team => {
              return (
                <button key={team.id} className="btn tab-btn" id={team.id} onClick={openCity}>{team.name}</button>
              )
            })}
          </div>

          {teams.map(team => {
            return (
              <div key={team.id} id={"team" + team.id} className="tab-container">
                <Calendar appointments={testAppointments} />
              </div>)
          })}
        </div>
      </div>
    </>
  )
}
