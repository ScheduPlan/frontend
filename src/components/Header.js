import React, { useContext, useState } from 'react'
import AuthContext from '../AuthProvider';
import { Link } from 'react-router-dom';
import style from './Header.module.css';
import Path from '../icons/Paths';
import user from '../UserExample'; //später raus
import {test} from './PopUp';
import Menue from './Menue';

export default function Header(props) {
    //const { auth, user } = useContext(AuthContext);
    const [isMenueOpen, setMenueOpen] = useState(false);
    const [menueIcon, setMenueIcon] = useState("menue");

    function toggleMenue() {
        if (isMenueOpen) {
            setMenueOpen(false);
            setMenueIcon("menue");
        } else {
            setMenueOpen(true);
            setMenueIcon("close");
        }
    }

    const links = [
        {
            path: "/",
            title: "Test"
        },
        {
            path: "/",
            title: "Test1"
        },
    ]

    return (
        <div className={style.header_wrapper}>
            <h1 onClick={test}>{props.title}</h1>
            <svg onClick={toggleMenue} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 -960 960 960" fill="var(--primary)">
                <path d={Path(menueIcon)} />
            </svg>
            <Menue trigger={isMenueOpen} links={links} />
        </div>
    )
}
