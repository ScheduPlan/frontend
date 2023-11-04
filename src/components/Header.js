import React, { useContext } from 'react'
import AuthContext from '../AuthProvider';
import { Link } from 'react-router-dom';
import style from './Header.module.css';

export default function Header(props) {
    const { auth, user } = useContext(AuthContext);

    return (
        <div className={style.header_wrapper}>
            <h1>{props.title}</h1>
            <Link to="/">Benutzername</Link>
        </div>
    )
}
