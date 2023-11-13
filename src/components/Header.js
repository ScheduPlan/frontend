import React, { useState, useRef } from 'react'
import style from './Header.module.css';
import Path from '../icons/Paths';
import Menue from './Menue';

export default function Header(props) {
    //const { auth, user } = useContext(AuthContext);
    const [isMenueOpen, setMenueOpen] = useState(false);
    const [menueIcon, setMenueIcon] = useState("menue");
    const menueButton = useRef(null);

    function toggleMenue() {
        if (isMenueOpen) {
            setMenueOpen(false);
            setMenueIcon("menue");
        } else {
            setMenueOpen(true);
            setMenueIcon("close");
        }
    }

    const closeMenue = (e)=>{
        if(isMenueOpen && !menueButton.current.contains(e.target)){
            setMenueOpen(false);
            setMenueIcon("menue");
        }
    }

    document.addEventListener('mousedown', closeMenue);

    return (
        <div className={style.header_wrapper}>
            <h1>{props.title}</h1>
            <svg ref={menueButton} onClick={toggleMenue} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 -960 960 960" fill="var(--primary)">
                <path d={Path(menueIcon)} />
            </svg>
            <Menue trigger={isMenueOpen} links={props.menueLinks} />
        </div>
    )
}
