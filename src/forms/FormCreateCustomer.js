import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import url from '../BackendURL';
import axios from 'axios';
import FormCreateAddress from './FormCreateAddress';

export default function FormCreateCustomer() {

    const navigate = useNavigate();
    // Ref für die Kindkomponente erstellen
    const childRef = useRef(null);

    const [customerID, setCustomerID] = useState("");

    const [company, setCompany] = useState([]);
    const [customerNumber, setCustomerNumber] = useState([]);
    const [firstname, setFirstname] = useState([]);
    const [lastname, setLastname] = useState([]);
    const [email, setEmail] = useState([]);
    const [phone, setPhone] = useState([]);


    //To Do: Kann man den nachfolgenden Block generischer machen?
    const getCompany = (e) => {
        setCompany(e.target.value);
    };

    const getCustomerNumber = (e) => {
        const customerNumber = e.target.value;
        setCustomerNumber(customerNumber);
    };

    const getFirstname = (e) => {
        setFirstname(e.target.value);
    };

    const getLastname = (e) => {
        setLastname(e.target.value);
    };

    const getEmail = (e) => {
        setEmail(e.target.value);
    };

    const getPhone = (e) => {
        const phone = e.target.value;
        setPhone(phone);
    };


    /**
     * creates a new customer
     * @param {*} event 
     */
    async function submitForm(event) {
        event.preventDefault();
        try {
            const response = await axios.post(url + '/customers',
                {
                    company: company,
                    person: {
                        firstName: firstname,
                        lastName: lastname
                    },
                    customerNumber: customerNumber
                },
                { headers: { 'Content-Type': 'application/json' } });

            console.log("Post res", response.data);
            console.log("Post res id", response.data.id);
            setCustomerID(response.data.id);

            //hier Fkt. in Adresse auslösen
            childRef.current && childRef.current.triggerFunctionInChild(response.data.id);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Neuer Kunde angelegt!',
                showConfirmButton: false,
                timer: 2000,
            });

            setTimeout(function () {
                navigate("..", { relative: "path" });
            }, 2500);

        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className='content-container'>
            <h1>Neuen Kunden anlegen</h1>
            <form onSubmit={submitForm}>
                <div className='form-row'>
                    <label>
                        Firmenname
                        <input className='light-blue' type="text" name="company" onChange={getCompany} required />
                    </label>
                    <label>
                        Kundennummer
                        <input className='light-blue' type="number" name="customerNumber" onChange={getCustomerNumber} required />
                    </label>
                </div>
                <h3>Ansprechpartner</h3>
                <div className='form-row'>
                    <label>
                        Vorname
                        <input className='light-blue' type="text" name="firstname" onChange={getFirstname} required />
                    </label>
                    <label>
                        Nachname
                        <input className='light-blue' type="text" name="lastname" onChange={getLastname} required />
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        E-Mail-Adresse
                        <input className='light-blue' type="email" name="email" onChange={getEmail} required />
                    </label>
                    <label>
                        Telefonnummer
                        <input className='light-blue' type="text" name="phone" onChange={getPhone} required />
                    </label>
                </div>
                <FormCreateAddress ref={childRef} id={customerID} />
                <label>
                    Lieferaddresse abweichend
                    <input className='btn primary' type='checkbox' value="" />
                </label>

                <div className='btn-wrapper'>
                    <input className="btn primary" type="submit" value="Anlegen" />
                    <input className="btn secondary" type="button" value="Abbrechen" onClick={() => { navigate("..", { relative: "path" }); }} />
                </div>
            </form>
        </div>
    )
}
