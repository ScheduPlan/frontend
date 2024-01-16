import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import url from '../BackendURL';
import { useNavigate, useParams } from 'react-router-dom';
import Path from '../icons/Paths';

export default function FormPatchEvent() {

    const eventTypes = [];

    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState({});

    const [type, setType] = useState();
    
    const [fitters, setFitters] = useState([]); //allEmployees
    const [availableHelpers, setAvailableHelpers] = useState([]); //availableEmployees
    const [pickedHelpers, setPickedHelpers] = useState([]); //pickedEmployees

    useEffect(() => {
        axios.get(url + '/events')
            .then(res => {
                setEvent(res.data.find(data => data.id == id));
                setPickedHelpers((prevHelpers) => [...prevHelpers, event.helpers]);
            });
    }, [id]);

    /**
     * gets all employees from API 
     * & creates an array of fitters that are not in the same team as the team of the order / event
     */
    useEffect(() => {
        axios.get(url + '/employees').then(res => {
            setFitters(res.data.filter(data => (data.role == "FITTER") && (data.team.id != event.order.team.id)));
        });
    }, []);

    useEffect(() => {
        updateAvailableHelpers();
    }, [fitters, pickedHelpers]);

    /**
     * filters the available helpers that there are not picked ones
     */
    function updateAvailableHelpers() {
        setAvailableHelpers(
            fitters.filter(obj =>
                !pickedHelpers.some(pickedObj => pickedObj.id === obj.id))
        );
    }

    const getType = (e) => {
        setType(e.target.value);
    }

    /**
     * gets the selected helper and adds it to the picked helpers
     * @param {*} e 
     */
    const getPickedHelpers = (e) => {
        const selectedOption = {
            id: e.target.selectedOptions[0].id,
            value: e.target.value
        };
        console.log("selectOpt", e);
        setPickedHelpers((prevHelpers) => [...prevHelpers, selectedOption]);
    }

    /**
     * removes the helper from the picked list & adds the removed fitter back to the select options
     * @param {*} e 
     */
    function removeHelper(e) {
        console.log(e);

        const selectedOption = pickedHelpers.find(elem => elem.id === e.target.id);
        setPickedHelpers(pickedHelpers.filter(obj => obj != selectedOption));
        updateAvailableHelpers();
        console.log("removeEmployee", selectedOption);
    }

    async function submitForm(event) {
        event.preventDefault();
        try {
            const response = await axios.patch(url + '/customers/' + event.order.customer.id + '/orders/' + event.order.id + '/events' + event.id,
                {
                    type: type,
                    helpers: pickedHelpers
                },
                { headers: { 'Content-Type': 'application/json' } });

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Änderungen gespeichert!',
                showConfirmButton: false,
                timer: 2000
            });

            setTimeout(function () {
                navigate("/manager/schedule");
            }, 2500);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='content-container'>
            <h1>Termin bearbeiten</h1>
            <form onSubmit={submitForm}>
                <h3>Auftr. Nr.: {event.order?.number}</h3>
                <p>Kunde: {event.order?.customer?.customerNumber} {event.order?.customer?.company}</p>
                <div className='form-row'>
                    <label>
                        Helfer
                        <select className='light-blue' name="customer" onChange={getPickedHelpers}>
                            <option readOnly hidden>Bitte wählen</option>
                            {availableHelpers.map((emp) => {
                                return (
                                    <option onClick={updateAvailableHelpers} key={emp.id} id={emp.id} value={emp.firstName + " " + emp.lastName}>{emp.firstName} {emp.lastName}</option>
                                )
                            })}
                        </select>
                    </label>
                    <div className='pickedItem-wrapper'>
                        {(pickedHelpers != [] ?
                            pickedHelpers.map((emp, index) => {
                                return (
                                    <div key={index} className='pickedItem'>
                                        <p>Test</p>
                                        <svg onClick={removeHelper} id={index} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 -960 960 960">
                                            <path d={Path("close")} />
                                        </svg>
                                    </div>
                                )
                            }) : "")}
                    </div>
                </div>
                <div className='btn-wrapper'>
                    <input className="btn primary" type="submit" value="Anlegen" />
                    <input className="btn secondary" type="button" value="Abbrechen" onClick={() => { navigate("..", { relative: "path" }); }} />
                </div>
            </form>
        </div>
    )
}
