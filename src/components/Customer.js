import React from 'react'

export default function Customer(props) {
  return (
    <>
        <h3>{props.object.customerNumber} {props.object.company}</h3>
        <p>{props.object.firstname} {props.object.lastname}</p>
    </>
  )
}
