import React from 'react'

export default function Employee(props) {
  console.log("employee", props);
  return (
    <div>{props.object.firstName} {props.object.lastName} {props.object.employeeNumber ? "- {props.object.employeeNumber}" : ""}</div>
  )
}
