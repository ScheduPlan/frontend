import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import url from '../BackendURL';
import roles from '../ROLES';
import deleteItem from '../utility/deleteItem';

export default function FormPatchEmployee() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [employee, setEmployee] = useState({});

    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [employeeNumber, setEmployeeNumber] = useState();
    const [email, setEmail] = useState();
    const [username, setUsername] = useState();
    const [userRole, setUserRole] = useState();

    useEffect(() => {
        axios.get(url + '/employees/' + id)
        .then(res => {
            const data = res.data;
            setEmployee(data);
            console.log(data);
        });
        console.log(employee);
        console.log(employee.user);
    }, [id]);

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
                    employeeNumber: (employeeNumber != null) ? employeeNumber : employee.employeeNumber,
                    person: {
                        firstName: (firstName != null) ? firstName : employee.firstName,
                        lastName: (lastName != null) ? lastName : employee.lastName
                    },
                    userDefinition: {
                        email: (email != null) ? email : employee.user.email,
                        username: (username != null) ? username : employee.user.username,
                        role: (userRole != null) ? userRole : employee.user.role
                    }
                },
                { headers: { 'Content-Type': 'application/json' } });

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Geänderte Daten gespeichert!',
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
            <h1>Mitarbeiter bearbeiten</h1>
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
                        <input placeholder={employee.employeeNumber} className='light-blue' type="number" name="employeeNumber" onChange={getEmployeeNumber} />
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
                        <select className='light-blue' name="userRole" onChange={getUserRole} required>
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
                <input className="btn primary" type="submit" value="Speichern" />
                <input className="btn secondary" type="button" value="Löschen" onClick={() => {deleteItem("/employees/" + employee.id)}} />
                <input className="btn secondary" type="button" value="Zurück" onClick={() => {navigate("..", { relative: "path" });}} />
            </form>
        </div>
    )
}
