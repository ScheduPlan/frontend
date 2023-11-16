import React, { useState } from 'react';
import user from '../UserExample';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';

export default function ChangePassword() {
  const [password, setPassword] = useState('');

  const getPassword = (e) => {
    setPassword(e.target.value);
    console.log(password); //Verschlüsseln?
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function submitForm() { //To Do: User danach abmelden -> muss sich mit neuem Passwort anmelden
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Passwort geändert!',
        text: 'Bitte, melden Sie sich erneut an.',
        showConfirmButton: false,
        timer: 3000
    });
    //await sleep(3000);
}

  return (
    <div className='content-container'>
      <form onSubmit={submitForm}>
        <label>
          E-Mail-Adresse:
          <input className='light-blue' type="email" name="email" value={user.email} readOnly />
        </label>
        <div className='form-row'>
          <label>
            Passwort:
            <input className='light-blue' type="password" name="password" onChange={getPassword} />
          </label>
          <label>
            Passwort bestätigen:
            <input className='light-blue' type="password" name="password" onChange={getPassword} />
          </label>
        </div>
        <input className="btn primary" type="submit" value="Neues Passwort setzen" />
        <input onClick={submitForm} className="btn primary" type="button" value="Neues Passwort Test" />
      </form>
    </div>
  )
}
