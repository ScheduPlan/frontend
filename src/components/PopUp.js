import React, { useEffect, useState } from 'react';
import style from './PopUp.module.css';
import Path from '../icons/Paths';
import axios from 'axios';
import Employee from './Employee';
import { useNavigate } from 'react-router-dom';
import url from '../BackendURL';
import deleteItem from '../utility/deleteItem';
import Team from './Team';
import Customer from './Customer';
import Order from './Order';
import Event from './Event';
import Swal from 'sweetalert2';

export default function PopUp(props) {
    const navigate = useNavigate();
    const { events, path, pathToItem, pathToEdit, updateItemObjects, updateEvents, close, trigger } = props

    const [item, setItem] = useState({});
    const [subItem, setSubItem] = useState({});

    useEffect(() => {
        renderContent();
    }, [item, events]);

    useEffect(() => {
        if (pathToItem != null && pathToItem != "") {
            axios.get(pathToItem).then(res => {
                setItem(res.data);
            });
            if (path == "/teams") {
                axios.get(pathToItem + "/members").then(res => {
                    setSubItem(res.data);
                });
            }
        }
    }, [pathToItem]);

    function renderContent() {
        switch (path) {
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
                    <Event extended object={item} updateEvents={updateEvents} />
                )
            default:
                break;
        }
    }

    /**
   * switch case to delete a certain item
   * @param {*} item 
   */
    async function deleteFct() {
        switch (path) {
            case "/events":
                axios.patch(url + "/customers/" + item.order.customer.id + "/orders/" + item.order.id,
                    {
                        state: "PLANNED"
                    }, { headers: { 'Content-Type': 'application/json' } });

                deleteItem(pathToItem, updateItemObjects, (error) => {
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
                deleteItem(pathToItem, updateItemObjects, (error) => {
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
        close();
    }

    return (trigger ?
        <div className={style.popup_wrapper}>
            <div className={style.popup_content_wrapper}>
                <svg onClick={close} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 -960 960 960" fill="var(--grey-dark)">
                    <path d={Path("close")} />
                </svg>
                <div className={style.popup_content}>
                    {renderContent()}
                </div>
                <div className='btn-wrapper'>
                    {pathToEdit != null ? <button onClick={() => { navigate(pathToEdit) }} className='btn secondary'>Bearbeiten</button> : ""}
                    {pathToItem != null ? <button onClick={deleteFct} className='btn red'>Löschen</button> : ""}
                </div>
            </div>
        </div> : ""
    )
}
