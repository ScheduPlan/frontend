import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import url from '../BackendURL';
import logout from '../utility/logout';
import AuthContext from '../AuthProvider';

export default function ChangePassword() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [password, setPassword] = useState();
  const [password2, setPassword2] = useState();

  const getPassword = (e) => {
    setPassword(e.target.value);
  }

  const getPassword2 = (e) => {
    setPassword2(e.target.value);
  }

  async function submitForm(event) {
    event.preventDefault();
    if (password === password2) {
      try {
        await axios.post(url + '/auth/reset',
          {
            password: password
          },
          { headers: { 'Content-Type': 'application/json' } });

        Swal.fire({
          position: 'top',
          icon: 'info',
          title: 'Passwort geändert!',
          text: 'Sie werden automatisch abgemeldet. Bitte, melden Sie sich mit Ihrem neuen Passwort an.',
          showConfirmButton: false,
          timer: 3000
        });

        setTimeout(function () {
          logout();
        }, 3500);

      } catch (error) {
        alert(error);
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Passwörter stimmen nicht überein!',
        showConfirmButton: false,
        timer: 3000
      });
    }
  }

  return (
    <div className='content-container'>
      <h1>Passwort ändern</h1>
      <form onSubmit={submitForm}>
        <label>
          E-Mail-Adresse:
          <input className='light-blue' type="email" name="email" value={user.user?.email} readOnly />
        </label>
        <div className='form-row'>
          <label>
            neues Passwort:
            <input className='light-blue' type="password" name="password" onChange={getPassword} required />
          </label>
          <label>
            neues Passwort bestätigen:
            <input className='light-blue' type="password" name="password" onChange={getPassword2} required />
          </label>
        </div>
        <div className='btn-wrapper'>
          <input className="btn primary" type="submit" value="Senden" />
          <input className="btn secondary" type="button" value="Abbrechen" onClick={() => { navigate("..", { relative: "path" }); }} />
        </div>
      </form>
    </div>
  )
}
