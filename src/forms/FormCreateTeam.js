import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import url from '../BackendURL';
import { useNavigate } from 'react-router-dom';
import { testEmployees } from '../UserExample';
import Path from '../icons/Paths';

export default function FormCreateTeam() {

    const navigate = useNavigate();

    const [teamName, setTeamName] = useState("");
    const [teamDesc, setTeamDesc] = useState("");

    const [allEmployees, setAllEmployees] = useState(testEmployees);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [pickedEmployees, setPickedEmployees] = useState([]);

    useEffect(() => {
        //getAllEmployees();
    }, []);

    useEffect(() => {
        updateAvailableEmployees();
    }, [pickedEmployees]);

    /**
     * gets all employees from database
     */
    function getAllEmployees() {
        axios.get(url + 'employees')
            .then(response => {
                const itemData = response.data;
                setAllEmployees(itemData);
                console.log("Employees", itemData);
            });
    }

    /**
     * filters the available employees that there are nor picked ones
     */
    function updateAvailableEmployees() {
        setAvailableEmployees(
            allEmployees.filter(obj =>
                !pickedEmployees.some(pickedObj => pickedObj.id === obj.id))
        )
    }

    const getTeamName = (e) => {
        setTeamName(e.target.value);
    }

    const getTeamDesc = (e) => {
        setTeamDesc(e.target.value);
    }


    /**
     * gets the selected employee and adds it to the picked employees
     * @param {*} e 
     */
    const getPickedEmployees = (e) => {
        const selectedOption = {
            id: e.target.selectedOptions[0].id,
            value: e.target.value
        };
        setPickedEmployees((prevEmployees) => [...prevEmployees, selectedOption]);
    }

    /**
     * removes the employee from the picked list & adds the removed employee back to the select options
     * @param {*} e 
     */
    function removeEmployee(e) {
        const selectedOption = pickedEmployees.find(elem => elem.id === e.target.id);
        setPickedEmployees(pickedEmployees.filter(obj => obj != selectedOption));
        updateAvailableEmployees();
    }

    async function submitForm(event) {
        event.preventDefault();
        try {
            const response = await axios.post(url + '/teams',
                {
                    name: teamName,
                    description: teamDesc,
                    employees: pickedEmployees
                },
                { headers: { 'Content-Type': 'application/json' } });

            console.log("res data", response.data);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Neues Team angelegt!',
                showConfirmButton: false,
                timer: 2000
            });

            setTimeout(function () {
                navigate("..", { relative: "path" });
            }, 2500);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='content-container'>
            <h1>Neues Team anlegen</h1>
            <form onSubmit={submitForm}>
                <div className='form-row'>
                    <label>
                        Name des Teams
                        <input className='light-blue' type="text" name="team" onChange={getTeamName} required />
                    </label>
                    <label>
                        Beschreibung
                        <input className='light-blue' type="text" name="description" onChange={getTeamDesc} />
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        Mitarbeiter
                        <select className='light-blue' name="customer" onChange={getPickedEmployees} required>
                            <option readOnly hidden>Bitte wählen</option>
                            {availableEmployees
                                .map((emp) => {
                                    return (
                                        <option onClick={updateAvailableEmployees} key={emp.id} id={emp.id} value={emp.firstName + " " + emp.lastName}>{emp.firstName} {emp.lastName}</option>
                                    )
                                })}
                        </select>
                    </label>
                    <div className='pickedItem-wrapper'>
                        {(pickedEmployees != [] ?
                            pickedEmployees.map((emp) => {
                                return (
                                    <div key={emp.id} className='pickedItem'>
                                        <p>{emp.value}</p>
                                        <svg onClick={removeEmployee} id={emp.id} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 -960 960 960">
                                            <path d={Path("close")} />
                                        </svg>
                                    </div>
                                )
                            }) : "")}
                    </div>
                </div>
                <input className="btn primary" type="submit" value="Anlegen" />
            </form>
        </div>
    )
}
