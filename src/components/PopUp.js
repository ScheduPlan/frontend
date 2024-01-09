import React, { useEffect, useState } from 'react';
import style from './PopUp.module.css';
import Path from '../icons/Paths';
import axios from 'axios';
import Employee from './Employee';
import { useNavigate } from 'react-router-dom';
import deleteItem from '../utility/deleteItem';
import Team from './Team';
import Customer from './Customer';
import Order from './Order';

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
            default:
                break;
        }
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
                    {props.pathToItem != null ? <button onClick={() => { deleteItem(props.pathToItem) }} className='btn red'>Löschen</button> : ""}
                </div>
            </div>
        </div> : ""
    )
}
