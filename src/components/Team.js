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
      <div>
        <b>Team {props.object.description?.name}</b> <br />
        {(props.object.description?.description != "") ?
          props.object.description?.description : ""}
      </div>
  )
}
