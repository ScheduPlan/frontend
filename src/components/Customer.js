import React, { useEffect, useState } from 'react';
import popupStyle from './PopUp.module.css';

export default function Customer(props) {
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    setCustomer(props.object);
  }, [props.object]);

  return (
    props.extended ?
      <>
        <h2>{customer.company}</h2>
        <div className={popupStyle.popup_details}>
          <p><b>Kundennummer:</b> {customer.customerNumber} </p>
          <p><b>Ansprechpartner: </b>{customer.firstName} {customer.lastName}</p>
          {customer.email != "" ?
            <p><b>E-Mail:</b> {customer.email}</p> : ""}
          {customer.phoneNumber != "" ?
            <p><b>Telefon:</b> {customer.phoneNumber}</p> : ""}

          {customer.addresses != null ?
            customer.addresses.map(address => {
              return (
                <>
                  <p><b>Adresse:</b><br />
                    {address.zip} {address.city}<br />
                    {address.street} {address.streetNumber}<br />
                    {address.country}</p>
                </>
              )
            }) : ""}
        </div>
      </> :
      <div>
        <b>{customer.customerNumber}</b> {customer.company}
      </div>
  )
}
