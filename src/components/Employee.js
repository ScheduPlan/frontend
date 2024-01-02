import React from 'react'
import popupStyle from './PopUp.module.css';
import roles from '../ROLES';


export default function Employee(props) {
  return (
    props.extended ?
      <>
        <h2>{props.object.firstName} {props.object.lastName}</h2>
        <div className={popupStyle.popup_details}>
          {props.object.user != null ?
            <>
              <p><b>E-Mail: </b>{props.object.user.email}</p>
              <p><b>Benutzername: </b>{props.object.user.username}</p>
              <p><b>Benutzerrolle: </b>{roles.find(role => role.role == props.object.user.role.toLowerCase()).title}</p>
            </>
            :
            <p>"Bitte wählen"</p>}

        </div>
        <div className={popupStyle.popup_details}>
          <p><b>Personalnummer: </b>{props.object.employeeNumber}</p>
          <p><b>Team: </b>{(props.object.team != null) ? props.object.team : "--aktuell keinem Team zugewiesen--"}</p>
        </div>
      </>
      : <div>
        <b>{props.object.firstName} {props.object.lastName} </b>
        {props.object.employeeNumber ? "(" + props.object.employeeNumber + ")" : ""}
      </div>

  )
}
