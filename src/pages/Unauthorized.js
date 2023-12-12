import { useEffect } from 'react';

export default function Unauthorized() {

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    function goHome() {
        sessionStorage.clear();
        window.location.href = '/';
    }

    return (
        <div className="body">
            <div className="container_message">
                    <h1>Ups...</h1>
                    <p>Bei der Anmeldung ist etwas schief gelaufen. Bitte versuchen Sie es erneut.</p>
                    <input className="btn primary" type="button" value="Zurück zum Login" onClick={goHome} />
                </div>
        </div>
    )
}