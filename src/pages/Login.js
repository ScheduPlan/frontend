import AuthContext from '../AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext} from 'react';
import axios from 'axios';
import url from "../BackendURL";
import '../index.css';
import style from './Login.module.css';


export default function Login() {

    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const getUsername = (e) => {
        setUsername(e.target.value);
        console.log(username);
    }

    const getPassword = (e) => {
        setPassword(e.target.value);
        console.log(password); //Verschlüsseln?
    }
   
    async function submitForm(event) {
        try {
            event.preventDefault();
            const response = await axios.post(url + '/auth/login',
                {
                    username: username,
                    password: password
                },
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            console.log("Login response:", response);

            const accessToken = response?.data?.token;
            const roles = response?.data?.roles; //To Do: Ich brauch 3 Rollen
            
            const obj = { username, roles, accessToken }; //To Do: ID, statt Username (o. beides)
            setAuth(obj);
            sessionStorage.setItem("auth", JSON.stringify(obj));

            navigate('/assembler');
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className={style.login_wrapper} >
            <h1>Login</h1>
            <form onSubmit={submitForm}>
                <label>
                    Benutzername:
                    <input type="text" name="username" onChange={getUsername} />
                </label>
                <label>
                    Passwort:
                    <input type="password" name="password" onChange={getPassword}/>
                </label>
                <input className="btn primary" type="submit" value="Anmelden" />
                <Link to="/admin">zum Admin</Link>
                <Link to="/manager">zum Manager</Link>
                <Link to="/assembler">zum Monteur</Link>
            </form>
        </div>
    );
}
