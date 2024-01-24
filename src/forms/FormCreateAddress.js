import React, { useEffect, useState } from 'react';

export default function FormCreateAddress(props) {

    const [street, setStreet] = useState("");
    const [streetNumber, setStreetNumber] = useState("");
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [addressSuffix, setAddressSuffix] = useState("");
    const [addressType, setAddressType] = useState("DELIVERY");

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
                    Straße <span>*</span>
                    <input  type="text" name="street" onChange={getStreet} required />
                </label>
                <label>
                    Hausnummer <span>*</span>
                    <input  type="number" name="streetNumber" min="1" onChange={getStreetNumber} required />
                </label>
            </div>
            <div className='form-row'>
                <label>
                    Postleitzahl <span>*</span>
                    <input  type="text" name="zip" minLength={5} maxLength={5} onChange={getZip} required />
                </label>
                <label>
                    Stadt <span>*</span>
                    <input  type="text" name="city" onChange={getCity} required />
                </label>
            </div>
            <div className='form-row'>
                <label>
                    Land <span>*</span>
                    <input  type="text" name="country" onChange={getCountry} required />
                </label>
                <label>
                    Addresszusatz
                    <input  type="text" name="addressSuffix" onChange={getAddressSuffix} />
                </label>
            </div>
        </div>
    )
};