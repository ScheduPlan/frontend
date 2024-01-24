import React, { useEffect, useState } from 'react';
import popupStyle from './PopUp.module.css';

export default function Order(props) {
  const [order, setOrder] = useState({});

  useEffect(() => {
    setOrder(props.object);
  }, [props.object]);

  console.log(props.object);
  return (
    props.extended ?
      <>
        <h2>Auftragsnummer {order.number}</h2>
        <div className={popupStyle.popup_details}>
          <p><b>Kommisionsnummer: </b>{order.commissionNumber}</p>
          <p><b>Kunde: </b>{order.customer?.customerNumber} {order.customer?.company}</p>
          <p><b>Ansprechpartner: </b>{order.customer?.firstName} {order.customer?.lastName}</p>
          <p><b>Gewicht: </b>{order.weight}kg</p>
          <p><b>Geschätzte Dauer: </b>{order.plannedDuration}h</p>
          <p><b>Team: </b>{order.team?.description?.name}</p>
        </div>
      </> :
      <div>
        <b>{order.number}</b> {order.customer?.company} ({order.customer?.customerNumber})
      </div>
  )
}