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

    const [teamName, setTeamName] = useState();
    const [teamDesc, setTeamDesc] = useState();

    const [allEmployees, setAllEmployees] = useState([]);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [pickedEmployees, setPickedEmployees] = useState([]);

    useEffect(() => {
        getAllEmployees();
        getTeam();
        getMembers();
    }, []);

    useEffect(() => {
        updateAvailableEmployees();
    }, [allEmployees, pickedEmployees]);

    /**
    * gets all employees with role FITTER from API
    */
    function getAllEmployees() {
        axios.get(url + '/employees', {
            params: {
                unassigned: 'true',
                role: 'FITTER',
            },
        }).then(res => {
            setAllEmployees(res.data);
        });
    }

    /**
     * gets team via ID from API
     */
    function getTeam() {
        axios.get(url + '/teams/' + id)
            .then(res => {
                setTeam(res.data);
            });
    }

    /**
     * gets members of the team from API
     */
    function getMembers() {
        axios.get(url + '/teams/' + id + '/members')
            .then(res => {
                setPickedEmployees(res.data);
            });
    }

    const getTeamName = (e) => {
        setTeamName(e.target.value);
    }

    const getTeamDesc = (e) => {
        setTeamDesc(e.target.value);
    }

    /**
     * filters the available employees that there are not picked ones
     */
    function updateAvailableEmployees() {
        setAvailableEmployees(
            allEmployees.filter(obj =>
                !pickedEmployees.some(pickedObj => pickedObj.id === obj.id))
        );
    }

    /**
     * gets the selected employee and adds it to the picked employees
     * @param {*} e 
     */
    const getPickedEmployees = (e) => {
        const picked = allEmployees.find(emp => emp.id == e.target.selectedOptions[0].id);
        const selectedOption = {
            id: picked.id,
            firstName: picked.firstName,
            lastName: picked.lastName
        };
        setPickedEmployees([...pickedEmployees, selectedOption]);
    }

    /**
     * removes the employee from the picked list & adds the removed employee back to the select options
     * @param {*} emp 
     */
    function removeEmployee(emp) {
        axios.get(url + "/employees/" + emp.id).then(res => {
            axios.put(url + "/employees/" + emp.id, {
                ...res.data,
                teamId: null
            }).then(() => {setPickedEmployees(pickedEmployees.filter(obj => obj.id != emp.id));});
        });
    }

    async function submitForm(event) {
        event.preventDefault();
        try {
            const response = await axios.patch(url + '/teams/' + team.id,
                {
                    name: teamName,
                    description: teamDesc,
                },
                { headers: { 'Content-Type': 'application/json' } });

            pickedEmployees.forEach(emp => {
                axios.patch(url + "/employees/" + emp.id, {
                    teamId: team.id
                }, { headers: { 'Content-Type': 'application/json' } });
            });

            Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'Änderungen wurden gespeichert',
                confirmButtonText: 'Ok',
                confirmButtonColor: 'var(--success)',
                timer: 2000,
            }).then(navigate("..", { relative: "path" }));
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className='content-container'>
            <div className='topbar-header-wrapper'>
                <h1>Team bearbeiten</h1>
            </div>
            <form onSubmit={submitForm}>
                <div className='form-row'>
                    <label>
                        Name des Teams
                        <input placeholder={team.description?.name} type="text" name="team" onChange={getTeamName} />
                    </label>
                    <label>
                        Beschreibung
                        <input placeholder={team.description?.description} type="text" name="description" onChange={getTeamDesc} />
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        Mitarbeiter
                        <select name="customer" onChange={getPickedEmployees}>
                            <option readOnly hidden>Bitte wählen</option>
                            {availableEmployees.map((emp) => {
                                return (
                                    <option onClick={updateAvailableEmployees} key={emp.id} id={emp.id} value={emp}>{emp.firstName} {emp.lastName}</option>
                                )
                            })}
                        </select>
                    </label>
                    <div className='pickedItem-wrapper'>
                        {(pickedEmployees != [] ?
                            pickedEmployees.map((emp, index) => {
                                return (
                                    <div key={index} className='pickedItem'>
                                        <p>{emp.firstName} {emp.lastName}</p>
                                        <svg onClick={() => removeEmployee(emp)} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 -960 960 960">
                                            <path d={Path("close")} />
                                        </svg>
                                    </div>
                                )
                            }) : "")}
                    </div>
                </div>
                <div className='btn-wrapper'>
                    <input className="btn primary" type="submit" value="Speichern" />
                    <input className="btn red" type="button" value="Löschen" onClick={() => { deleteItem(url + "/teams/" + team.id, (res) => { console.log(res); navigate("..", { relative: "path" }) }) }} />
                    <input className="btn secondary" type="button" value="Abbrechen" onClick={() => { navigate("..", { relative: "path" }); }} />
                </div>
            </form>
        </div>
    )
}
