import React from 'react'
import Calendar from '../components/Calendar'
import Header from '../components/Header'

export default function AssemblerDashboard() {
  return (
    <div>
        <Header title="Terminkalender"/>
        <Calendar />
    </div>
  )
}
