import React, { useEffect, useState } from 'react';
import style from './PopUp.module.css';
import Path from '../icons/Paths';
import axios from 'axios';
import Employee from './Employee';
import { useNavigate } from 'react-router-dom';
import url from '../BackendURL';
import deleteItem, { deleteOrderWithEvents } from '../utility/deleteItem';
import Team from './Team';
import Customer from './Customer';
import Order from './Order';
import Event from './Event';

export default function PopUp(props) {
    const navigate = useNavigate();

    const [item, setItem] = useState({});
    const [subItem, setSubItem] = useState({});

    useEffect(() => {
        if (props.pathToItem != null && props.pathToItem != "") {
            axios.get(props.pathToItem).then(res => {
                setItem(res.data);
            });
            if (props.path == "/teams") {
                axios.get(props.pathToItem + "/members").then(res => {
                    setSubItem(res.data);
                });
            }
        }
    }, [props.pathToItem]);

    function renderContent() {
        switch (props.path) {
            case "/employees":
                return (
                    <Employee extended object={item} />
                )
                break;
            case "/teams":
                return (
                    <Team extended object={item} subItem={subItem} />
                )
            case "/customers":
                return (
                    <Customer extended object={item} />
                )
            case "/orders":
                return (
                    <Order extended object={item} />
                )
            case "/events":
                return (
                    <Event extended object={item} />
                )
            default:
                break;
        }
    }

    /**
   * switch case to delete a certain item
   * @param {*} item 
   */
    function deleteFct() {
        switch (props.path) {
          case "/orders":
            deleteOrderWithEvents(props.pathToItem);
            break;
          case "/events":
            axios.patch(url + "/customers/" + item.order.customer.id + "/orders/" + item.order.id,
              {
                state: "PLANNED"
              }, { headers: { 'Content-Type': 'application/json' } });
              deleteItem(props.pathToItem);
          default:
            deleteItem(props.pathToItem);
            break;
        }
        props.close();
        props.updateItemObjects();
      }

    return (props.trigger ?
        <div className={style.popup_wrapper}>
            <div className={style.popup_content_wrapper}>
                <svg onClick={props.close} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 -960 960 960" fill="var(--grey-dark)">
                    <path d={Path("close")} />
                </svg>
                <div className={style.popup_content}>
                    {renderContent()}
                </div>
                <div className='btn-wrapper'>
                    {props.pathToEdit != null ? <button onClick={() => { navigate(props.pathToEdit) }} className='btn secondary'>Bearbeiten</button> : ""}
                    {props.pathToItem != null ? <button onClick={deleteFct} className='btn red'>Löschen</button> : ""}
                </div>
            </div>
        </div> : ""
    )
}
