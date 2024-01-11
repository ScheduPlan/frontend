import { createContext, useState, useEffect } from "react";
import axios from "axios";
import url from "./BackendURL";
import { jwtDecode } from "jwt-decode";
import logout from './utility/logout';

const AuthContext = createContext({}); // Erstellt einen neuen Kontext

export const AuthProvider = ({ children }) => {

    const storageItem = sessionStorage.getItem("auth");
    const parsedItem = storageItem ? JSON.parse(storageItem) : {};

    // Verwalte den Zustand der Authentifizierung
    const [auth, setAuth] = useState(parsedItem);
    const [user, setUser] = useState({});

    useEffect(() => {
        setHeader(auth.accessToken);
        if (storageItem != null) {
            axios.get(url + '/employees/' + auth.userId)
                .then(res => {
                    setUser(res.data);
                });
        }
        if (auth.accessToken != null) {
            if (jwtDecode(auth.accessToken).exp * 1000 < Date.now()) {
                console.log("Abgelaufen");
                refreshToken();
            } else {
                console.log("Geht noch");
            }
        }
        if (auth.refreshToken < Date.now()) {
            logout();
        }
    }, [auth]);

    useEffect(() => {
        if (auth.accessToken != null) {
            const expAccessToken = (jwtDecode(auth.accessToken).exp) * 1000;

            if (expAccessToken - Date.now() > 1000) {
                console.log("HIER", expAccessToken - Date.now());
            }
        }
    }, []);


    /**
     * sends API request with refresh token to get a new access token
     */
    async function refreshToken() {
        try {
            const response = await axios.post(url + "/auth/refresh",
                {
                    refreshToken: auth.refreshToken
                },
                { headers: { 'Content-Type': 'application/json' } });
            const accessToken = response?.data?.accessToken;
            const refreshToken = auth.refreshToken;
            const userId = response?.data?.userId;

            const obj = { userId, refreshToken, accessToken };
            setAuth(obj);

            sessionStorage.setItem("auth", JSON.stringify(obj));
        } catch (error) {
            alert(error);
        }
    }

    function setHeader(accessToken) {
        axios.defaults.headers.common['Authorization'] = accessToken ? 'Bearer ' + accessToken : null;
    }

    setHeader(parsedItem.accessToken);

    return (
        <AuthContext.Provider value={{ auth, setAuth, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;