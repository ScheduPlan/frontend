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
        country: (country != null) ? country : props.placeholder.country,
        street: (street != null) ? street : props.placeholder.street,
        streetNumber: (streetNumber != null) ? streetNumber : props.placeholder.streetNumber,
        city: (city != null) ? city : props.placeholder.city,
        zip: (zip != null) ? zip : props.placeholder.zip,
        //description: "string",
        addressSuffix: (addressSuffix != null) ? addressSuffix : props.placeholder.addressSuffix,
        addressType: (addressType != null) ? addressType : props.placeholder.addressType
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
                    <input placeholder={props.placeholder.street} className='light-blue' type="text" name="street" onChange={getStreet} />
                </label>
                <label>
                    Hausnummer
                    <input placeholder={props.placeholder.streetNumber} className='light-blue' type="number" name="streetNumber" min="1" onChange={getStreetNumber} />
                </label>
            </div>
            <div className='form-row'>
                <label>
                    Postleitzahl
                    <input placeholder={props.placeholder.zip} className='light-blue' type="text" name="zip" minLength={5} maxLength={5} onChange={getZip} />
                </label>
                <label>
                    Stadt
                    <input placeholder={props.placeholder.city} className='light-blue' type="text" name="city" onChange={getCity} />
                </label>
            </div>
            <div className='form-row'>
                <label>
                    Land
                    <input placeholder={props.placeholder.country} className='light-blue' type="text" name="country" onChange={getCountry} />
                </label>
                <label>
                    Addresszusatz
                    <input placeholder={props.placeholder.addressSuffix} className='light-blue' type="text" name="addressSuffix" onChange={getAddressSuffix} />
                </label>
            </div>
        </div>
    )
};