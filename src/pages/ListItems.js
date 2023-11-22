import React, { useEffect, useState } from 'react'
import TestUser from '../UserExample'
import axios from 'axios'
import url from '../BackendURL'
import { Link } from 'react-router-dom'
import style from './ListItems.module.css'
import PopUp from '../components/PopUp'
import Path from '../icons/Paths'

export default function ListItems(props) { //Kunden, Mitarbeiter, Aufträge?
  const { items: ItemComponent } = props;
  const [itemObjects, setItemObjects] = useState([]);
  const [isPopUpOpen, setPopUpOpen] = useState(false);

  function togglePopUp() {
    if (isPopUpOpen) {
      setPopUpOpen(false);
    } else {
      setPopUpOpen(true);
    }
  }

  useEffect(() => {
    getItemObjects();
  }, []);

  function getItemObjects() {
    axios.get(url + props.path)
      .then(response => {
        const itemData = response.data;
        setItemObjects(itemData);
        console.log("Response ", response.data);
      });
  }

  function editItem(event) {
    console.log(event.target.id);
    const id = event.target.id;
    console.log(id);
  }

  function deleteItem(event) {
    console.log(event.target.id);
    const id = event.target.id;
    console.log(id);
    axios.delete(url + props.path + "/" + id);
  }

  return (
    <>
      <div className='content-container'>
        <div className='container-header-wrapper'>
          <h1>{props.h1}</h1>
          <Link className='btn primary' to={'/' + TestUser.role + props.path + '/new'}>Neu +</Link>
        </div>

        <div className={style.item_wrapper}>
          {itemObjects.map((item, index) => {
            return (
              <div className={style.item} key={index}>
                <div className={style.item_content}>
                  <ItemComponent object={item} />
                </div>
                <div className={style.item_icons}>
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={editItem} id={item.id} className='btn-icon blue' width="24" height="24" viewBox="0 -960 960 960">
                    <path d={Path("edit")} />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={deleteItem} id={item.id} className='btn-icon red' width="24" height="24" viewBox="0 -960 960 960">
                    <path d={Path("delete")} />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <PopUp trigger={isPopUpOpen} close={togglePopUp} type="remove" /> {/*To Do: Das mit dem PopUp öffnen & schließen anders regeln -> window eventlistener */}
    </>
  )
}
