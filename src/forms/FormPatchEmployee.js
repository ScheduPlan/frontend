import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import url from '../BackendURL';
import roles from '../ROLES';
import deleteItem from '../utility/deleteItem';
import sortItems from '../utility/sortItems';

export default function FormPatchEmployee() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [employee, setEmployee] = useState({});
    const [teamList, setTeamList] = useState([]);

    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [employeeNumber, setEmployeeNumber] = useState();
    const [email, setEmail] = useState();
    const [username, setUsername] = useState();
    const [userRole, setUserRole] = useState();
    const [teamId, setTeamId] = useState();

    useEffect(() => {
        axios.get(url + '/employees/' + id)
            .then(res => {
                setEmployee(res.data);
                setUserRole(res.data.user?.role);
            });
        getTeamList();
    }, [id]);

    /**
     * gets all teams from API & sorts them
     */
    function getTeamList() {
        axios.get(url + '/teams').then(
            res => {
                setTeamList(sortItems(res.data, "description", "name"));
            }
        );
    }

    const getFirstName = (e) => {
        setFirstName(e.target.value);
    }

    const getLastName = (e) => {
        setLastName(e.target.value);
    }

    const getEmployeeNumber = (e) => {
        setEmployeeNumber(e.target.value);
    }

    const getEmail = (e) => {
        setEmail(e.target.value);
    }

    const getTeamId = (e) => {
        setTeamId(e.target.value);
    }

    const getUsername = (e) => {
        setUsername(e.target.value);
    }

    const getUserRole = (e) => {
        setUserRole(e.target.value.toUpperCase());
    }

    /**
     * set new values for an employee
     * @param {*} event 
     */
    async function submitForm(event) {
        event.preventDefault();
        try {
            const response = await axios.patch(url + '/employees/' + id,
                {
                    employeeNumber: employeeNumber,
                    teamId: teamId,
                    person: {
                        firstName: firstName,
                        lastName: lastName
                    },
                    user: {
                        email: email,
                        username: username,
                        role: userRole
                    }
                },
                { headers: { 'Content-Type': 'application/json' } });


            Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'Änderungen wurden gespeichert!',
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
                <h1>Mitarbeiter bearbeiten</h1>
            </div>
            <form onSubmit={submitForm}>
                <div className='form-row'>
                    <label>
                        Vorname
                        <input placeholder={employee.firstName} className='light-blue' type="text" name="firstName" onChange={getFirstName} />
                    </label>
                    <label>
                        Nachname
                        <input placeholder={employee.lastName} className='light-blue' type="text" name="lastName" onChange={getLastName} />
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        Personalnummer
                        <input placeholder={employee.employeeNumber} className='light-blue' type="number" name="employeeNumber" min={100000} max={999999} onChange={getEmployeeNumber} />
                    </label>
                    <label>
                        E-Mail-Adresse
                        <input placeholder={employee.user?.email} className='light-blue' type="email" name="email" onChange={getEmail} />
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        Benutzername
                        <input placeholder={employee.user?.username} className='light-blue' type="text" name="username" onChange={getUsername} />
                    </label>
                    <label>
                        Benutzerrolle
                        <select className='light-blue' name="userRole" onChange={getUserRole} >
                            <option readOnly hidden>
                                {employee.user != null ?
                                    roles.find(role => role.role == employee.user.role.toLowerCase()).title :
                                    "Bitte wählen"}
                            </option>
                            {roles.map((role, index) => {
                                return (<option key={index} value={role.role}>{role.title}</option>)
                            })}
                        </select>
                    </label>
                </div>
                <div className='form-row'>
                    {userRole == "FITTER" ?
                        <label>
                            Team
                            <select className='light-blue' name="team" onChange={getTeamId} >
                                <option readOnly hidden>
                                    {employee.team != null ?
                                        employee.team?.description?.name :
                                        "Bitte wählen"}
                                </option>
                                {teamList.map((team, index) => {
                                    return (<option key={index} value={team.id}>{team.description.name}</option>)
                                })}
                            </select>
                        </label> : ""}
                </div>
                <div className='btn-wrapper'>
                    <input className="btn primary" type="submit" value="Speichern" />
                    <input className="btn red" type="button" value="Löschen" onClick={() => { deleteItem("/employees/" + employee.id) }} />
                    <input className="btn secondary" type="button" value="Abbrechen" onClick={() => { navigate("..", { relative: "path" }); }} />
                </div>
            </form>
        </div>
    )
}
