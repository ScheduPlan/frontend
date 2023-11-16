import React, { useEffect } from "react";
import userTest from '../UserExample';
import Header from "./Header";

export default function Layout(props) {
    //const { auth, user } = useContext(AuthContext);

    useEffect(() => {
        setContent();
    }, []); //auth, user*/

    function setContent() {
        let content;
        if (!userTest.is_loged_in) {
            content = (
                <div>
                    <main>{props.children}</main>
                </div>
            )
        } else {
           content = (
            <div>
                <Header />
                <main>{props.children}</main>
            </div>
           )
        }
        return content;
    }

    return (
        <div>
            {setContent()}
        </div>
    );
}