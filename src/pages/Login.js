import '../index.css';
import style from './Login.module.css';
import { Link } from 'react-router-dom';


export default function Login() {
   
    function submitForm(e) {
        e.preventDefault();
        alert("Sende Formular. Melde User an.");
    };

    return (
        <div className={style.login_wrapper} >
            <h1>Login</h1>
            <form onSubmit={submitForm}>
                <label>
                    Benutzername oder E-Mail-Adresse:
                    <input type="text" name="name" />
                </label>
                <label>
                    Passwort:
                    <input type="password" name="name" />
                </label>
                <input className="btn primary" type="submit" value="Anmelden" />
                <Link to="/assembler-dashboard">Erstmal weiter zum Monteur</Link>
            </form>
        </div>
    );
}
