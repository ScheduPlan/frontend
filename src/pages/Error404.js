import React from 'react';
import TestUser from '../UserExample.js';

export default function Error404() {
  return (
    <div className='content-container'>
      <h1>Error404</h1>
      <input type='button' className='btn primary' onClick={() => {TestUser.role != null ? window.location.href = "/" + TestUser.role.toLowerCase() : window.location.href = "/"}} value="zurück zum Dashboard" />
    </div>
  )
}
