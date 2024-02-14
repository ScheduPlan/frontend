import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import url from '../BackendURL';
import axios from 'axios';
import FormCreateAddress from './FormCreateAddress';
import FormPatchAddress from './FormPatchAddress';
import deleteItem from '../utility/deleteItem';

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
  const [description, setDescription] = useState();

  const [addressElement, setAddressElement] = useState();

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

  function getDescription(e) {
    setDescription(e);
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
          customerNumber: customerNumber,
          company: company,
          description: description,
          person: {
            firstName: firstname,
            lastName: lastname
          },
          email: email,
          phoneNumber: phone
        },
        { headers: { 'Content-Type': 'application/json' } }).then(async () => {
          console.log("addressElement", addressElement);
          if (addressElement != null) {
            await axios.patch(url + '/customers/' + id + '/addresses/' + customer.addresses.at(0).id,
              {
                country: addressElement.country,
                street: addressElement.street,
                streetNumber: addressElement.streetNumber,
                city: addressElement.city,
                zip: addressElement.zip,
                addressSuffix: addressElement.addressSuffix,
                addressType: addressElement.addressType,
              },
              { headers: { 'Content-Type': 'application/json' } })
          }

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
            <input placeholder={customer.company} type="text" name="company" onChange={getCompany} />
          </label>
          <label>
            Kundennummer
            <input placeholder={customer.customerNumber} type="number" name="customerNumber" min={100000} max={999999} onChange={getCustomerNumber} />
          </label>
        </div>
        <h3>Ansprechpartner</h3>
        <div className='form-row'>
          <label>
            Vorname
            <input placeholder={customer.firstName} type="text" name="firstname" onChange={getFirstname} />
          </label>
          <label>
            Nachname
            <input placeholder={customer.lastName} type="text" name="lastname" onChange={getLastname} />
          </label>
        </div>
        <div className='form-row'>
          <label>
            E-Mail-Adresse
            <input placeholder={customer.email} type="email" name="email" onChange={getEmail} />
          </label>
          <label>
            Telefonnummer
            <input placeholder={customer.phoneNumber} type="text" name="phone" onChange={getPhone} />
          </label>
        </div>
        <FormPatchAddress placeholder={address} addressElement={(elem) => { getAddressElement(elem) }} />
        <h3>Bemerkung</h3>
        <label>
          <input placeholder={description} type="text" name="description" onChange={getDescription} />
        </label>
        <div className='btn-wrapper'>
          <input className="btn primary" type="submit" value="Speichern" />
          <input className="btn red" type="button" value="Löschen" onClick={() => { deleteItem(url + "/customers/" + customer.id, (res) => { console.log(res); navigate("..", { relative: "path" }) }) }} />
          <input className="btn secondary" type="button" value="Abbrechen" onClick={() => { navigate("..", { relative: "path" }); }} />
        </div>
      </form>
    </div>
  )
}
