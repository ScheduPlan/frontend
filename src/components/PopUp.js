import React, { useContext, useEffect, useState, useRef } from 'react';
import style from './PopUp.module.css';
import Path from '../icons/Paths';
import axios from 'axios';
import Employee from './Employee';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthProvider';
import deleteItem from '../utility/deleteItem';
import Team from './Team';

export default function PopUp(props) {
    const [item, setItem] = useState({});
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);


    useEffect(() => {
        console.log("Hier!!", props.pathToItem);
        if (props.trigger) {
            axios.get(props.pathToItem).then(res => {
                setItem(res.data);
            });
        }
    }, [props.pathToItem]);

    function renderContent2() {
        if (props.type === "dateDetail") {
            return (
                <div className={style.popup_content}>
                    <h2>{props.appointment.title}</h2>
                    <div className={style.popup_details}>
                        <p><b>Datum: </b>{props.appointment.start.toUTCString()}</p>
                    </div>
                </div>
            )
        }
    }

    function renderContent() {
        switch (props.path) {
            case "/employees":
                return (
                    <Employee extended object={item} />
                )
                break;
            case "/teams":
                return (
                    <Team extended object={item} />
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
