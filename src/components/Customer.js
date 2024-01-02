import React from 'react';
import popupStyle from './PopUp.module.css';

export default function Customer(props) {
  return (
    props.extended ?
      <>
      {console.log(props.object)}
        <h2>{props.object.customerNumber} {props.object.company}</h2>
        <div className={popupStyle.popup_details}>
          <p><b>Ansprechpartner: </b>{props.object.firstName} {props.object.lastName}</p>
        </div>
      </> :
      <div>
        {props.object.customerNumber} {props.object.company}
      </div>
  )
}
