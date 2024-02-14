import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import url from '../BackendURL';
import { useNavigate, useParams } from 'react-router-dom';
import Path from '../icons/Paths';

export default function FormPatchEvent() {

    const eventTypes = [
        {
            type: 'ASSEMBLY',
            alias: "Montage"
        },
        {
            type: 'DELIVERY',
            alias: "Lieferung"
        },
        {
            type: 'COMMUTE',
            alias: "Reklamation"
        }
    ];

    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState();

    const [type, setType] = useState();

    const [fitters, setFitters] = useState([]); //allEmployees
    const [availableHelpers, setAvailableHelpers] = useState([]); //availableEmployees
    const [pickedHelpers, setPickedHelpers] = useState([]); //pickedEmployees

    //gets event
    useEffect(() => {
        getEvent();
    }, [id]);

    useEffect(() => {
        if (event != null) {
            getFitters();
            getHelpers();
        }
    }, [event]);

    useEffect(() => {
        updateAvailableHelpers();
    }, [fitters, pickedHelpers]);

    /**
    * gets event via ID from API & sets already picked helpers
    */
    function getEvent() {
        axios.get(url + '/events').then(res => {
            setEvent(res.data.find(data => data.id == id));
        });
    }

    /**
    * gets all employees with role FITTER from another team from API
    */
    function getFitters() {
        axios.get(url + "/teams").then(res => {
            const helperTeams = res.data.filter(team => team.id != event.order?.team?.id).forEach(team => {
                axios.get(url + "/teams/" + team.id + "/members").then(res => {
                    console.log("getFitters", res.data);
                    setFitters([...fitters, ...res.data]);
                })
            })
        });
    }

    /**
     * gets helpers of the event from API
     */
    function getHelpers() {
        axios.get(url + '/customers/' + event.order.customer.id + '/orders/' + event.order.id + '/events/' + event.id + '/helpers')
            .then(res => {
                console.log("getHelpers", res.data);
                setPickedHelpers(res.data);
            });
    }

    /**
     * filters the available helpers that there are not picked ones
     */
    function updateAvailableHelpers() {
        setAvailableHelpers(
            fitters.filter(obj =>
                !pickedHelpers.some(pickedObj => pickedObj.id === obj.id))
        );
        console.log("fitters", fitters);
    }

    /**
     * gets the selected helper and adds it to the picked helpers
     * @param {*} e 
     */
    const getPickedHelpers = (e) => {
        const picked = fitters.find(emp => emp.id == e.target.selectedOptions[0].id);
        const selectedOption = {
            id: picked.id,
            firstName: picked.firstName,
            lastName: picked.lastName
        };
        setPickedHelpers([...pickedHelpers, selectedOption]);
    }

    /**
     * removes the employee from the picked list & adds the removed employee back to the select options
     * @param {*} emp 
     */
    function removeHelper(emp) {
        axios.delete(url + '/customers/' + event.order.customer.id + '/orders/' + event.order.id + '/events/' + event.id + '/helpers' + emp.id).then(() => {
            setPickedHelpers(pickedHelpers.filter(obj => obj.id != emp.id));
            getFitters();
        });
    }

    const getType = (e) => {
        setType(e.target.value);
    }

    async function submitForm(e) {
        e.preventDefault();
        try {
            if (pickedHelpers.length > 0) {
                pickedHelpers.forEach(async (helper) => {
                    await axios.post(url + '/customers/' + event.order.customer.id + '/orders/' + event.order.id + '/events/' + event.id + "/helpers",
                        {
                            resourceId: helper.id
                        },
                        { headers: { 'Content-Type': 'application/json' } });
                });
            }

            await axios.patch(url + '/customers/' + event.order.customer.id + '/orders/' + event.order.id + '/events/' + event.id,
                {
                    type: type
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
            alert(error);
        }
    }

    return (
        <div className='content-container'>
            <div className='topbar-header-wrapper'>
                <h1>Termin bearbeiten</h1>
            </div>
            <form onSubmit={submitForm}>
                <h3>Auftr. Nr.: {event?.order?.number}</h3>
                <p>Kunde: {event?.order?.customer?.customerNumber} {event?.order?.customer?.company}</p>
                <div className='form-row'>
                    <label>
                        Terminart
                        <select name="datetype" onChange={getType}> {/*To Do: alle mgl typen ziehen und hier ausgeben */}
                            <option readOnly hidden>Bitte auswählen</option>
                            <option value="ASSEMBLY">Montage</option>
                            <option value="ASSEMBLY">Reklamation</option>
                            <option value="DELIVERY">Lieferung</option>
                        </select>
                    </label>
                </div>
                <div className='form-row'>
                    <label>
                        Helfer
                        <select name="customer" onChange={getPickedHelpers}>
                            <option readOnly hidden>Bitte wählen</option>
                            {availableHelpers.map(helper => {
                                return (
                                    <option onClick={updateAvailableHelpers} key={helper.id} id={helper.id} value={helper.firstName + " " + helper.lastName}>{helper.firstName} {helper.lastName}</option>
                                )
                            })}
                        </select>
                    </label>
                    <div className='pickedItem-wrapper'>
                        {(pickedHelpers != [] ?
                            pickedHelpers.map((emp, index) => {
                                return (
                                    <div key={index} className='pickedItem'>
                                        <p>{emp.firstName} {emp.lastName}</p>
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
