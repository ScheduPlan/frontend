import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import url from '../BackendURL';
import { useNavigate, useParams } from 'react-router-dom';
import deleteItem from '../utility/deleteItem';
import FormPatchAddress from './FormPatchAddress';
import sortItems from '../utility/sortItems';

export default function FormPatchOrder() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState({});
    const [address, setAddress] = useState({});

    const [customerList, setCustomerList] = useState([]);
    const [teamList, setTeamList] = useState([]);

    const [customerID, setCustomerID] = useState();
    const [number, setNumber] = useState();
    const [commissionNumber, setCommissionNumber] = useState();
    const [weight, setWeight] = useState();
    const [date, setDate] = useState();
    const [teamID, setTeamID] = useState();
    const [description, setDescription] = useState();

    const [addressElement, setAddressElement] = useState({});

    useEffect(() => {
        axios.get(url + '/orders').then(res => {
            setOrder(res.data.find(order => order.id == id));
            setAddress(res.data.address);
        }).then(() => {
            if (order.plannedExecutionDate != null) {
                setDate(new Date(order.plannedExecutionDate));
            }
        });
    }, [id]);

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
        setDate(e.target.value);
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
        try {
            await axios.patch(url + '/customers/' + order.customer.id + '/orders/' + order.id,
                {
                    number: number,
                    description: description,
                    commissionNumber: commissionNumber,
                    weight: weight,
                    plannedExecutionDate: date,
                    teamId: teamID,
                },
                { headers: { 'Content-Type': 'application/json' } }).then(() => {
                    Swal.fire({
                        position: 'top',
                        icon: 'success',
                        title: 'Änderungen gespeichert!',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: 'var(--success)',
                        timer: 2000
                    }).then(() => {
                        navigate("..", { relative: "path" });
                    });
                });
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className='content-container'>
            <div className='topbar-header-wrapper'>
                <h1>Auftrag <b>{order.number}</b> bearbeiten</h1>
            </div>
            <form onSubmit={submitForm}>
                <div className='form-row'>
                    <label>
                        Kunde
                        <select name="customer" onChange={getCustomerID}>
                            <option readOnly hidden>
                                {order.customer != null ?
                                    order.customer?.customerNumber + " " + order.customer?.company :
                                    "Bitte wählen"}
                            </option>
                            {customerList.map((cust) => {
                                return (<option key={cust.id} value={cust.id}>{cust.customerNumber} {cust.company}</option>)
                            })}
                        </select>
                    </label>
                    <label>
                        Auftragsnummer
                        <input placeholder={order.number} type="number" name="number" min={100000} max={999999} onChange={getNumber} />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        Kommisionsnummer
                        <input placeholder={order.commissionNumber} type="text" name="commissionNumber" onChange={getCommissionNumber} />
                    </label>
                    <label>
                        Gewicht
                        <input placeholder={order.weight} type="number" min="1" step="0.05" name="weight" onChange={getWeight} />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        freigegebener Termin
                        <input placeholder={order.plannedExecutionDate} type="date" name="date" onChange={getDate} />
                    </label>
                    <label>
                        Team
                        <select name="team" onChange={getTeamID}>
                            <option readOnly hidden>
                                {order.team != null ?
                                    order.team?.description?.name :
                                    "Bitte wählen"}
                            </option>
                            {teamList.map((team, index) => {
                                return (<option key={index} value={team.id}>{team.description.name}</option>)
                            })}
                        </select>
                    </label>
                </div>
                {/*<FormPatchAddress placeholder={address} addressElement={(elem) => { getAddressElement(elem) }} />*/}
                <h3>Bemerkung</h3>
                <label>
                    <input placeholder={description} type="text" name="description" onChange={getDescription} />
                </label>
                <div className='btn-wrapper'>
                    <input className="btn primary" type="submit" value="Speichern" />
                    <input className="btn red" type="button" value="Löschen" onClick={() => { deleteItem(url + "/customers/" + order.customer.id + "/orders/" + order.id, (res) => { console.log(res); navigate("..", { relative: "path" }) }) }} />
                    <input className="btn secondary" type="button" value="Abbrechen" onClick={() => { navigate("..", { relative: "path" }); }} />
                </div>
            </form>
        </div>
    )
}
