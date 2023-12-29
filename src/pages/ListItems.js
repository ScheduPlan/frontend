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
  const [pathToItem, setPathToItem] = useState([]);
  const [isPopUpOpen, setPopUpOpen] = useState(false);

  useEffect(() => {
    getItemObjects();
  }, []);

  /**
   * get all Items from database for the list
   */
  function getItemObjects() {
    axios.get(url + props.path)
      .then(response => {
        const itemData = response.data;
        setItemObjects(itemData);
        console.log("Items", itemData);
      });
  }

  function togglePopUp(item) {
    if (isPopUpOpen) {
      setPopUpOpen(false);
    } else {
      setPathToItem(url +  props.path + "/" + item.target.id);
      setPopUpOpen(true);
    }
  }

  function editItem(event) {
    //navigate to PatchForm
    navigate('/' + user.user.role.toLowerCase() + props.path + "/" + event.target.id);
  }

  /**
   * To Do: Löschen!
   * deletes element from list & fire swal pop-up
   * @param {*} event 
   */
  function deleteItem2(event) {
    Swal.fire({
      title: "Sind Sie sicher, dass Sie dieses Element löschen möchten?",
      icon: "warning",
      iconColor: "#A50000AB",
      showCancelButton: true,
      confirmButtonColor: "var(--green)",
      cancelButtonColor: "var(--red)",
      cancelButtonText: "Nein",
      confirmButtonText: "Ja",
    }).then((result) => {
      if (result.isConfirmed) {
        if (props.path == "/orders") {
          //hier Fkt. in Adresse auslösen
          childRef.current && childRef.current.triggerFunctionInChild(event.target.id);

        } else {
          axios.delete(url + props.path + "/" + event.target.id);
        }

        Swal.fire({
          title: "Element gelöscht!",
          icon: "success",
          showConfirmButton: false,
        });

        setTimeout(function () {
          //window.location.reload();
        }, 2500);
      }
    });
  }

  return (
    <>
      <div className='content-container'>
        <div className='container-header-wrapper'>
          <h1>{props.h1}</h1>
          <Link className='btn primary' to={'/' + user.user.role.toLowerCase() + props.path + '/new'}>Neu +</Link>
        </div>

        <div className={style.item_wrapper}>
          {itemObjects.map((item, index) => {
            return (
              <div className={style.item} key={index} id={item.id} onClick={togglePopUp}>
                <div className={style.item_content}>
                  <ItemComponent ref={childRef} object={item} />
                </div>
                <div className={style.item_icons}>
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={editItem} id={item.id} className='btn-icon blue' width="24" height="24" viewBox="0 -960 960 960">
                    <path d={Path("edit")} />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={() => { deleteItem(props.path + "/" + item.id) }} id={item.id} className='btn-icon red' width="24" height="24" viewBox="0 -960 960 960">
                    <path d={Path("delete")} />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <PopUp trigger={isPopUpOpen} close={togglePopUp} type="userDetail" path={pathToItem} /> {/*To Do: Das mit dem PopUp öffnen & schließen anders regeln -> window eventlistener */}
    </>
  )
}
