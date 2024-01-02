import React, { useContext, useEffect, useState } from 'react';
import style from './PopUp.module.css';
import Path from '../icons/Paths';
import axios from 'axios';
import Employee from './Employee';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthProvider';
import deleteItem from '../utility/deleteItem';

export default function PopUp(props) {
    const [item, setItem] = useState({});
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (props.trigger) {
            axios.get(props.pathToItem).then(res => {
                return (
                    setItem(res.data)
                );
            });
        }
    }, [props.pathToItem]);

    function renderContent() {
        if (props.type === "remove") {
            return (
                <div className={style.popup_content}>
                    <p>Sind Sie sicher, dass Sie den Termin aus dem Kalender entfernen möchten?</p>
                    <div className='button_wrapper'>
                        <input className="btn primary" type="submit" value="Ja" />
                        <input className="btn primary" type="submit" value="Nein" />
                    </div>
                </div>
            )
        } else if (props.type === "delete") {
            return (
                <div className={style.popup_content}>
                    <p>Sind Sie sicher, dass Sie den Termin löschen möchten?</p>
                    <div className='button_wrapper'>
                        <input className="btn primary" type="submit" value="Ja" />
                        <input className="btn primary" type="submit" value="Nein" />
                    </div>
                </div>
            )
        } else if (props.type === "dateDetail") {
            return (
                <div className={style.popup_content}>
                    <h2>{props.appointment.title}</h2>
                    <div className={style.popup_details}>
                        <p><b>Datum: </b>{props.appointment.start.toUTCString()}</p>
                    </div>
                </div>
            )
        } else if (props.type === "userDetail") {
            return (
                <div className={style.popup_content}>
                    <Employee extended object={item} />
                </div>
            )
        }
    }

    return (props.trigger ?
        <div className={style.popup_wrapper}>
            <div className={style.popup_content_wrapper}>
                <svg onClick={props.close} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 -960 960 960" fill="var(--grey-dark)">
                    <path d={Path("close")} />
                </svg>
                {renderContent()}
                <div className='btn-wrapper'>
                    {props.pathToEdit != null ? <button onClick={() => { navigate(props.pathToEdit) }} className='btn secondary'>Bearbeiten</button> : ""}
                    {props.pathToItem != null ? <button onClick={() => { deleteItem(props.pathToItem) }} className='btn red'>Löschen</button> : ""}
                </div>
            </div>
        </div> : ""
    )
}
