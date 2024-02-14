import React, { useContext } from 'react';
import AuthContext from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Error404() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  function redirect() {
    if (user.role != null) {
      navigate("/" + user.role);
    } else {
      navigate("/");
    }
  }

  return (
    <div className='content-container'>
      <h1>Error404</h1>
      <input type='button' className='btn primary' onClick={redirect} value="zurück zum Dashboard" />
    </div>
  )
}
