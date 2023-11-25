import React from 'react'
import Calendar from '../components/Calendar'
import Sidebar from '../components/Sidebar'
import axios from 'axios'
import url from '../BackendURL'

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

  return (
    <>
      <div className='content-container'>
        <h1>Planungsassistent</h1>
      </div>
      <div className='content-wrapper'>
        <Sidebar />
        <Calendar appointments={testAppointments} />
      </div>
    </>
  )
}
