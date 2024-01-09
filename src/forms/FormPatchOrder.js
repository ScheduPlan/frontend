import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import url from '../BackendURL';
import { useNavigate, useParams } from 'react-router-dom';

export default function FormPatchOrder() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState({});

    const [customerList, setCustomerList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [teamList, setTeamList] = useState([]);

    const [customerID, setCustomerID] = useState();
    const [number, setNumber] = useState();
    const [productID, setProductID] = useState();
    const [commissionNumber, setCommissionNumber] = useState();
    const [weight, setWeight] = useState();
    const [date, setDate] = useState();
    const [timeperiod, setTimeperiod] = useState();
    const [datetype, setDatetype] = useState();
    const [teamID, setTeamID] = useState();

    useEffect(() => {
        axios.get(url + '/orders')
            .then(res => {
                setOrder(res.data.find(data => data.id == id));
            });
        setCustomerID(order.customer?.id);
    }, [id]);

    useEffect(() => {
        getCustomerList();
        getTeamList();
        //getProductList();
    }, []);

    /**
     * gets all customers from database
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

    /**
     * gets all products from database
     */
    function getProductList() {
        axios.get(url + '/products').then(
            res => {
                setProductList(res.data);
            }
        );
    }

    const getCustomerID = (e) => {
        setCustomerID(e.target.value);
    }

    const getNumber = (e) => {
        setNumber(e.target.value);
    }

    const getProductID = (e) => {
        setProductID(e.target.value);
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

    const getDatetype = (e) => {
        setDatetype(e.target.value);
    }

    const getTeamID = (e) => {
        setTeamID(e.target.value);
    }

    async function submitForm(event) {
        event.preventDefault();
        try {
            const response = await axios.patch(url + '/customers/' + customerID + '/orders/' + order.id,
                {
                    number: (number != null) ? number : order.number,
                    commissionNumber: (commissionNumber != null) ? commissionNumber : order.commissionNumber,
                    weight: (weight != null) ? weight : order.weight,
                    state: "PLANNED",
                    //products: productID,
                    teamId: (teamID != null) ? teamID : order.teamID,
                    plannedDuration: (timeperiod != null) ? timeperiod : order.timeperiod
                },
                { headers: { 'Content-Type': 'application/json' } });

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
            <h1>Auftrag <b>{order.number}</b> bearbeiten</h1>
            <form onSubmit={submitForm}>
                <h3>Kunde: {order.customer?.customerNumber} {order.customer?.company}</h3>
                <div className='form-row'>
                    <label>
                        Produkt
                        {/*<select className='light-blue' name="product" onChange={getProductID} required> //To Do Produkte
                            <option readOnly hidden>Bitte wählen</option>
                            {productList.map((prod, index) => {
                                return (<option key={index} value={prod.id}>{prod.productNumber} {prod.name}</option>)
                            })}
                        </select>*/}
                        <input className='light-blue' type="text" name="product" onChange={getProductID} />
                    </label>
                    <label>
                        Kommisionsnummer
                        <input placeholder={order.commissionNumber} className='light-blue' type="number" name="commissionNumber" min="1" onChange={getCommissionNumber} />
                    </label>
                </div>

                <div className='form-row'>
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
                        geplante Termindauer
                        <input placeholder={order.plannedDuration} className='light-blue' type="number" min="1" step="0.5" name="timeperiod" onChange={getTimeperiod} />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        Terminart
                        <select className='light-blue' name="datetype" onChange={getDatetype}> {/*To Do: alle mgl typen ziehen und hier ausgeben */}
                            <option readOnly hidden>Bitte auswählen</option>
                            <option>Montage</option>
                            <option>Reklamation</option>
                            <option>Lieferung</option>
                        </select>
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
                <div className='btn-wrapper'>
                    <input className="btn primary" type="submit" value="Anlegen" />
                    <input className="btn secondary" type="button" value="Abbrechen" onClick={() => { navigate("..", { relative: "path" }); }} />
                </div>
            </form>
        </div>
    )
}
