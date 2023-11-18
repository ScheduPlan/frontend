import React, { useState } from 'react'
import Swal from 'sweetalert2';

export default function FormCreateEmployee() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const getFirstname = (e) => {
        setFirstname(e.target.value);
        console.log(firstname);
    }

    const getLastname = (e) => {
        setLastname(e.target.value);
        console.log(lastname);
    }

    const getEmail = (e) => {
        setEmail(e.target.value);
        console.log(email);
    }

    const getPassword = (e) => {
        setPassword(e.target.value);
        console.log(password); //Verschlüsseln?
    }

    function submitForm() {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Neuer Mitarbeiter angelegt!',
            showConfirmButton: false,
            timer: 5000
        })
    }

    return (
        <div className='content-container'>
            <h2>Neuen Mitarbeiter anlegen</h2>
            <form onSubmit={submitForm}>
                <div className='form-row'>
                    <label>
                        Vorname
                        <input className='light-blue' type="text" name="firstname" onChange={getFirstname} />
                    </label>
                    <label>
                        Nachname
                        <input className='light-blue' type="text" name="lastname" onChange={getLastname} />
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        E-Mail-Adresse
                        <input className='light-blue' type="email" name="email" onChange={getEmail} />
                    </label>
                    <label>
                        Passwort
                        <input className='light-blue' type="password" name="password" onChange={getPassword} />
                    </label>
                </div>
                <input className="btn primary" type="submit" value="Anlegen" />
                <input onClick={submitForm} className="btn primary" type="button" value="AnlegenTest" />
            </form>
        </div>
    )
}
