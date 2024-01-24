import React, { useEffect, useState } from 'react';

export default function FormPatchAddress(props) {

    const [street, setStreet] = useState();
    const [streetNumber, setStreetNumber] = useState();
    const [zip, setZip] = useState();
    const [city, setCity] = useState();
    const [country, setCountry] = useState();
    const [addressSuffix, setAddressSuffix] = useState();
    const [addressType, setAddressType] = useState();

    const [addressElement, setAddressElement] = useState({
        country: country,
        street: street,
        streetNumber: streetNumber,
        city: city,
        zip: zip,
        addressSuffix: addressSuffix,
        addressType: addressType
    });

    useEffect(() => {
        setAddress();
    }, [addressElement]);

    const getStreet = (e) => {
        addressElement.street = e.target.value;
    };

    const getStreetNumber = (e) => {
        addressElement.streetNumber = e.target.value;
    };

    const getZip = (e) => {
        addressElement.zip = e.target.value;
    };

    const getCity = (e) => {
        addressElement.city = e.target.value;
    };

    const getCountry = (e) => {
        addressElement.country = e.target.value;
    };

    const getAddressSuffix = (e) => {
        addressElement.addressSuffix = e.target.value;
    };

    function setAddress() {
        props.addressElement(addressElement);
    }

    return (
        <div>
            <h3>Adresse</h3>
            <div className='form-row'>
                <label>
                    Straße
                    <input placeholder={props.placeholder.street}  type="text" name="street" onChange={getStreet} />
                </label>
                <label>
                    Hausnummer
                    <input placeholder={props.placeholder.streetNumber}  type="number" name="streetNumber" min="1" onChange={getStreetNumber} />
                </label>
            </div>
            <div className='form-row'>
                <label>
                    Postleitzahl
                    <input placeholder={props.placeholder.zip}  type="text" name="zip" minLength={5} maxLength={5} onChange={getZip} />
                </label>
                <label>
                    Stadt
                    <input placeholder={props.placeholder.city}  type="text" name="city" onChange={getCity} />
                </label>
            </div>
            <div className='form-row'>
                <label>
                    Land
                    <input placeholder={props.placeholder.country}  type="text" name="country" onChange={getCountry} />
                </label>
                <label>
                    Addresszusatz
                    <input placeholder={props.placeholder.addressSuffix}  type="text" name="addressSuffix" onChange={getAddressSuffix} />
                </label>
            </div>
        </div>
    )
};