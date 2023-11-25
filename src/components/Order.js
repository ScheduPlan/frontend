import React from 'react'
import axios from 'axios';
import url from '../BackendURL';

const Orders = React.forwardRef((props, ref) => {
  // Ref an die Elternkomponente übergeben
  React.useImperativeHandle(ref, () => ({
    triggerFunctionInChild,
  }));

  function triggerFunctionInChild(id) {
    console.log("Test", props.object.id);
    console.log("Test", props.object.customer.id);
    axios.delete(url + "/customer/" + props.object.customer.id + "/orders/" + id);
  }

  return (
    <div>{props.object.commissionNumber} {props.object.customer?.company}</div>
  )
});

export default Orders;