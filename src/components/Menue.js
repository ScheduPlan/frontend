import React from 'react';
import style from './Menue.module.css';
import user from '../UserExample';
import { Link } from 'react-router-dom';
import TestUser, { roles } from '../UserExample';

export default function Menue(props) {

    function logout() {
        sessionStorage.clear();
        //navigate('/', {replace: true});
        window.location.href = '/';
    }

    return (
        <div className={style.menue_wrapper} state={props.trigger ? "open" : ""}>    
            <p><b>{TestUser.firstname} {TestUser.lastname}</b></p>
            <div className={style.menue_links}>
                <Link to={'/' + TestUser.role.toLowerCase()} replace>Dashboard</Link>
                {roles.find((r) => r.role === TestUser.role.toLowerCase()).links.map((link, index) => (
                    <Link key={index} to={'/' + TestUser.role.toLowerCase() + '/' + link.path}>{link.title}</Link>
                ))}
                <Link to='/password' replace>Passwort ändern</Link>
                <Link onClick={logout} to='/' replace>Logout</Link>
            </div>
        </div>
    )
}
