import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import url from '../BackendURL';
import axios from 'axios';
import FormCreateAddress from './FormCreateAddress';
import { wait } from '@testing-library/user-event/dist/utils';
import { resolvePath } from 'react-router-dom';

export default function FormCreateCustomer() {

    const [firstname, setFirstname] = useState([]); //To Do: kann man das alles vereinfachen / zusammen fassen?
    const [lastname, setLastname] = useState([]);
    const [email, setEmail] = useState([]);
    const [company, setCompany] = useState([]);
    const [customerNumber, setCustomerNumber] = useState([]);
    const [phone, setPhone] = useState([]);
    const [newAddress, setNewAddress] = useState([]);
    const [addresses, setAddresses] = useState([]);

    const getFirstname = (e) => {
        const firstname = e.target.value;
        setFirstname(firstname);
        console.log();
    };

    const getLastname = (e) => {
        const lastname = e.target.value;
        setLastname(lastname);
    };

    const getEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const getCompany = (e) => {
        const company = e.target.value;
        setCompany(company);
    };

    const getCustomerNumber = (e) => {
        const customerNumber = e.target.value;
        setCustomerNumber(customerNumber);
    };

    const getPhone = (e) => {
        const phone = e.target.value;
        setPhone(phone);
    };


    async function submitForm(event) {
        event.preventDefault();
        try {
            const response = await axios.post(url + '/customers',
                {
                    company: company,
                    firstName: firstname,
                    lastName: lastname,
                    customerNumber: customerNumber
                },
                { headers: { 'Content-Type': 'application/json' } });

            console.log(response.data);

            /*const newCustomer = await axios.post(url + '/customers/' + response.data.id + '/addresses',
                {
                    addresses: addresses.push(newAddress)
                },
                { headers: { 'Content-Type': 'application/json' } });

            console.log(newCustomer.data);*/

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Neuer Kunde angelegt!',
                showConfirmButton: false,
                timer: 2000,
            });

            setTimeout(function(){
                window.location.reload();
             }, 2500);

        } catch (error) {
            alert(error);
        }
    }

    function testFct() {
        const res = axios.get(url + '/customers')
            .then(r => {
                console.log(r.data);
            });
    }

    return (
        <div className='content-container'>
            <h2>Neuen Kunden anlegen</h2>
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
                <FormCreateAddress value={newAddress} />
                <input className="btn primary" type="submit" value="Anlegen" />
                <input onClick={testFct} className="btn primary" type="button" value="AnlegenTest" />
            </form>
        </div>
    )
}
