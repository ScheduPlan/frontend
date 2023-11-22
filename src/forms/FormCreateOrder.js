import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import url from '../BackendURL';

export default function FormCreateOrder() {

    const [customerList, setCustomerList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [teamList, setTeamList] = useState([]);

    const [customerID, setCustomerID] = useState();
    const [productID, setProductID] = useState();
    const [teamID, setTeamID] = useState();

    useEffect(() => {
        axios.get(url + '/customers').then(
            res => {
                const data = res.data;
                setCustomerList(data);
                console.log(data);
            }
        );

        axios.get(url + '/products').then(
            res => {
                const data = res.data;
                setProductList(data);
                console.log(data);
            }
        );

        axios.get(url + '/teams').then(
            res => {
                const data = res.data;
                setTeamList(data);
                console.log(data);
            }
        );
    }, []);

    const getCustomerID = (e) => {
        setCustomerID(e.target.value);
    }

    function submitForm() {
        //POST
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Neuer Auftrag angelegt!',
            showConfirmButton: false,
            timer: 5000
        });

        //timer & reload
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
                            {customerList.map((cust, index) => {
                                return (<option key={index} value={cust.id}>{cust.customerNumber} {cust.company}</option>)
                            })}
                        </select>
                    </label>
                    <label>
                        Produkt
                        {/*<select className='light-blue' name="product" onChange={getProductID} required> //To Do Produkte
                            <option readOnly hidden>Bitte wählen</option>
                            {productList.map((prod, index) => {
                                return (<option key={index} value={prod.id}>{prod.productNumber} {prod.name}</option>)
                            })}
                        </select>*/}
                        <input className='light-blue' type="text" name="product" />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        freigegebener Termin
                        <input className='light-blue' type="date" name="date" required />
                    </label>
                    <label>
                        geplante Termindauer
                        <input className='light-blue' type="number" name="timeperiod" required />
                    </label>
                </div>

                <div className='form-row'>
                    <label>
                        Terminart
                        <select className='light-blue' name="type" required> {/*To Do: alle mgl typen ziehen und hier ausgeben */}
                            <option readOnly hidden>Bitte auswählen</option>
                            <option>Montage</option>
                            <option>Reklamation</option>
                            <option>Lieferung</option>
                        </select>
                    </label>
                    <label>
                        Team
                        {/*<select className='light-blue' name="team" onChange={getTeamID} required> //To Do Teams
                            <option readOnly hidden>Bitte wählen</option>
                            {teamList.map((team, index) => {
                                return (<option key={index} value={team.id}>{team.name}</option>)
                            })}
                        </select>*/}
                        <select className='light-blue' name="team" defaultValue="Bitte auswählen" required >
                            <option>Süd 1</option>
                            <option>Süd 2</option>
                            <option>Nord 1</option>
                            <option>Nord 2</option>
                        </select>
                    </label>
                </div>
                <input className="btn primary" type="submit" value="Anlegen" />
                <input onClick={submitForm} className="btn primary" type="button" value="AnlegenTest" />
            </form>
        </div>
    )
}
