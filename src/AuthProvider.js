import { createContext, useState, useEffect } from "react";
import axios from "axios";
import url from "./BackendURL";

const AuthContext = createContext({}); // Erstellt einen neuen Kontext

export const AuthProvider = ({ children }) => {

    const storageItem = sessionStorage.getItem("auth");
    const parsedItem = storageItem ? JSON.parse(storageItem) : {};

    // Verwalte den Zustand der Authentifizierung
    const [auth, setAuth] = useState(parsedItem);
    const [user, setUser] = useState({});
    setHeader(parsedItem.accessToken);

    useEffect(() => {
        console.log("storageItem", storageItem);
        console.log(auth);
        setHeader(auth.accessToken);
        if (storageItem != null) {
            axios.get(url + '/employees/' + auth.userId)
                .then(res => {
                    const data = res.data;
                    setUser(data);
                    console.log("user", user);
                });
        }
    }, [auth]);

    function setHeader(accessToken) {
        axios.defaults.headers.common['Authorization'] = accessToken ? 'Bearer ' + accessToken : null;
    }


    return (
        <AuthContext.Provider value={{ auth, setAuth, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;