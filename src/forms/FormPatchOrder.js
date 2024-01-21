import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import url from '../BackendURL';
import { useNavigate, useParams } from 'react-router-dom';

export default function FormPatchOrder() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState({});

    const [teamList, setTeamList] = useState([]);

    const [number, setNumber] = useState();
    const [commissionNumber, setCommissionNumber] = useState();
    const [weight, setWeight] = useState();
    const [date, setDate] = useState();
    const [teamID, setTeamID] = useState();
    const [description, setDescription] = useState();

    useEffect(() => {
        axios.get(url + '/orders')
            .then(res => {
                setOrder(res.data.find(data => data.id == id));
            });
    }, [id]);

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

    const getDescription = (e) => {
        setDescription(e.target.value);
    }

    async function submitForm(event) {
        event.preventDefault();
        try {
            const response = await axios.patch(url + '/customers/' + order.customer.id + '/orders/' + order.id,
                {
                    number: number,
                    description: description,
                    commissionNumber: commissionNumber,
                    weight: weight,
                    teamId: teamID,
                },
                { headers: { 'Content-Type': 'application/json' } });

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
                <h3>Kunde: {order.customer?.customerNumber} {order.customer?.company}</h3>
                <div className='form-row'>
                    <label>
                        Kommisionsnummer
                        <input placeholder={order.commissionNumber} className='light-blue' type="text" name="commissionNumber" onChange={getCommissionNumber} />
                    </label>
                    <label>
                        Gewicht
                        <input placeholder={order.weight} className='light-blue' type="number" min="1" step="0.05" name="weight" onChange={getWeight} />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        freigegebener Termin
                        <input className='light-blue' type="date" name="date" onChange={getDate} />
                    </label>
                    <label>
                        Team
                        <select className='light-blue' name="team" onChange={getTeamID}>
                            <option readOnly hidden>
                                {order.team != null ?
                                    order.team?.description?.name :
                                    "Bitte wählen"}
                            </option>
                            {teamList.sort(function (a, b) {
                                if (a.description.name < b.description.name) { return -1; }
                                if (a.description.name > b.description.name) { return 1; }
                                return 0;
                            }).map((team, index) => {
                                return (<option key={index} value={team.id}>{team.description.name}</option>)
                            })}
                        </select>
                    </label>
                </div>

                <div className='form-row'>
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
