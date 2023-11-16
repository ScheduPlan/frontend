import React from 'react';
import Swal from 'sweetalert2';

export default function CreateAppointment() {

  function submitForm() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Neuer Termin angelegt!',
      showConfirmButton: false,
      timer: 5000
    })
  }

  return ( //Auftrag(per Auftragsnummer), Zeitspanne, Art, Montageteam, Aushilfe/n, freigegebener Termin
    <div className='content-container'>
      <form onSubmit={submitForm}>
        <div className='form-row'>
          <label>
            Auftrag:
            <input className='light-blue' type="text" name="order" required />
          </label>
          <label>
            Zeitspanne:
            <input className='light-blue' type="text" name="period" required />
          </label>
        </div>
        <div className='form-row'>
          <label>
            Terminart:
            <select className='light-blue' name="type" required>
              <option disabled selected hidden>Bitte auswählen</option>
              <option>Montage</option>
              <option>Reklamation</option>
              <option>Lieferung</option>
            </select>
          </label>
          <label>
            freigegebener Termin:
            <input className='light-blue' type="date" name="date" required />
          </label>
        </div>
        <div className='form-row'>
          <label>
            Montageteam:
            <select className='light-blue' name="team" required >
              <option disabled selected hidden>Bitte auswählen</option>
              <option>Süd 1</option>
              <option>Süd 2</option>
              <option>Nord 1</option>
              <option>Nord 2</option>
            </select>
          </label>
          <label>
            Aushilfe:
            <input className='light-blue' type="text" name="helper" required />
          </label>
        </div>
        <input className="btn primary" type="submit" value="Anlegen" />
        <input onClick={submitForm} className="btn primary" type="button" value="AnlegenTest" />
      </form>
    </div>
  )
}
