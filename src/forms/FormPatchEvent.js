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
                const e = res.data.find(data => data.id == id)
                setEvent(e);
                if (e.helpers != []) {
                    setPickedHelpers(e.helpers);
                }
            });
    }, [id]);

    /**
     * gets all employees from API 
     * & creates an array of fitters that are not in the same team as the team of the order / event
     */
    useEffect(() => {
        axios.get(url + '/employees').then(res => {
            console.log(res.data);
            setFitters(res.data.filter(data => (data.user.role == "FITTER") /*&& (data.team.id != event.order.team.id)*/));
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

    /**
     * gets the selected helper and adds it to the picked helpers
     * @param {*} e 
     */
    const getPickedHelpers = (e) => {
        const selectedOption = {
            id: e.target.selectedOptions[0].id,
            value: e.target.value
        };
        setPickedHelpers((prevHelpers) => [...prevHelpers, selectedOption]);
    }

    /**
     * removes the helper from the picked list & adds the removed fitter back to the select options
     * @param {*} e 
     */
    function removeHelper(e) {
        setPickedHelpers(pickedHelpers.filter(helper => helper.id != e.target.id));
        updateAvailableHelpers();
    }

    const getType = (e) => {
        setType(e.target.value);
    }

    async function submitForm(e) {
        e.preventDefault();
        const helpers = pickedHelpers.map(helper => helper.id);
        try {
            const response = await axios.patch(url + '/customers/' + event.order.customer.id + '/orders/' + event.order.id + '/events/' + event.id,
                {
                    type: type,
                    helpers: helpers
                },
                { headers: { 'Content-Type': 'application/json' } });

            Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'Änderungen gespeichert!',
                confirmButtonText: 'Ok',
                confirmButtonColor: 'var(--success)',
                timer: 2000
            }).then(() => {
                navigate(-1);
            });

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='content-container'>
            <div className='topbar-header-wrapper'>
                <h1>Termin bearbeiten</h1>
            </div>
            <form onSubmit={submitForm}>
                <h3>Auftr. Nr.: {event.order?.number}</h3>
                <p>Kunde: {event.order?.customer?.customerNumber} {event.order?.customer?.company}</p>
                <div className='form-row'>
                    <label>
                        Terminart
                        <select className='light-blue' name="datetype" onChange={getType}> {/*To Do: alle mgl typen ziehen und hier ausgeben */}
                            <option readOnly hidden>Bitte auswählen</option>
                            <option value="ASSEMBLY">Montage</option>
                            <option>Reklamation</option>
                            <option>Lieferung</option>
                        </select>
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        Helfer
                        <select className='light-blue' name="customer" onChange={getPickedHelpers}>
                            <option readOnly hidden>Bitte wählen</option>
                            {availableHelpers.map(helper => {
                                console.log(helper);
                                return (
                                    <option onClick={updateAvailableHelpers} key={helper.id} id={helper.id} value={helper.firstName + " " + helper.lastName}>{helper.firstName} {helper.lastName}</option>
                                )
                            })}
                        </select>
                    </label>
                    <div className='pickedItem-wrapper'>
                        {(pickedHelpers != [] && pickedHelpers != undefined ?
                            pickedHelpers.map((emp, index) => {
                                return (
                                    <div key={index} className='pickedItem'>
                                        <p>{emp.value}</p>
                                        <svg onClick={removeHelper} id={emp.id} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 -960 960 960">
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
