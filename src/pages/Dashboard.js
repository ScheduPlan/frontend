import React, { useEffect } from 'react';
import TestUser, { roles } from '../UserExample';
import { Link, Outlet } from 'react-router-dom';

export default function Dashboard() {

    useEffect(() => {
        setContent();
    }, []);


    function setContent() {
        let content;
        if (window.location.href === "http://localhost:3000/" + TestUser.role.toLowerCase()) {
            content = (
                <div className='fancy-background'>
                    <div className='content-container'>
                        <h1>{TestUser.role} Dashboard</h1>
                        <div className='button-wrapper'>
                            {roles.find((r) => r.role === TestUser.role.toLowerCase()).links?.map((link, index) => (
                                <Link key={index} to={link.path} className="btn primary" replace>{link.title}</Link> //hier machts immer zwei Mal die Rolle
                            ))
                            }
                            <Link to='/password' className="btn primary" replace>Passwort ändern</Link>
                            <Link to='/' className="btn primary" replace>Logout</Link>
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
