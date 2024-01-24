import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import url from '../BackendURL';
import roles from '../ROLES';
import sortItems from '../utility/sortItems';

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
    const [teamId, setTeamId] = useState('');

    useEffect(() => {
        getTeamList();
    }, []);

    /**
     * gets all teams from API
     */
    function getTeamList() {
        axios.get(url + '/teams').then(
            res => {
                setTeamList(sortItems(res.data, "description", "name"));
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
                navigate("..", { relative: "path" });
            });
        } catch (error) {
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
                        Vorname <span>*</span>
                        <input  type="text" name="firstname" onChange={getFirstname} required />
                    </label>
                    <label>
                        Nachname <span>*</span>
                        <input  type="text" name="lastname" onChange={getLastname} required />
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        Personalnummer <span>*</span>
                        <input  type="number" name="employeeNumber" min={100000} max={999999} onChange={getEmployeeNumber} required />
                    </label>
                    <label>
                        E-Mail-Adresse <span>*</span>
                        <input  type="email" name="email" onChange={getEmail} required />
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        Benutzername <span>*</span>
                        <input  type="text" name="username" onChange={getUsername} required />
                    </label>
                    <label>
                        Passwort <span>*</span>
                        <input  type="password" name="password" onChange={getPassword} required />
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        Benutzerrolle <span>*</span>
                        <select  name="userRole" onChange={getUserRole} required>
                            <option value={''} readOnly hidden>Bitte wählen</option>
                            {roles.map((role, index) => {
                                return (<option key={index} value={role.role}>{role.title}</option>)
                            })}
                        </select>
                    </label>
                    {userRole == "FITTER" ?
                        <label>
                            Team
                            <select  name="team" onChange={getTeamId}>
                                <option value={''}>Bitte wählen</option>
                                {teamList.map((team, index) => {
                                    return (<option key={index} value={team.id} required>{team.description.name}</option>)
                                })}
                            </select>
                        </label> : ""}
                </div>
                <div className='btn-wrapper'>
                    <input className="btn primary" type="submit" value="Anlegen" />
                    <input className="btn secondary" type="button" value="Abbrechen" onClick={() => navigate("..", { relative: "path" })} />
                </div>
            </form>
        </div>
    )
}
