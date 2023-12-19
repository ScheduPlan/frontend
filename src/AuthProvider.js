import { createContext, useState, useEffect } from "react";
import axios from "axios";
import url from "./BackendURL";

const AuthContext = createContext({}); // Erstellt einen neuen Kontext

export const AuthProvider = ({ children }) => {

    const storageItem = sessionStorage.getItem("auth");
    const parsedItem = storageItem ? JSON.parse(storageItem) : {}; //Was macht das?

    // Verwalte den Zustand der Authentifizierung
    const [auth, setAuth] = useState(parsedItem);
    const [user, setUser] = useState({});
    setHeader(parsedItem.accessToken);

    useEffect(() => {
        console.log("auth", auth);
        setHeader(auth.accessToken);
        console.log("token", auth.accessToken);
        /*axios.get(url + '/employees/' + auth.userId) 
            .then(res => {
                const data = res.data;
                setUser("user res data", data);
                console.log("ResData: ", res.data);
            })*/
    }, [auth]);

    function setHeader(accessToken) {
        console.log("header token " + accessToken);
        axios.defaults.headers.common['Authorization'] = accessToken ? 'Bearer ' + accessToken : null;
        console.log("header", axios.defaults.headers);

    }


    return (
        <AuthContext.Provider value={{ auth, setAuth, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;