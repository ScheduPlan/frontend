import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import url from '../BackendURL'
import { Link, useNavigate } from 'react-router-dom'
import style from './ListItems.module.css'
import PopUp from '../components/PopUp'
import Path from '../icons/Paths'
import AuthContext from '../AuthProvider'
import deleteItem from '../utility/deleteItem'
import Swal from 'sweetalert2'

export default function ListItems(props) {

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { items: ItemComponent } = props;
  const [itemObjects, setItemObjects] = useState([]);
  const [pathToItem, setPathToItem] = useState("");
  const [pathToEdit, setPathToEdit] = useState("");
  const [isPopUpOpen, setPopUpOpen] = useState(false);

  useEffect(() => {
    getItemObjects();
  }, []);

  useEffect(() => {
    //setContent();
  }, [itemObjects]);

  /**
   * gets all Items from database for the list
   */
  function getItemObjects() {
    axios.get(url + props.path)
      .then(res => {
        setItemObjects(res.data);
      });
  }

  /**
   * updates itemObjects
   */
  async function updateItemObjects() {
    await axios.get(url + props.path)
      .then(res => {
        //setItemObjects(res.data);
        setItemObjects([...res.data]);
      });
  }

  /**
   * toggles pop up & sets path to items and path to the edit forms
   * @param {*} item 
   */
  function togglePopUp(item) { // To Do: Id in Funktion mitgeben -> Wozu?
    if (isPopUpOpen) {
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
      setPopUpOpen(true);
    }
  }

  /**
   * switch case to delete a certain item
   * @param {*} item 
   */
  async function deleteFct(item) {
    switch (props.path) {
      case "/orders":
        deleteItem(url + "/customers/" + item.customer.id + "/orders/" + item.id, updateItemObjects, (error) => {
          Swal.fire({
            position: 'top',
            title: error,
            icon: "error",
            confirmButtonText: "Ok",
            confirmButtonColor: "var(--error)",
            timer: 2000
          })
        });
        break;
      case "/events":
        axios.patch(url + "/customers/" + item.order.customer.id + "/orders/" + item.order.id,
          {
            state: "PLANNED"
          }, { headers: { 'Content-Type': 'application/json' } });

        deleteItem(props.pathToItem, updateItemObjects, (error) => {
          Swal.fire({
            position: 'top',
            title: error,
            icon: "error",
            confirmButtonText: "Ok",
            confirmButtonColor: "var(--error)",
            timer: 2000
          })
        });

      default:
        deleteItem(url + props.path + "/" + item.id, updateItemObjects, (error) => {
          Swal.fire({
            position: 'top',
            title: error,
            icon: "error",
            confirmButtonText: "Ok",
            confirmButtonColor: "var(--error)",
            timer: 2000
          })
        });
        break;
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
          {itemObjects.filter(item => item.firstName != "Administrator" && item.id != user.id).map((item, index) => {
            return (
              <div className={style.item} key={index} id={item.id}>
                <div className={style.item_content} onClick={() => togglePopUp(item)}>
                  <ItemComponent object={item} />
                </div>
                <div className={style.item_icons}>
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={() => { navigate('/' + user.user.role.toLowerCase() + props.path + "/" + item.id) }} id={item.id} className='btn-icon blue' width="24" height="24" viewBox="0 -960 960 960">
                    <path d={Path("edit")} />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={() => deleteFct(item)} id={item.id} className='btn-icon red' width="24" height="24" viewBox="0 -960 960 960">
                    <path d={Path("delete")} />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <PopUp trigger={isPopUpOpen} close={togglePopUp} path={props.path} pathToItem={pathToItem} pathToEdit={pathToEdit} updateItemObjects={getItemObjects} /> {/*To Do: Das mit dem PopUp öffnen & schließen anders regeln -> window eventlistener */}
    </>
  )
}
