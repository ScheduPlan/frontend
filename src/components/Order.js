import React from 'react';
import popupStyle from './PopUp.module.css';

export default function Order(props) {
  return (
    props.extended ?
      <>
        <h2>{props.object.commissionNumber} {props.object.customer?.company}</h2>
        <div className={popupStyle.popup_details}>
          <p><b>Ansprechpartner: </b>{props.object.customer?.firstName} {props.object.customer?.lastName}</p>
          <p><b>Gewicht: </b>{props.object.weight}kg</p>
        </div>
      </> :
      <div>
        {props.object.commissionNumber} {props.object.customer?.company}
      </div>
  )
}