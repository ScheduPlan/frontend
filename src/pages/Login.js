import AuthContext from '../AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext} from 'react';
import axios from 'axios';
import url from "../BackendURL";
import '../index.css';
import style from './Login.module.css';


export default function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setAuth } = useContext(AuthContext);
    const { auth } = useContext(AuthContext);

    const getEmail = (e) => {
        setEmail(e.target.value);
        console.log(email);
    }

    const getPassword = (e) => {
        setPassword(e.target.value);
        console.log(password); //Verschlüsseln?
    }
   
    async function submitForm(event) {
        try {
            event.preventDefault();
            const response = await axios.post(url + '/api/login',
                {
                    email: email,
                    password: password
                },
                { headers: { 'Content-Type': 'application/json' } }
            );
            const accessToken = response?.data?.access_token;
            const roles = response?.data?.roles; //?
            const obj = { email, roles, accessToken };
            setAuth(obj);
            sessionStorage.setItem("auth", JSON.stringify(obj));
            if (auth.is_admin === true) {
                navigate('/admin');
            } else if (auth.is_manager === true) {
                navigate('/manager');
            } else if (auth.is_assembler === true) {
                navigate('/assembler');
            } else {
                navigate('/error');
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    }

    return (
        <div className={style.login_wrapper} >
            <h1>Login</h1>
            <form onSubmit={submitForm}>
                <label>
                    E-Mail-Adresse:
                    <input type="email" name="email" onChange={getEmail} />
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
