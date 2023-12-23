import React, { useEffect, useContext } from 'react';
import roles from '../ROLES';
import { Link, Outlet } from 'react-router-dom';
import AuthContext from '../AuthProvider';
import logout from '../utility/logout';

export default function Dashboard() {

    const { setAuth, user, auth } = useContext(AuthContext);

    useEffect(() => {
        setContent();
    }, [user]);


    function setContent() {
        let content;
        if (window.location.href == "http://localhost:3000/" + user?.user?.role.toLowerCase()) {
            content = (
                <div className='fancy-background'>
                    <div className='content-container'>
                        <h1>{user.user.role} Dashboard</h1>
                        <div className='button-wrapper'>
                            {roles.find((r) => r.role === user.user.role.toLowerCase()).links?.map((link, index) => (
                                <Link key={index} to={link.path} className="btn primary" replace>{link.title}</Link> //hier machts immer zwei Mal die Rolle
                            ))
                            }
                            <Link to='/password' className="btn primary" replace>Passwort ändern</Link>
                            <Link className="btn primary" onClick={logout} to='/' replace>Logout</Link>
                        </div>

                        <Outlet />
                    </div>
                </div>
            )
        }
        return content;
    }

    return (
        setContent()
    )
}
