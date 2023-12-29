import React from 'react'

export default function Employee(props) {
  console.log("employee", props);
  return (
    <div><b>{props.object.firstName} {props.object.lastName}</b> {props.object.employeeNumber ? "(" + props.object.employeeNumber + ")" : ""}</div>
  )
}
