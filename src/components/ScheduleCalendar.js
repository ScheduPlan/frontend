import React, { useMemo, useState, useContext, useCallback, useEffect } from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/de';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import style from './ScheduleCalendar.module.css';
import AuthContext from '../AuthProvider';
import PopUp from './PopUp';
import url from '../BackendURL';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function CalendarComponent(props) {
    const { user } = useContext(AuthContext);

    const [activeOrder, setActiveOrder] = useState({});
    const [events, setEvents] = useState([]);

    const [pathToItem, setPathToItem] = useState("");
    const [pathToEdit, setPathToEdit] = useState("");
    const [isPopUpOpen, setPopUpOpen] = useState(false);

    const minTime = new Date();
    minTime.setHours(6, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(18, 0, 0);

    const DnDCalendar = withDragAndDrop(Calendar);

    //define the formats
    moment.locale('de');
    const localizer = momentLocalizer(moment);
    localizer.formats.dayRangeHeaderFormat = (({ start, end }, culture, localizer) =>
        localizer.format(start, 'DD.', culture) + ' - ' + localizer.format(end, 'DD. MMMM YYYY', culture));
    localizer.formats.dayFormat = 'dd DD.MM.';
    localizer.formats.dayHeaderFormat = 'dddd, DD.MM.YYYY';
    localizer.formats.agendaHeaderFormat = (({ start, end }, culture, localizer) =>
        localizer.format(start, 'dddd, DD.MM.', culture) + ' - ' + localizer.format(end, 'dddd, DD.MM.', culture));
    localizer.formats.agendaDateFormat = 'DD.MM.';

    //sets default values for the calendar
    const { components, views } = useMemo(
        () => ({
            views: [Views.WEEK, Views.DAY, Views.AGENDA],
        }),
        []
    )

    useEffect(() => {
        getEvents();
    }, [props.events]);

    useEffect(() => {
        setActiveOrder(props.activeOrder);
    }, [props.activeOrder]);

    /**
   * toggles pop up & sets path to items and path to the edit forms
   * @param {*} item 
   */
    function togglePopUp(item) { // To Do: Id in Funktion mitgeben -> Wozu?
        if (isPopUpOpen) {
            setPopUpOpen(false);
        } else {
            setPathToItem(url + "/customers/" + item.event.order.customer.id + "/orders/" + item.event.order.id + "/events/" + item.event.id);
            setPathToEdit('/' + user.user.role.toLowerCase() + "/events/" + item.event.id);

            setTimeout(() => {
                setPopUpOpen(true);
            }, 250);
        }
    }

    /**
     * get all events from API & puts it in correct form for the calendar
     */
    function getEvents() {
        let allEvents = [];
        props.events.forEach(event => {
            let elem = {
                id: event.id,
                title: event.order?.commissionNumber,
                start: new Date(event.startDate),
                end: new Date(event.endDate),
                event: event
            }
            allEvents = [...allEvents, elem];
        });
        setEvents(allEvents);
    }

    /**
     * calls function in parent component to update all events (from API)
     */
    function updateEvents() {
        props.getEvents();
    }

    /**
     * calls patch function for event to set new start and end date
     * @param {*} e 
     */
    async function changeEventDateTime(e) {
        console.log("event", e.event.event.order.customer);
        Swal.fire({
            title: "Sind Sie sicher, dass Sie das Element verschieben möchten?",
            icon: "warning",
            iconColor: "#A50000AB",
            showCancelButton: true,
            confirmButtonColor: "var(--primary)",
            cancelButtonColor: "var(--red)",
            cancelButtonText: "Nein",
            confirmButtonText: "Ja",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.patch(url + "/customers/" + e.event.event.order.customer.id + "/orders/" + e.event.event.order.id + "/events/" + e.event.event.id,
                    {
                        date: e.start,
                        endDate: e.end,
                    }, { headers: { 'Content-Type': 'application/json' } });

                Swal.fire({
                    title: "Element verschoben!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000
                });

                setTimeout(function () {
                    window.location.reload(); //To Do: hier kein reload, das is scheiße, man muss im gleichen Team Kalender bleiben
                }, 2500);
            }
        });

        /*const response = await axios.patch(url + "/customers/" + e.event?.event?.order?.customer?.id + "/orders/" + e.event?.event?.order?.id + "/events/" + e.event?.event?.id,
            {
                date: new Date(e.start),
                endDate: newEnd,
            }, { headers: { 'Content-Type': 'application/json' } });
        console.log("response", response);*/

        updateEvents();
    }

    //style of different appointments
    const eventPropGetter = useCallback((event, start, end, isSelected) => (
        {
            ...(event && {
                style: {
                    backgroundColor: '#ccc',
                    borderRadius: '0px',
                    color: 'black',
                    border: 'none',
                    opacity: '1',
                    display: 'block'
                }
            }),
            ...(event.event?.type === "ASSEMBLY" && { //ToDo: title in timeslot z-index:1 setzen
                style: {
                    backgroundColor: 'var(--primary)',
                    border: '0',
                    opacity: '1',
                    display: 'block'
                }
            }),
            ...(event.title === "Reklamation" && { //ToDo: title in timeslot z-index:1 setzen
                style: {
                    backgroundColor: 'var(--primary-dark)',
                    border: '0',
                    opacity: '1',
                    display: 'block'
                }
            })
        }
    ), [events]);

    /**
     * validates if event you want to create, is in between the custom min & max time
     * @param {*} start 
     * @param {*} end 
     */
    async function validateEvent(start, end) {
        if (start.getHours() > minTime.getHours()) {
            if (end.getHours() > maxTime.getHours()) {
                console.log("Termin zu lang: etweder Dauer kürzen oder Termin teilen");//"Termin teilen" legt neues Event zur Order an, dass am Folgetag zur erstmgl. Zeit beginnt
                Swal.fire({
                    title: "Länge des Termins befindet sich außerhalb des erlaubten Zeitrahmens",
                    icon: "question",
                    iconColor: "#0d7bebAB",
                    input: "number",
                    inputAttributes: {
                        step: "0.5",
                        min: "1",
                        max: activeOrder.plannedDuration,
                        required: true
                    },
                    inputLabel: "geschätzter Aufwand",
                    inputPlaceholder: activeOrder.plannedDuration,
                    confirmButtonText: "Ändern",
                    confirmButtonColor: "var(--primary)",

                    showDenyButton: true,
                    denyButtonText: "Termin teilen",
                    denyButtonColor: "var(--red)",

                    showCancelButton: true,
                    cancelButtonText: "Abbruch",
                    cancelButtonColor: "var(--grey)"
                }).then(result => {
                    if (result.isConfirmed) {
                        console.log("API call -> patch order (& set event)");
                        axios.patch(url + "/customers/" + activeOrder.customer.id + "/orders/" + activeOrder.id,
                            {
                                plannedDuration: result.value
                            });
                        const newEndDate = new Date(start.getTime() + result.value)
                        validateEvent(start, newEndDate);
                    } else if (result.isDenied) {
                        console.log("Termin wird geteilt");
                    }
                });
            } else {
                try {
                    const response = await axios.post(url + "/customers/" + activeOrder.customer.id + "/orders/" + activeOrder.id + "/events",
                        {
                            date: start,
                            endDate: end,
                            type: "ASSEMBLY",
                            orderId: activeOrder.id
                        }, { headers: { 'Content-Type': 'application/json' } });

                    //set order state confirmed to remove it from sidebar
                    axios.patch(url + "/customers/" + activeOrder.customer.id + "/orders/" + activeOrder.id,
                        {
                            state: "CONFIRMED"
                        }, { headers: { 'Content-Type': 'application/json' } });

                    setTimeout(function () {
                        updateEvents();
                        window.location.reload();
                    }, 250);
                } catch (error) {
                    alert(error);
                }
            }
        } else {
            Swal.fire({
                title: "Startzeit des Termins befindet sich außerhalb des erlaubten Zeitrahmens",
                icon: "warning",
                iconColor: "#0d7bebAB",
                showCancelButton: false,
                confirmButtonColor: "var(--primary)",
                confirmButtonText: "Ok",
            });
        }
    }

    /**
     * creates new event from sidebar order & sets order state to "CONFIRMED" to remove it from sidebar
     * @param {*} e 
     */
    async function onDropFromOutside(e) {
        if (!props.allOrdersDisplayed) {
            const duration = activeOrder.plannedDuration * 3600000;
            const newEndDate = new Date(e.start.getTime() + duration);
            validateEvent(e.start, newEndDate);
        }
    }

    return (
        <div className={style.calendar_wrapper} >
            <DnDCalendar
                defaultView="week"
                components={components}
                events={events}
                onSelectEvent={togglePopUp}
                eventPropGetter={eventPropGetter}
                onEventDrop={changeEventDateTime}
                onDropFromOutside={onDropFromOutside}
                localizer={localizer}
                showMultiDayTimes
                step={30}
                //min={minTime}
                //max={maxTime}
                views={views}
                dayLayoutAlgorithm="no-overlap"
                selectable
                culture='de'
                style={style}
                length={6}
                resizable={false}
                messages={{ next: ">", previous: "<", today: "Heute", week: "Woche", day: "Tag", noEventsInRange: "Es gibt keine Termine für diesen Tag." }}
            />
            <PopUp trigger={isPopUpOpen} close={togglePopUp} path={"/events"} pathToItem={pathToItem} pathToEdit={pathToEdit} /> {/*To Do: Das mit dem PopUp öffnen & schließen anders regeln -> window eventlistener */}
        </div>
    )
}