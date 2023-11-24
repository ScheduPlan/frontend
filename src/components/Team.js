import React from 'react'

export default function Team(props) {
  return (
    <>
      <h3>Team {props.object.description.name}</h3>
      {(props.object.description.description != "") ?
        <p>{props.object.description.description}</p> : ""}
    </>
  )
}
