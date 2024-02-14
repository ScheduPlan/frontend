import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import url from '../BackendURL';
import { useNavigate } from 'react-router-dom';
import sortItems from '../utility/sortItems';
import FormCreateAddress from './FormCreateAddress';

export default function FormCreateOrder() {

    const navigate = useNavigate();

    const [customerList, setCustomerList] = useState([]);
    const [teamList, setTeamList] = useState([]);

    const [customerID, setCustomerID] = useState("");
    const [number, setNumber] = useState("");
    const [commissionNumber, setCommissionNumber] = useState("");
    const [weight, setWeight] = useState("");
    const [plannedDate, setPlannedDate] = useState("");
    const [timeperiod, setTimeperiod] = useState("");
    const [teamID, setTeamID] = useState();
    const [description, setDescription] = useState();

    const [addressElement, setAddressElement] = useState({});

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
                setCustomerList(sortItems(res.data, "customerNumber"));
            }
        );
    }

    /**
     * gets all teams from database
     */
    function getTeamList() {
        axios.get(url + '/teams').then(
            res => {
                setTeamList(sortItems(res.data, "description", "name"));
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
        setPlannedDate(new Date(e.target.value));
    }

    const getTimeperiod = (e) => {
        setTimeperiod(e.target.value);
    }

    const getTeamID = (e) => {
        setTeamID(e.target.value);
    }

    function getAddressElement(e) {
        setAddressElement(e);
    }

    const getDescription = (e) => {
        setDescription(e.target.value);
    }

    async function submitForm(event) {
        event.preventDefault();
        console.log(plannedDate);
        try {
            const response = await axios.post(url + '/customers/' + customerID + '/orders',
                {
                    number: number,
                    description: description,
                    commissionNumber: commissionNumber,
                    weight: weight,
                    state: "PLANNED",
                    plannedExecutionDate: plannedDate,
                    teamId: teamID,
                    plannedDuration: timeperiod
                },
                { headers: { 'Content-Type': 'application/json' } }).then(() => {
                    Swal.fire({
                        position: 'top',
                        icon: 'success',
                        title: 'Neuer Auftrag wurde angelegt!',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: 'var(--success)',
                        timer: 2000
                    }).then(() => {
                        navigate("..", { relative: "path" });
                    });
                });
        } catch (error) {
            console.log(error);
            if (error.response.data.message.includes("ORDERS(NUMBER")) {
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    title: 'Auftragsnummer bereits vergeben',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'var(--error)',
                    timer: 2500
                });
            } else {
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    title: 'Fehler',
                    text: 'Auftrag konnte nicht angelegt werden! Bitte Angabe prüfen.',
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
                <h1>Neuen Auftrag anlegen</h1>
            </div>
            <form onSubmit={submitForm}>
                <div className='form-row'>
                    <label>
                        Kunde <span>*</span>
                        <select name="customer" onChange={getCustomerID} required>
                            <option value={''} readOnly hidden>Bitte wählen</option>
                            {customerList.map((cust) => {
                                return (<option key={cust.id} value={cust.id}>{cust.customerNumber} {cust.company}</option>)
                            })}
                        </select>
                    </label>
                    <label>
                        Auftragsnummer <span>*</span>
                        <input type="number" name="number" min={100000} max={999999} onChange={getNumber} required />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        Kommisionsnummer <span>*</span>
                        <input type="text" name="commissionNumber" onChange={getCommissionNumber} required />
                    </label>
                    <label>
                        Gewicht <span>*</span>
                        <input type="number" min="1" step="0.05" name="weight" onChange={getWeight} required />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        freigegebener Termin <span>*</span>
                        <input type="date" name="date" onChange={getDate} required />
                    </label>
                    <label>
                        geplante Termindauer <span>*</span>
                        <input type="number" min="1" step="0.5" name="timeperiod" onChange={getTimeperiod} required />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        Team <span>*</span>
                        <select name="team" onChange={getTeamID} required>
                            <option value={''} readOnly hidden>Bitte wählen</option>
                            {teamList.map((team, index) => {
                                return (<option key={index} value={team.id}>{team.description.name}</option>)
                            })}
                        </select>
                    </label>
                </div>
                {/*<FormCreateAddress addressElement={(elem) => { getAddressElement(elem) }} />*/}
                <h3>Bemerkung</h3>
                <label>
                    <input type="text" name="description" onChange={getDescription} />
                </label>
                <div className='btn-wrapper'>
                    <input className="btn primary" type="submit" value="Anlegen" />
                    <input className="btn secondary" type="button" value="Abbrechen" onClick={() => { navigate("..", { relative: "path" }); }} />
                </div>
            </form>
        </div>
    )
}
