import React, { useEffect, useState } from 'react'

export default function FormCreateAddress(props) {
    const [street, setStreet] = useState([]);
    const [streetNumber, setStreetNumber] = useState([]);
    const [zip, setZip] = useState([]);
    const [city, setCity] = useState([]);
    const [land, setLand] = useState([]);
    const [addressSuffix, setAddressSuffix] = useState([]);

    useEffect(() => {
        props.value.useState = {
            street, streetNumber, zip, city, land, addressSuffix
        }
    }, [street, streetNumber, zip, city, land, addressSuffix]);

    const getStreet = (e) => {
        const street = e.target.value;
        setStreet(street);
    };

    const getStreetNumber = (e) => {
        const streetNumber = e.target.value;
        setStreetNumber(streetNumber);
    };

    const getZip = (e) => {
        const zip = e.target.value;
        setZip(zip);
    };

    const getCity = (e) => {
        const city = e.target.value;
        setCity(city);
    };

    const getLand = (e) => {
        const land = e.target.value;
        setLand(land);
    };

    const getAddressSuffix = (e) => {
        const addressSuffix = e.target.value;
        setAddressSuffix(addressSuffix);
    };

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
                        <input className='light-blue' type="text" name="land" onChange={getLand} required />
                    </label>
                    <label>
                        Addresszusatz
                        <input className='light-blue' type="text" name="addressSuffix" onChange={getAddressSuffix} />
                    </label>
                </div>
        </div>
    )
}
