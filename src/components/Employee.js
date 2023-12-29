import React from 'react'

export default function Employee(props) {
  console.log("EMP", props.object);
  console.log("ext", props);
  return (
    props.extended ? 
    <div>
      <p>Test</p>
      
    </div>
    : <div>
      <b>{props.object.firstName} {props.object.lastName}</b> 
      {props.object.employeeNumber ? "(" + props.object.employeeNumber + ")" : ""}
    </div>

  )
}
