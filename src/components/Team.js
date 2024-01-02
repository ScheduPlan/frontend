import React from 'react';
import popupStyle from './PopUp.module.css';

export default function Team(props) {
  return (
    props.extended ?
      <>
        <h2>Team {props.object.description?.name}</h2>
        {(props.object.description?.description != "") ?
          <p>{props.object.description?.description}</p> : ""}
        <div className={popupStyle.popup_details}>
          <p><b>Mitglieder: </b></p>
        </div>
      </> :
      <>
        <h3>Team {props.object.description?.name}</h3>
        {(props.object.description?.description != "") ?
          <p>{props.object.description?.description}</p> : ""}
      </>
  )
}
