import React, { useEffect, useState } from 'react';
import url from '../BackendURL';
import axios from 'axios';

const FormCreateAddress = React.forwardRef((props, ref) => {

    const [street, setStreet] = useState("");
    const [streetNumber, setStreetNumber] = useState("");
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [addressSuffix, setAddressSuffix] = useState("");
    const [addressType, setAddressType] = useState("DELIVERY");

    // Ref an die Elternkomponente übergeben
    React.useImperativeHandle(ref, () => ({
        triggerFunctionInChild,
    }));


    const getStreet = (e) => {
        setStreet(e.target.value);
    };

    const getStreetNumber = (e) => {
        setStreetNumber(e.target.value);
    };

    const getZip = (e) => {
        setZip(e.target.value);
    };

    const getCity = (e) => {
        setCity(e.target.value);
    };

    const getCountry = (e) => {
        setCountry(e.target.value);
    };

    const getAddressSuffix = (e) => {
        setAddressSuffix(e.target.value);
    };

    /**
     * sends address form
     */
    async function triggerFunctionInChild(id) {
        console.log("Id in address", id);
        const newCustomer = await axios.post(url + '/customers/' + id + '/addresses',
            {
                country: {country},
                street: {street},
                streetNumber: {streetNumber},
                city: {city},
                zip: {zip},
                //description: "string",
                addressSuffix: {addressSuffix},
                addressType: {addressType}
            },
            { headers: { 'Content-Type': 'application/json' } });

        console.log("Customer", newCustomer.data);
    }

    return (
        <div>
            <h3>Adresse</h3>
            <div className='form-row'>
                <label>
                    Straße
                    <input className='light-blue' type="text" name="street" onChange={getStreet} required />
                </label>
                <label>
                    Hausnummer
                    <input className='light-blue' type="number" name="streetNumber" onChange={getStreetNumber} required />
                </label>
            </div>
            <div className='form-row'>
                <label>
                    Postleitzahl
                    <input className='light-blue' type="text" name="zip" onChange={getZip} required />
                </label>
                <label>
                    Stadt
                    <input className='light-blue' type="text" name="city" onChange={getCity} required />
                </label>
            </div>
            <div className='form-row'>
                <label>
                    Land
                    <input className='light-blue' type="text" name="country" onChange={getCountry} required />
                </label>
                <label>
                    Addresszusatz
                    <input className='light-blue' type="text" name="addressSuffix" onChange={getAddressSuffix} />
                </label>
            </div>
        </div>
    )
});

export default FormCreateAddress;