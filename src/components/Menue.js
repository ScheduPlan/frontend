import React, {useContext} from 'react';
import style from './Menue.module.css';
import { Link, useNavigate } from 'react-router-dom';
import roles from '../ROLES';
import AuthContext from '../AuthProvider';
import logout from '../utility/logout';


export default function Menue(props) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    return (
        <div className={style.menue_wrapper + (props.isOpen ? " " + style.open : " ")}>    
            <p><b>{user.firstName} {user.lastName}</b></p>
            <div className={style.menue_links}>
                <Link to={'/' + user.user.role.toLowerCase()} replace>Dashboard</Link>
                {roles.find((r) => r.role === user.user.role.toLowerCase()).links.map((link, index) => (
                    <Link key={index} to={'/' + user.user.role.toLowerCase() + '/' + link.path}>{link.title}</Link>
                ))}
                <Link to='/password' replace>Passwort ändern</Link>
                <Link onClick={() => {logout(() => navigate("/")); }} to='/' replace>Logout</Link>
            </div>
        </div>
    )
}
