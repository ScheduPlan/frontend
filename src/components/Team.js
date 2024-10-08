import React from 'react';
import popupStyle from './PopUp.module.css';

export default function Team(props) {
  return (
    props.extended ?
      <>
        <h2>Team {props.object.description?.name}</h2>
        {(props.object.description?.description != "") ?
          <p><b>Beschreibung: </b>{props.object.description?.description}</p> : ""}
        <div className={popupStyle.popup_details}>
          <p><b>Mitglieder: </b>{(props.subItem.length > 0) ? props.subItem.map((emp, index) => {
            return (
              ((props.subItem.length > 1) && (props.subItem.length - 1 > index)) ?
                emp.firstName + " " + emp.lastName + ", "
                :
                emp.firstName + " " + emp.lastName
            )
          }) : " -- aktuell keine Mitglieder zugewiesen --"}</p>
        </div>
      </> :
      <div>
        <b>Team {props.object.description?.name}</b> <br />
        {(props.object.description?.description != "") ?
          props.object.description?.description : ""}
      </div>
  )
}
