import React, { useEffect, useState, useRef, useContext } from 'react'
import TestUser from '../UserExample'
import axios from 'axios'
import url from '../BackendURL'
import { Link, useNavigate } from 'react-router-dom'
import style from './ListItems.module.css'
import PopUp from '../components/PopUp'
import Path from '../icons/Paths'
import Swal from 'sweetalert2'
import AuthContext from '../AuthProvider'
import deleteItem from '../utility/deleteItem'

export default function ListItems(props) { //Kunden, Mitarbeiter, Aufträge?

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Ref für die Kindkomponente erstellen
  const childRef = useRef(null);

  const { items: ItemComponent } = props;
  const [itemObjects, setItemObjects] = useState([]);
  const [pathToItem, setPathToItem] = useState("");
  const [pathToEdit, setPathToEdit] = useState("");
  const [isPopUpOpen, setPopUpOpen] = useState(false);

  const [customerIds, setCustomerIds] = useState([]);

  useEffect(() => {
    console.log("USER", user);
    setCustomerIds([]);
    getItemObjects();
  }, [user, props.path]);

  /**
   * get all Items from database for the list
   */
  function getItemObjects() {
    axios.get(url + props.path)
      .then(response => {
        setItemObjects(response.data);
      });
  }

  function togglePopUp(item) {
    if (isPopUpOpen || item.target.nodeName == "svg") {
      setPopUpOpen(false);
    } else {
      if (props.path == "/orders") {
        const customerId = itemObjects.find(elem => elem.id == item.target.id).customer.id;
        setPathToItem(url + "/customers/" + customerId + props.path + "/" + item.target.id);
      } else {
        setPathToItem(url + props.path + "/" + item.target.id);
      }
      setPathToEdit('/' + user.user.role.toLowerCase() + props.path + "/" + item.target.id);
      setTimeout(() => {
        setPopUpOpen(true);
      }, 250);
    }
  }

  return (
    <>
      <div className='content-container'>
        <div className='container-header-wrapper'>
          <h1>{props.h1}</h1>
          <Link className='btn primary' to={'/' + user.user?.role.toLowerCase() + props.path + '/new'}>Neu +</Link>
        </div>

        <div className={style.item_wrapper}>
          {itemObjects.map((item, index) => {
            return (
              <div className={style.item} key={index} id={item.id} onClick={togglePopUp}>
                <div className={style.item_content}>
                  <ItemComponent ref={childRef} object={item} />
                </div>
                <div className={style.item_icons}>
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={() => { navigate('/' + user.user.role.toLowerCase() + props.path + "/" + item.id) }} id={item.id} className='btn-icon blue' width="24" height="24" viewBox="0 -960 960 960">
                    <path d={Path("edit")} />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={() => { deleteItem(url + props.path + "/" + item.id) }} id={item.id} className='btn-icon red' width="24" height="24" viewBox="0 -960 960 960">
                    <path d={Path("delete")} />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <PopUp trigger={isPopUpOpen} close={togglePopUp} path={props.path} pathToItem={pathToItem} pathToEdit={pathToEdit} /> {/*To Do: Das mit dem PopUp öffnen & schließen anders regeln -> window eventlistener */}
    </>
  )
}
