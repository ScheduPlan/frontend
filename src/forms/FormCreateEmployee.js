import React, { useState } from 'react'
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import url from '../BackendURL';
import roles from '../ROLES';

export default function FormCreateEmployee() {
    const navigate = useNavigate();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('');
    const [password, setPassword] = useState('');

    const getFirstname = (e) => {
        setFirstname(e.target.value);
    }

    const getLastname = (e) => {
        setLastname(e.target.value);
    }

    const getEmployeeNumber = (e) => {
        setEmployeeNumber(e.target.value);
    }

    const getEmail = (e) => {
        setEmail(e.target.value);
    }

    const getUsername = (e) => {
        setUsername(e.target.value);
    }

    const getUserRole = (e) => {
        setUserRole(e.target.value.toUpperCase());
    }

    const getPassword = (e) => {
        setPassword(e.target.value);//Verschlüsseln?
    }

    /**
     * creates a new employee
     * @param {*} event 
     */
    async function submitForm(event) {
        event.preventDefault();
        try {
            const response = await axios.post(url + '/auth/create',
                {
                    employeeNumber: employeeNumber,
                    person: {
                        firstName: firstname,
                        lastName: lastname
                    },
                    userDefinition: {
                        email: email,
                        username: username,
                        password: password,
                        role: userRole
                    }
                },
                { headers: { 'Content-Type': 'application/json' } });

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Neuer Mitarbeiter angelegt!',
                showConfirmButton: false,
                timer: 2000
            });

            setTimeout(function () {
                navigate("..", { relative: "path" });
            }, 2500);

        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className='content-container'>
            <h1>Neuen Mitarbeiter anlegen</h1>
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
                        Personalnummer
                        <input className='light-blue' type="number" name="employeeNumber" onChange={getEmployeeNumber} />
                    </label>
                    <label>
                        E-Mail-Adresse
                        <input className='light-blue' type="email" name="email" onChange={getEmail} />
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        Benutzername
                        <input className='light-blue' type="text" name="username" onChange={getUsername} />
                    </label>
                    <label>
                        Benutzerrolle
                        <select className='light-blue' name="userRole" onChange={getUserRole} required>
                            <option readOnly hidden>Bitte wählen</option>
                            {roles.map((role, index) => {
                                return (<option key={index} value={role.role}>{role.title}</option>)
                            })}
                        </select>
                    </label>
                </div>
                <label>
                    Passwort
                    <input className='light-blue' type="password" name="password" onChange={getPassword} />
                </label>
                <input className="btn primary" type="submit" value="Anlegen" />
            </form>
        </div>
    )
}
