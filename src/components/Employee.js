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
              <p><b>Personalnummer: </b>{props.object.employeeNumber}</p>
              <p><b>E-Mail: </b>{props.object.user.email}</p>
              <p><b>Benutzername: </b>{props.object.user.username}</p>
              <p><b>Benutzerrolle: </b>{roles.find(role => role.role == props.object.user.role.toLowerCase()).title}</p>
            </>
            :
            <p>"Bitte wählen"</p>}
          {(props.object.user?.role == "FITTER") ?
            (
              (props.object.team != null) ?
                <p>
                  <b>Team: </b>
                  {props.object.team.description.name}
                  {(props.object.team.description.description != "") ?
                    " (" + props.object.team.description.description + ")" : ""
                  }
                </p> : "--aktuell keinem Team zugewiesen--"
            ) : ""
          }
        </div>
      </>
      : <div>
        <b>{props.object.employeeNumber} </b>
        {props.object.firstName} {props.object.lastName}
      </div>
  )
}
