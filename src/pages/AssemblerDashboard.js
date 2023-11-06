import React from 'react'
import Calendar from '../components/Calendar'
import Header from '../components/Header'
import Swal from 'sweetalert2';


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

  function clickEvent() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500
    })
  }

  return (
    <div>
      <Header title="Termin&shy;kalender" />
      <Calendar appointments={appoint} />
    </div>
  )
}
