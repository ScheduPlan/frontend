import React, { useEffect, useContext } from "react";
import AuthContext from "../AuthProvider";
import userTest from '../UserExample';
import Header from "./Header";

export default function Layout(props) {
    //const { auth, user } = useContext(AuthContext);

    /*useEffect(() => {
        setContent();
    }, []); //auth, user*/

    const adminLinks = [
        {
          path: "/admin",
          title: "Mitarbeiter anlegen"
        }
      ]

      const managerLinks = [
        {
          path: "/manager",
          title: "Planungsassistent"
        },
        {
            path: "manager/appointment",
            title: "Termine anlegen"
        }
      ]

    function setContent() {
        let content;
        if (!userTest.is_loged_in) {
            content = (
                <div>
                    <main>{props.children}</main>
                </div>
            )
        } else {
            if (userTest.role=="admin") {
                 content = (<div>
                    <Header title="Neuen Mitarbeiter anlegen" menueLinks={adminLinks} />
                    <main>{props.children}</main>
                </div>)
            } else if (userTest.role=="manager") {
                content = (<div>
                    <Header title="Planungsassistent" menueLinks={managerLinks} />
                    <main>{props.children}</main>
                </div>)
            } else if (userTest.role=="assembler") {
                content = (<div>
                    <Header title="Termin&shy;kalender" />
                    <main>{props.children}</main>
                </div>)
            } else {
                content = (
                    <div>
                        <main>{props.children}</main>
                    </div>
                )
            }
        }
        return content;
    }

    return (
        <div>
            {setContent()}
        </div>
    );
}