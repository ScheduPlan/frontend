import React from 'react';
import style from './Menue.module.css';
import user from '../UserExample';
import { Link } from 'react-router-dom';
import TestUser, { roles } from '../UserExample';

export default function Menue(props) {
    return (
        <div className={style.menue_wrapper} state={props.trigger ? "open" : ""}>    
            <p><b>{user.name}</b></p>
            <div className={style.menue_links}>
                <Link to={'/' + TestUser.role} replace>Dashboard</Link>
                {roles.find((r) => r.role === TestUser.role).links.map((link, index) => (
                    <Link key={index} to={link.path}>{link.title}</Link>
                ))}
                <Link to='/password' replace>Passwort ändern</Link>
                <Link to='/' replace>Logout</Link>
            </div>
        </div>
    )
}
