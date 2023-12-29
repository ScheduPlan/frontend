import React, { useEffect, useState } from 'react';
import style from './PopUp.module.css';
import Path from '../icons/Paths';
import axios from 'axios';
import Employee from './Employee';
import { render } from '@testing-library/react';

export default function PopUp(props) {
    const [item, setItem] = useState({});

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
            axios.get(props.path).then(res => {
                return (
                    setItem(res.data)
                );
            });
            return (
                <div className={style.popup_content}>
                    <h2>{item.firstName} {item.lastName}</h2>
                    <div className={style.popup_details}>
                        <p><b>Personalnummer: </b>{item.employeeNumber}</p>
                    </div>
                </div>
            )
        }
    }

    return (props.trigger ?
        <div className={style.popup_wrapper}>
            <div className={style.popup_content_wrapper}>
            <svg onClick={props.close} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 -960 960 960" fill="var(--primary)">
                <path d={Path("close")} />
            </svg>
            {renderContent()}
            </div>
        </div> : ""
    )
}
