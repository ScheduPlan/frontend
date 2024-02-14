import React, {useContext, useEffect, useState} from 'react';
import style from './Menue.module.css';
import { Link, useNavigate } from 'react-router-dom';
import roles from '../ROLES';
import AuthContext from '../AuthProvider';
import logout from '../utility/logout';
import axios from 'axios';
import url from '../BackendURL';
import deleteAccount from '../utility/deleteAccount';


export default function Menue(props) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [team, setTeam] = useState();

    useEffect(() => {
        if(user.user?.role == "FITTER") {
            axios.get(url + "/teams/" + user.teamId).then(res => setTeam(res.data));
        }
    }, []);

    return (
        <div className={style.menue_wrapper + (props.isOpen ? " " + style.open : " ")}>    
            <p><b>{user.firstName} {user.lastName}</b>
            {team != null ? 
                <><br />Team: {team.description?.name}</> : ""}</p>
            <div className={style.menue_links}>
                <Link to={'/' + user.user.role.toLowerCase()} onClick={() => props.setOpen(false)} replace>Dashboard</Link>
                {roles.find((r) => r.role === user.user.role.toLowerCase()).links.map((link, index) => (
                    <Link key={index} to={'/' + user.user.role.toLowerCase() + '/' + link.path} onClick={() => props.setOpen(false)} replace>{link.title}</Link>
                ))}
                <Link to='/password' onClick={() => props.setOpen(false)} replace>Passwort ändern</Link>
                <Link onClick={logout} to='/' replace>Logout</Link>
                {user.user.role != "FITTER" ? <Link className="red" onClick={() => deleteAccount(user)} to='/' replace>Account löschen</Link> : ""}
            </div>
        </div>
    )
}
