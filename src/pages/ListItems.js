import React, { useEffect, useState, useRef } from 'react'
import TestUser from '../UserExample'
import axios from 'axios'
import url from '../BackendURL'
import { Link, useNavigate } from 'react-router-dom'
import style from './ListItems.module.css'
import PopUp from '../components/PopUp'
import Path from '../icons/Paths'
import Swal from 'sweetalert2'

export default function ListItems(props) { //Kunden, Mitarbeiter, Aufträge?

  const navigate = useNavigate();
  // Ref für die Kindkomponente erstellen
  const childRef = useRef(null);

  const { items: ItemComponent } = props;
  const [itemObjects, setItemObjects] = useState([]);
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

  function togglePopUp() {
    if (isPopUpOpen) {
      setPopUpOpen(false);
    } else {
      setPopUpOpen(true);
    }
  }

  function editItem(event) {
    //navigate to PatchForm
    navigate('/' + TestUser.role + props.path + "/" + event.target.id);
  }

  /**
   * deletes element from list & fire swal pop-up
   * @param {*} event 
   */
  function deleteItem(event) {
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
          <Link className='btn primary' to={'/' + TestUser.role + props.path + '/new'}>Neu +</Link>
        </div>

        <div className={style.item_wrapper}>
          {itemObjects.map((item, index) => {
            return (
              <div className={style.item} key={index}>
                <div className={style.item_content}>
                  <ItemComponent ref={childRef} object={item} />
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
