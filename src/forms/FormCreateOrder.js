import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import url from '../BackendURL';
import { useNavigate } from 'react-router-dom';

export default function FormCreateOrder() {

    const navigate = useNavigate();

    const [customerList, setCustomerList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [teamList, setTeamList] = useState([]);

    const [customerID, setCustomerID] = useState("");
    const [number, setNumber] = useState("");
    const [productID, setProductID] = useState("");
    const [commissionNumber, setCommissionNumber] = useState("");
    const [weight, setWeight] = useState("");
    const [date, setDate] = useState("");
    const [timeperiod, setTimeperiod] = useState("");
    const [datetype, setDatetype] = useState("");
    const [teamID, setTeamID] = useState("");

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
                console.log(res.data);
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
                console.log("Teams", res.data);
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
                console.log(res.data);
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
            const response = await axios.post(url + '/customers/' + customerID + '/orders',
                {
                    number: number,
                    description: "",
                    commissionNumber: commissionNumber,
                    weight: weight,
                    state: "PLANNED"
                    //products: productID,
                    //team: teamID,
                },
                { headers: { 'Content-Type': 'application/json' } });

            console.log("res data", response.data);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Neuen Auftrag angelegt!',
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
            <h1>Neuen Auftrag anlegen</h1>
            <form onSubmit={submitForm}>
                <div className='form-row'>
                    <label>
                        Kunde
                        <select className='light-blue' name="customer" onChange={getCustomerID} required>
                            <option readOnly hidden>Bitte wählen</option>
                            {customerList.map((cust) => {
                                return (<option key={cust.id} value={cust.id}>{cust.customerNumber} {cust.company}</option>)
                            })}
                        </select>
                    </label>
                    <label>
                        Auftragsnummer
                        <input className='light-blue' type="number" name="number" onChange={getNumber} required />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        Produkt
                        {/*<select className='light-blue' name="product" onChange={getProductID} required> //To Do Produkte
                            <option readOnly hidden>Bitte wählen</option>
                            {productList.map((prod, index) => {
                                return (<option key={index} value={prod.id}>{prod.productNumber} {prod.name}</option>)
                            })}
                        </select>*/}
                        <input className='light-blue' type="text" name="product" onChange={getProductID} required />
                    </label>
                    <label>
                        Kommisionsnummer
                        <input className='light-blue' type="number" name="commissionNumber" onChange={getCommissionNumber} required />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        Gewicht
                        <input className='light-blue' type="number" name="weight" onChange={getWeight} required />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        freigegebener Termin
                        <input className='light-blue' type="date" name="date" onChange={getDate} required />
                    </label>
                    <label>
                        geplante Termindauer
                        <input className='light-blue' type="number" name="timeperiod" onChange={getTimeperiod} required />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        Terminart
                        <select className='light-blue' name="datetype" onChange={getDatetype} required> {/*To Do: alle mgl typen ziehen und hier ausgeben */}
                            <option readOnly hidden>Bitte auswählen</option>
                            <option>Montage</option>
                            <option>Reklamation</option>
                            <option>Lieferung</option>
                        </select>
                    </label>
                    <label>
                        Team
                        <select className='light-blue' name="team" onChange={getTeamID} required> //To Do Teams
                            <option readOnly hidden>Bitte wählen</option>
                            {teamList.map((team, index) => {
                                return (<option key={index} value={team.id}>{team.description.name}</option>)
                            })}
                        </select>
                    </label>
                </div>
                <input className="btn primary" type="submit" value="Anlegen" />
            </form>
        </div>
    )
}
