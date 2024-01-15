import AuthContext from '../AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import url from "../BackendURL";
import '../index.css';
import style from './Login.module.css';


export default function Login() {

    const { setAuth, user, auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if(auth.userId != null) {
            axios.get(url + '/employees/' + auth.userId).then(res => {
                navigate('/' + res.data.user.role.toLowerCase());
            });
        }
    }, [user]);

    const getUsername = (e) => {
        setUsername(e.target.value);
    }

    const getPassword = (e) => {
        setPassword(e.target.value);
    }

    async function submitForm(event) {
        event.preventDefault();
        console.log("HIER");
        try {
            const response = await axios.post(url + '/auth/login',
                {
                    username: username,
                    password: password
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            const accessToken = response?.data?.accessToken;
            const refreshToken = response?.data?.refreshToken;
            const userId = response?.data?.userId;

            const obj = { userId, refreshToken, accessToken };
            setAuth(obj);

            sessionStorage.setItem("auth", JSON.stringify(obj));
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className={style.login_wrapper} >
            <div className={style.login_content} >
                <h1>Login</h1>
                <form onSubmit={submitForm}>
                    <label>
                        Benutzername:
                        <input type="text" name="username" onChange={getUsername} />
                    </label>
                    <label>
                        Passwort:
                        <input type="password" name="password" onChange={getPassword} />
                    </label>
                    <input className="btn primary" type="submit" value="Anmelden" />
                </form>
            </div>
        </div>
    );
}
