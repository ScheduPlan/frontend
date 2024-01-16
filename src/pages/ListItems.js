import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import url from '../BackendURL'
import { Link, useNavigate } from 'react-router-dom'
import style from './ListItems.module.css'
import PopUp from '../components/PopUp'
import Path from '../icons/Paths'
import AuthContext from '../AuthProvider'
import deleteItem, { deleteOrderWithEvents } from '../utility/deleteItem'

export default function ListItems(props) { //Kunden, Mitarbeiter, Aufträge?

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { items: ItemComponent } = props;
  const [itemObjects, setItemObjects] = useState([]);
  const [pathToItem, setPathToItem] = useState("");
  const [pathToEdit, setPathToEdit] = useState("");
  const [isPopUpOpen, setPopUpOpen] = useState(false);

  useEffect(() => {
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

  /**
   * toggles pop up & sets path to items and path to the edit forms
   * @param {*} item 
   */
  function togglePopUp(item) { // To Do: Id in Funktion mitgeben -> Wozu?
    if (isPopUpOpen || item.target?.nodeName == "svg") {
      setPopUpOpen(false);
    } else {

      switch (props.path) {
        case "/orders":
          setPathToItem(url + "/customers/" + item.customer.id + "/orders/" + item.id);
          break;
        case "/events":
          setPathToItem(url + "/customers/" + item.order.customer.id + "/orders/" + item.order.id + "/events/" + item.id);
          break;
        default:
          setPathToItem(url + props.path + "/" + item.id);
          break;
      }

      setPathToEdit('/' + user.user.role.toLowerCase() + props.path + "/" + item.id);

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
          {(props.path != "/events") ?
            <Link className='btn primary' to={'/' + user.user?.role.toLowerCase() + props.path + '/new'}>Neu +</Link>
            : ""}
        </div>

        <div className={style.item_wrapper}>
          {itemObjects.map((item, index) => {
            return (
              <div className={style.item} key={index} id={item.id} onClick={() => togglePopUp(item)}>
                <div className={style.item_content}>
                  <ItemComponent object={item} onClick={() => togglePopUp(item)} />
                </div>
                <div className={style.item_icons}>
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={() => { navigate('/' + user.user.role.toLowerCase() + props.path + "/" + item.id) }} id={item.id} className='btn-icon blue' width="24" height="24" viewBox="0 -960 960 960">
                    <path d={Path("edit")} />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={() => { (props.path == "/orders") ? deleteOrderWithEvents(props.pathToItem) : deleteItem(url + props.path + "/" + item.id) }} id={item.id} className='btn-icon red' width="24" height="24" viewBox="0 -960 960 960">
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
