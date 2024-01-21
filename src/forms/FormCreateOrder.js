import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import url from '../BackendURL';
import { useNavigate } from 'react-router-dom';

export default function FormCreateOrder() {

    const navigate = useNavigate();

    const [customerList, setCustomerList] = useState([]);
    const [teamList, setTeamList] = useState([]);

    const [customerID, setCustomerID] = useState("");
    const [number, setNumber] = useState("");
    const [commissionNumber, setCommissionNumber] = useState("");
    const [weight, setWeight] = useState("");
    const [date, setDate] = useState(""); //To Do
    const [timeperiod, setTimeperiod] = useState("");
    const [teamID, setTeamID] = useState();
    const [description, setDescription] = useState();

    useEffect(() => {
        getCustomerList();
        getTeamList();
    }, []);

    /**
     * gets all customers from API
     */
    function getCustomerList() {
        axios.get(url + '/customers').then(
            res => {
                setCustomerList(res.data);
            }
        );
    }

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

    const getCustomerID = (e) => {
        setCustomerID(e.target.value);
    }

    const getNumber = (e) => {
        setNumber(e.target.value);
    }

    const getCommissionNumber = (e) => {
        setCommissionNumber(e.target.value);
    }

    const getWeight = (e) => {
        setWeight(e.target.value);
    }

    const getDate = (e) => {
        setDate(e.target.value);
    }

    const getTimeperiod = (e) => {
        setTimeperiod(e.target.value);
    }

    const getTeamID = (e) => {
        setTeamID(e.target.value);
    }

    const getDescription = (e) => {
        setDescription(e.target.value);
    }

    async function submitForm(event) {
        event.preventDefault();
        try {
            const response = await axios.post(url + '/customers/' + customerID + '/orders',
                {
                    number: number,
                    description: "",
                    commissionNumber: commissionNumber,
                    weight: weight,
                    state: "PLANNED",
                    teamId: teamID,
                    plannedDuration: timeperiod
                },
                { headers: { 'Content-Type': 'application/json' } });

            Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'Neuen Auftrag angelegt!',
                confirmButtonText: 'Ok',
                confirmButtonColor: 'var(--success)',
                timer: 2000
            }).then(() => {
                navigate("..", { relative: "path" });
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='content-container'>
            <div className='topbar-header-wrapper'>
                <h1>Neuen Auftrag anlegen</h1>
            </div>
            <form onSubmit={submitForm}>
                <div className='form-row'>
                    <label>
                        Kunde
                        <select className='light-blue' name="customer" onChange={getCustomerID} required>
                            <option readOnly hidden>Bitte wählen</option>
                            {customerList.sort(function (a, b) {
                                if (a.customerNumber < b.customerNumber) { return -1; }
                                if (a.customerNumber > b.customerNumber) { return 1; }
                                return 0;
                            }).map((cust) => {
                                return (<option key={cust.id} value={cust.id}>{cust.customerNumber} {cust.company}</option>)
                            })}
                        </select>
                    </label>
                    <label>
                        Auftragsnummer
                        <input className='light-blue' type="number" name="number" min="10000" onChange={getNumber} required />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        Kommisionsnummer
                        <input className='light-blue' type="text" name="commissionNumber" onChange={getCommissionNumber} required />
                    </label>
                    <label>
                        Gewicht
                        <input className='light-blue' type="number" min="1" step="0.05" name="weight" onChange={getWeight} required />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        freigegebener Termin
                        <input className='light-blue' type="date" name="date" onChange={getDate} required />
                    </label>
                    <label>
                        geplante Termindauer
                        <input className='light-blue' type="number" min="1" step="0.5" name="timeperiod" onChange={getTimeperiod} required />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        Team
                        <select className='light-blue' name="team" onChange={getTeamID} required>
                            <option readOnly hidden>Bitte wählen</option>
                            {teamList.sort(function (a, b) {
                                if (a.description.name < b.description.name) { return -1; }
                                if (a.description.name > b.description.name) { return 1; }
                                return 0;
                            }).map((team, index) => {
                                return (<option key={index} value={team.id}>{team.description.name}</option>)
                            })}
                        </select>
                    </label>
                    <label>
                        Beschreibung
                        <input className='light-blue' type="text" name="description" onChange={getDescription} />
                    </label>
                </div>
                <div className='btn-wrapper'>
                    <input className="btn primary" type="submit" value="Anlegen" />
                    <input className="btn secondary" type="button" value="Abbrechen" onClick={() => { navigate("..", { relative: "path" }); }} />
                </div>
            </form>
        </div>
    )
}
