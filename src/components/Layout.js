import React, { useEffect, useContext } from "react";
import Header from "./Header";
import AuthContext from "../AuthProvider";

export default function Layout(props) {
    const { auth, user } = useContext(AuthContext);

    useEffect(() => {
        setContent();
    }, []); //auth, user

    function setContent() {
        if (user?.user?.role != null) {
            return (
                <>
                    <Header />
                    <>{props.children}</>
                </>
            );
        } else {
            return (
                <>{props.children}</>
            );
        }
    }

    return (
        <div className="page">
            {setContent()}
        </div>
    );
}