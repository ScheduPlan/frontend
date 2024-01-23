import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import url from '../BackendURL';
import roles from '../ROLES';

export default function FormCreateEmployee() {
    const navigate = useNavigate();

    const [teamList, setTeamList] = useState([]);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [employeeNumber, setEmployeeNumber] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState('');
    const [password, setPassword] = useState('');
    const [teamId, setTeamId] = useState("");

    useEffect(() => {
        getTeamList();
    }, []);

    /**
     * gets all teams from database
     */
    function getTeamList() {
        axios.get(url + '/teams').then(
            res => {
                setTeamList(res.data);
            }
        );
    }

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

    const getUserRole = (e) => {
        setUserRole(e.target.value.toUpperCase());
    }

    const getTeamId = (e) => {
        setTeamId(e.target.value);
    }

    const getUsername = (e) => {
        setUsername(e.target.value);
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
                    teamId: ((teamId != null) && (teamId != "")) ? teamId : null,
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
                position: 'top',
                icon: 'success',
                title: 'Neuer Mitarbeiter angelegt!',
                showConfirmButton: true,
                confirmButtonText: 'Ok',
                confirmButtonColor: 'var(--success)',
                timer: 2000
            }).then(() => {
                navigate("..", { relative: "path" })
            });
        } catch (error) {
            console.log(error.response.data.message);
            if (error.response.data.message.includes("EMPLOYEE_NUMBER")) {
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    title: 'Personalnummer ist bereits vergeben!',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'var(--error)',
                    timer: 2500
                });
            } else if (error.response.data.message.includes("USERNAME")) {
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    title: 'Benutzername ist bereits vergeben!',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'var(--error)',
                    timer: 2500
                });
            } else if (error.response.data.message.includes("EMAIL")) {
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    title: 'E-Mail-Adresse ist bereits vergeben!',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'var(--error)',
                    timer: 2500
                });
            }
        }
    }

    return (
        <div className='content-container'>
            <div className='topbar-header-wrapper'>
                <h1>Neuen Mitarbeiter anlegen</h1>
            </div>
            <form onSubmit={submitForm}>
                <div className='form-row'>
                    <label>
                        Vorname
                        <input className='light-blue' type="text" name="firstname" onChange={getFirstname} required />
                    </label>
                    <label>
                        Nachname
                        <input className='light-blue' type="text" name="lastname" onChange={getLastname} required />
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        Personalnummer
                        <input className='light-blue' type="number" name="employeeNumber" min={100000} max={999999} onChange={getEmployeeNumber} required />
                    </label>
                    <label>
                        E-Mail-Adresse
                        <input className='light-blue' type="email" name="email" onChange={getEmail} required />
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        Benutzername
                        <input className='light-blue' type="text" name="username" onChange={getUsername} required />
                    </label>
                    <label>
                        Passwort
                        <input className='light-blue' type="password" name="password" onChange={getPassword} required />
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        Benutzerrolle
                        <select className='light-blue' name="userRole" onChange={getUserRole} required>
                            <option value={null} readOnly hidden>Bitte wählen</option>
                            {roles.map((role, index) => {
                                return (<option key={index} value={role.role}>{role.title}</option>)
                            })}
                        </select>
                    </label>
                    {userRole == "FITTER" ?
                        <label>
                            Team
                            <select className='light-blue' name="team" onChange={getTeamId}>
                                <option value={""}>Bitte wählen</option>
                                {teamList.sort(function (a, b) {
                                    if (a.description.name < b.description.name) { return -1; }
                                    if (a.description.name > b.description.name) { return 1; }
                                    return 0;
                                }).map((team, index) => {
                                    return (<option key={index} value={team.id} required>{team.description.name}</option>)
                                })}
                            </select>
                        </label> : ""}
                </div>
                <div className='btn-wrapper'>
                    <input className="btn primary" type="submit" value="Anlegen" />
                    <input className="btn secondary" type="button" value="Abbrechen" onClick={() => { navigate("..", { relative: "path" }); }} />
                </div>
            </form>
        </div>
    )
}
