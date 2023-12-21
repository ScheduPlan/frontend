import React, { useState, useRef } from 'react'
import style from './Header.module.css';
import Path from '../icons/Paths';
import Menue from './Menue';
import TestUser, { roles } from '../UserExample';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    //const { auth, user } = useContext(AuthContext);
    const navigate = useNavigate();
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

    /**
     * 
     * @param {*} e 
     * close menu onClick anywhere - not menue
     */
    const closeMenue = (e) => {
        if (isMenueOpen && !menueButton.current.contains(e.target)) {
            setMenueOpen(false);
            setMenueIcon("menue");
        }
    }

    document.addEventListener('mousedown', closeMenue);

    return (
        <div className={style.header_wrapper}>
            <div className={style.header_content}>
                <button className='btn icon'>
                    <svg onClick={() => { navigate('/' + TestUser.role.toLowerCase()) }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960">
                        <path d={Path("home")} />
                    </svg>
                </button>
                <button className='btn icon'>
                    <svg ref={menueButton} onClick={toggleMenue} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960">
                        <path d={Path(menueIcon)} />
                    </svg>
                </button>
                <Menue trigger={isMenueOpen} links={roles.find((r) => r.role === TestUser.role.toLowerCase()).links} />
            </div>
        </div>
    )
}
