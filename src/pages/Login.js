import Button from '../components/Button';
import style from './Login.module.css';


function Login() {
   
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
                <Button className="primary" label="Anmelden" type="submit" />
            </form>
        </div>
    );
}
export default Login;