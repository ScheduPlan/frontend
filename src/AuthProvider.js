import { createContext, useState, useEffect } from "react";
import axios from "axios";
import url from "./BackendURL";
import { jwtDecode } from "jwt-decode";
import logout from './utility/logout';

const AuthContext = createContext({}); // Erstellt einen neuen Kontext

export const AuthProvider = ({ children }) => {

    const storageItem = sessionStorage.getItem("auth");
    const parsedItem = storageItem ? JSON.parse(storageItem) : {};

    const [expRefreshToken, setExpRefreshToken] = useState();
    const [expAccessToken, setExpAccessToken] = useState();

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
            setExpRefreshToken(jwtDecode(auth.refreshToken).exp * 1000);
            setExpAccessToken(jwtDecode(auth.accessToken).exp * 1000);
        }
    }, [auth]);

    /**
     * automatically renews tokens & logs out the users when accessToken is expired
     */
    useEffect(() => { //evtl. automat. neu einloggen, wenn letzer Login weniger als 24h her
        if ((expRefreshToken - Date.now()) < 1000) {
            refreshToken();
        } else if ((expAccessToken - Date.now()) < 1000) {
            logout();
        } else {
            console.log("Geht noch ", expRefreshToken - Date.now());
        }
    }, [Date.now()]);

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