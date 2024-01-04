import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import url from '../BackendURL';
import Swal from 'sweetalert2';
import Path from '../icons/Paths';
import deleteItem from '../utility/deleteItem';

export default function FormPatchTeam() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState({});

    const [teamName, setTeamName] = useState("");
    const [teamDesc, setTeamDesc] = useState("");

    const [allEmployees, setAllEmployees] = useState([]);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [pickedEmployees, setPickedEmployees] = useState([]);

    useEffect(() => {
        getAllEmployees();
    }, []);

    useEffect(() => {
        updateAvailableEmployees();
    }, [allEmployees, pickedEmployees]);

    useEffect(() => {
        axios.get(url + '/teams/' + id)
            .then(res => {
                setTeam(res.data);
            });
        axios.get(url + '/teams/' + id + '/members')
            .then(res => {
                setPickedEmployees(res.data);
            });
    }, [id]);

    /**
     * gets all employees from database
     */
    function getAllEmployees() {
        axios.get(url + '/employees')
            .then(response => {
                setAllEmployees(response.data);
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
                    name: (teamName != null) ? teamName : team.description.name,
                    description: (teamDesc != null) ? teamDesc : team.description.description,
                    members: (pickedEmployees != null) ? pickedEmployees : team.members
                },
                { headers: { 'Content-Type': 'application/json' } });

            console.log("res data", response.data);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Änderungen gespeichert!',
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
            <h1>Team bearbeiten</h1>
            <form onSubmit={submitForm}>
                <div className='form-row'>
                    <label>
                        Name des Teams
                        <input placeholder={team.description?.name} className='light-blue' type="text" name="team" onChange={getTeamName} required />
                    </label>
                    <label>
                        Beschreibung
                        <input placeholder={team.description?.description} className='light-blue' type="text" name="description" onChange={getTeamDesc} />
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        Mitarbeiter
                        <select className='light-blue' name="customer" onChange={getPickedEmployees} required>
                            <option readOnly hidden>Bitte wählen</option>
                            {availableEmployees.map((emp) => {
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
                <div className='btn-wrapper'>
                    <input className="btn primary" type="submit" value="Speichern" />
                    <input className="btn red" type="button" value="Löschen" onClick={() => { deleteItem("/teams/" + team.id) }} />
                    <input className="btn secondary" type="button" value="Abbrechen" onClick={() => { navigate("..", { relative: "path" }); }} />
                </div>
            </form>
        </div>
    )
}
