import React, { useEffect, useContext } from "react";
import userTest from '../UserExample';
import Header from "./Header";
import AuthContext from "../AuthProvider";

export default function Layout(props) {
    const { auth, user } = useContext(AuthContext);

    useEffect(() => {
        setContent();
    }, []); //auth, user

    function setContent() {
        if (user.role != null || userTest.role != "") {
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