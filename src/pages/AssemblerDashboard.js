import React from 'react'
import Calendar from '../components/Calendar'

export default function AssemblerDashboard() {
  const appoint = [
    {
      start: new Date(2023, 10, 5, 8, 0),
      end: new Date(2023, 10, 5, 13, 0),
      category: "Montage"
    },
    {
      start: new Date(2023, 10, 2, 9, 0),
      end: new Date(2023, 10, 2, 10, 30),
      category: "Reklamation"
    }
  ]

  return (
    <div>
      <Calendar appointments={appoint} />
    </div>
  )
}
