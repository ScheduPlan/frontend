import React, { useEffect, useState } from 'react'
import TestUser from '../UserExample'
import axios from 'axios'
import url from '../BackendURL'
import { Link } from 'react-router-dom';

export default function ListItems(props) { //Kunden, Mitarbeiter, Aufträge?
  const [items, setItems] = useState([]);

  useEffect(() => {
    getItems();
  }, [props.items]);

  function getItems() {
    axios.get(url + "/customers")
      .then(response => {
        const itemData = response.data;
        setItems(itemData);
        console.log("Response ", response.data);
       logItems();
      });
  }

  function logItems() {
    console.log("Items", items);
  }

  return (
    <div className='content-container'>
      <div className='container-header-wrapper'>
        <h1>{props.h1}</h1>
        <Link className='btn primary' to={'/' + TestUser.role + '/' + props.items + '/new'}>Neu +</Link>
      </div>
      <div className='item_list_wrapper'>
        <p>List</p>
        {items.map((item) => {
          <div>
            <p>Hallo?</p>
            <h3>{item.name}</h3>
          </div>
        })}
      </div>
    </div>
  )
}
