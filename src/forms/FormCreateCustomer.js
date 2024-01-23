import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import url from '../BackendURL';
import axios from 'axios';
import FormCreateAddress from './FormCreateAddress';

export default function FormCreateCustomer() {

    const navigate = useNavigate();

    const [company, setCompany] = useState("");
    const [customerNumber, setCustomerNumber] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [addressElement, setAddressElement] = useState({});

    const getCompany = (e) => {
        setCompany(e.target.value);
    };

    const getCustomerNumber = (e) => {
        setCustomerNumber(e.target.value);
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
        setPhone(e.target.value);
    };

    function getAddressElement(e) {
        setAddressElement(e);
    }

    /**
     * creates a new customer
     * @param {*} event
     */
    async function submitForm(event) {
        event.preventDefault();
        try {
            const response = await axios.post(url + '/customers',
                {
                    customerNumber: customerNumber,
                    company: company,
                    person: {
                        firstName: firstname,
                        lastName: lastname
                    },
                    email: email,
                    phoneNumber: phone
                },
                { headers: { 'Content-Type': 'application/json' } });

            const response2 = await axios.post(url + '/customers/' + response.data.id + '/addresses',
                {
                    country: addressElement.country,
                    street: addressElement.street,
                    streetNumber: addressElement.streetNumber,
                    city: addressElement.city,
                    zip: addressElement.zip,
                    //description: "string",
                    addressSuffix: addressElement.addressSuffix,
                    addressType: addressElement.addressType
                },
                { headers: { 'Content-Type': 'application/json' } });

            Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'Neuer Kunde angelegt!',
                confirmButtonText: 'Ok',
                confirmButtonColor: 'var(--success)',
                timer: 2000,
            }).then(() => {
                navigate("..", { relative: "path" });
            });
        } catch (error) {
            if (error.response.data.message.includes("CUSTOMER_NUMBER")) {
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    title: 'Personalnummer ist bereits vorhanden!',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'var(--error)',
                    timer: 2500
                });
            } else if (error.response.data.message.includes("USERNAME")) {
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    title: 'Benutzername ist bereits vorhanden!',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'var(--error)',
                    timer: 2500
                });
            } else if (error.response.data.message.includes("EMAIL")) {
                Swal.fire({
                    position: 'top',
                    icon: 'error',
                    title: 'E-Mail-Adresse ist bereits vorhanden!',
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
                <h1>Neuen Kunden anlegen</h1>
            </div>
            <form onSubmit={submitForm}>
                <div className='form-row'>
                    <label>
                        Firmenname
                        <input className='light-blue' type="text" name="company" onChange={getCompany} required />
                    </label>
                    <label>
                        Kundennummer
                        <input className='light-blue' type="number" name="customerNumber" min={100000} max={999999} onChange={getCustomerNumber} required />
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
                <FormCreateAddress addressElement={(elem) => { getAddressElement(elem) }} />
                <div className='btn-wrapper'>
                    <input className="btn primary" type="submit" value="Anlegen" />
                    <input className="btn secondary" type="button" value="Abbrechen" onClick={() => { navigate("..", { relative: "path" }); }} />
                </div>
            </form>
        </div>
    )
}
