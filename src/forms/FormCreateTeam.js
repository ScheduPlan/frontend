import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import url from '../BackendURL';

export default function FormCreateTeam() {

    const [teamName, setTeamName] = useState("");
    const [teamDesc, setTeamDesc] = useState("");

    const getTeamName = (e) => {
        setTeamName(e.target.value);
    }

    const getTeamDesc = (e) => {
        setTeamDesc(e.target.value);
    }

    async function submitForm() {
        try {
            const response = await axios.post(url + '/teams',
                {
                    name: teamName,
                    description: teamDesc,
                },
                { headers: { 'Content-Type': 'application/json' } });

            console.log("res data", response.data);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Neuer Auftrag angelegt!',
                showConfirmButton: false,
                timer: 5000
            });

            setTimeout(function () {
                window.location.reload();
            }, 2500);

        } catch (error) {
            console.log(error);
        }
    }

    function testFct() {
        axios.get(url + '/teams')
            .then(res => {
                const data = res.data;
                console.log("data", data);
            });
    }

    return (
        <div className='content-container'>
            <h1>Neues Team anlegen</h1>
            <form onSubmit={submitForm}>
                <div className='form-row'>
                    <label>
                        Teamname
                        <input className='light-blue' type="text" name="team" onChange={getTeamName} required />
                    </label>
                    <label>
                        Beschreibung
                        <input className='light-blue' type="text" name="description" onChange={getTeamDesc} />
                    </label>
                </div>
                <input className="btn primary" type="submit" value="Anlegen" />
                <input onClick={testFct} className="btn primary" type="button" value="AnlegenTest" />
            </form>
        </div>
    )
}
