import React from 'react';
import style from './Menue.module.css';
import user from '../UserExample';
import { Link } from 'react-router-dom';

export default function Menue(props) {
    return (props.trigger ?
        <div className={style.menue_wrapper}>
            <p><b>{user.name}</b></p>
            <div className={style.menue_links}>
                {props.links?.map((link) => (
                    <Link to={link.path}>{link.title}</Link>
                ))}
                <Link to='/password'>Passwort ändern</Link>
                <Link to='/'>Logout</Link>
            </div>
        </div> : ""
    )
}
