import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import url from '../BackendURL';
import axios from 'axios';
import FormCreateAddress from './FormCreateAddress';
import FormPatchAddress from './FormPatchAddress';

export default function FormPatchCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({});
  const [address, setAddress] = useState({});

  const [company, setCompany] = useState();
  const [customerNumber, setCustomerNumber] = useState();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();

  const [addressElement, setAddressElement] = useState({});

  useEffect(() => {
    axios.get(url + '/customers/' + id)
      .then(res => {
        setCustomer(res.data);
        setAddress(res.data.addresses.at(0));
      });
  }, [id]);

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
      const response = await axios.patch(url + '/customers/' + id,
        {
          customerNumber: (customerNumber != null) ? customerNumber : customer.customerNumber,
          company: (company != null) ? company : customer.company,
          person: {
            firstName: (firstname != null) ? firstname : customer.firstName,
            lastName: (lastname != null) ? lastname : customer.lastName
          },
          email: email,
          phoneNumber: phone
        },
        { headers: { 'Content-Type': 'application/json' } });

      const response2 = await axios.patch(url + '/customers/' + id + '/addresses/' + customer.addresses.at(0).id,
        {
          country: (addressElement.country != null) ? addressElement.country : address.country,
          street: (addressElement.street != null) ? addressElement.street : address.street,
          streetNumber: (addressElement.streetNumber != null) ? addressElement.streetNumber : address.streetNumber,
          city: (addressElement.city != null) ? addressElement.city : address.city,
          zip: (addressElement.zip != null) ? addressElement.zip : address.zip,
          //description: "string",
          addressSuffix: (addressElement.addressSuffix != null) ? addressElement.addressSuffix : address.addressSuffix,
          addressType: (addressElement.addressType != null) ? addressElement.addressType : address.addressType,
        },
        { headers: { 'Content-Type': 'application/json' } });

      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Änderungen gespeichert!',
        confirmButtonText: 'Ok',
        confirmButtonColor: 'var(--success)',
        timer: 2000,
      }).then(() => {
        navigate("..", { relative: "path" });
      });

    } catch (error) {
      alert(error);
    }
  }

  return (
    <div className='content-container'>
      <div className='topbar-header-wrapper'>
        <h1>Kunden bearbeiten</h1>
      </div>
      <form onSubmit={submitForm}>
        <div className='form-row'>
          <label>
            Firmenname
            <input placeholder={customer.company} className='light-blue' type="text" name="company" onChange={getCompany} />
          </label>
          <label>
            Kundennummer
            <input placeholder={customer.customerNumber} className='light-blue' type="number" name="customerNumber" min={100000} max={999999} onChange={getCustomerNumber} />
          </label>
        </div>
        <h3>Ansprechpartner</h3>
        <div className='form-row'>
          <label>
            Vorname
            <input placeholder={customer.firstName} className='light-blue' type="text" name="firstname" onChange={getFirstname} />
          </label>
          <label>
            Nachname
            <input placeholder={customer.lastName} className='light-blue' type="text" name="lastname" onChange={getLastname} />
          </label>
        </div>
        <div className='form-row'>
          <label>
            E-Mail-Adresse
            <input placeholder={customer.email} className='light-blue' type="email" name="email" onChange={getEmail} />
          </label>
          <label>
            Telefonnummer
            <input placeholder={customer.phoneNumber} className='light-blue' type="text" name="phone" onChange={getPhone} />
          </label>
        </div>
        <FormPatchAddress placeholder={address} addressElement={(elem) => { getAddressElement(elem) }} />
        <div className='btn-wrapper'>
          <input className="btn primary" type="submit" value="Anlegen" />
          <input className="btn secondary" type="button" value="Abbrechen" onClick={() => { navigate("..", { relative: "path" }); }} />
        </div>
      </form>
    </div>
  )
}
