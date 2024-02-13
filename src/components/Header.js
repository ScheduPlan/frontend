import React, { useState, useRef, useContext } from 'react'
import style from './Header.module.css';
import Path from '../icons/Paths';
import Menue from './Menue';
import roles from '../ROLES';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthProvider';

export default function Header() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isMenueOpen, setMenueOpen] = useState(false);

    function toggleMenue(e) {
        if (isMenueOpen) {
            setMenueOpen(false);
        } else {
            setMenueOpen(true);
        }
    }

    /**
     * 
     * @param {*} e 
     * close menu onClick anywhere - not menue
     */
    /*const closeMenue = (e) => {
        if (isMenueOpen && !menueButton.current.contains(e.target)) {
            setMenueOpen(false);
            setMenueIcon("menue");
        }
    }*/

    //document.addEventListener('mousedown', closeMenue);

    return (
        <div className={style.header_wrapper}>
            <div className={style.header_content}>
                <button className='btn icon' onClick={() => { navigate('/' + user.user.role.toLowerCase()) }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960">
                        <path d={Path("home")} />
                    </svg>
                </button>
                <button className={'btn icon ' + (isMenueOpen ? " " + style.menueOpen : " ")} onClick={toggleMenue}>
                    <svg id={style.menue_icon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960">
                        <path d={Path("menue")} />
                    </svg>
                    <svg id={style.close_icon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960">
                        <path d={Path("close")} />
                    </svg>
                </button>

                <Menue isOpen={isMenueOpen} setOpen={(e) => setMenueOpen(e)} links={roles.find((r) => r.role === user.user.role.toLowerCase()).links} />
            </div>
        </div>
    )
}
