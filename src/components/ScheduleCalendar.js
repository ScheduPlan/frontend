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
    const { activeOrder, getOrders, allOrdersDisplayed } = props;

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
    const { views } = useMemo(
        () => ({
            views: [Views.WEEK, Views.DAY, Views.AGENDA],
        }),
        []
    )

    useEffect(() => {
        getEvents();
    }, [props.events]);

    /**
   * toggles pop up & sets path to items and path to the edit forms
   * @param {*} item 
   */
    function togglePopUp(item) {
        if (isPopUpOpen) {
            setPopUpOpen(false);
        } else {
            setPathToItem(url + "/customers/" + item.event.order.customer.id + "/orders/" + item.event.order.id + "/events/" + item.event.id);
            setPathToEdit('/' + user.user.role.toLowerCase() + "/events/" + item.event.id);
            setPopUpOpen(true);
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
        console.log("updated");
        props.getAllEvents();
    }

    /**
     * calls patch function for event to set new start and end date
     * @param {*} e 
     */
    async function changeEventDateTime(e) {
        Swal.fire({
            position: 'top',
            title: "Sind Sie sicher, dass Sie den Termin ändern möchten?",
            icon: "warning",
            iconColor: "var(--warning)",
            showCancelButton: true,
            confirmButtonColor: "var(--success)",
            cancelButtonColor: "var(--error)",
            cancelButtonText: "Nein",
            confirmButtonText: "Ja",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.patch(url + "/customers/" + e.event.event.order.customer.id + "/orders/" + e.event.event.order.id + "/events/" + e.event.event.id,
                        {
                            date: e.start,
                            endDate: e.end,
                        }, { headers: { 'Content-Type': 'application/json' } }).then(() => {
                            axios.patch(url + "/customers/" + e.event.event.order.customer.id + "/orders/" + e.event.event.order.id,
                                {
                                    state: "CONFIRMED"
                                }, { headers: { 'Content-Type': 'application/json' } });
                            Swal.fire({
                                position: 'top',
                                title: "Element verschoben!",
                                icon: "success",
                                confirmButtonText: "Ok",
                                confirmButtonColor: "var(--success)",
                                timer: 2000
                            }).then(() => {
                                updateEvents();
                            });
                        });
                } catch (error) {
                    Swal.fire({
                        position: 'top',
                        icon: 'error',
                        title: 'Terminüberlappung!',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: 'var(--error)',
                        timer: 2500
                    });
                }
            }
        });
    }

    /**
     * validates if event you want to create, is in between the custom min & max time
     * @param {*} start 
     * @param {*} end 
     */
    async function validateEvent(start, end) {
        if (!allOrdersDisplayed) {
            if (start.getHours() > minTime.getHours() && start > new Date()) {
                if (end.getHours() > maxTime.getHours()) {
                    Swal.fire({
                        position: 'top',
                        title: "Länge des Termins befindet sich außerhalb des erlaubten Zeitrahmens",
                        icon: "question",
                        iconColor: "var(--question)",
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
                        confirmButtonColor: "var(--info)",

                        //showDenyButton: true,
                        //denyButtonText: "Termin teilen",
                        //denyButtonColor: "var(--error)",

                        showCancelButton: true,
                        cancelButtonText: "Abbruch",
                        cancelButtonColor: "var(--grey-light)"
                    }).then(result => {
                        if (result.isConfirmed) {
                            axios.patch(url + "/customers/" + activeOrder.customer.id + "/orders/" + activeOrder.id,
                                {
                                    plannedDuration: result.value
                                }, { headers: { 'Content-Type': 'application/json' } });
                            const newEndDate = new Date(start.getTime() + result.value)
                            validateEvent(start, newEndDate);
                        } else if (result.isDenied) {
                            console.log("Termin wird geteilt"); //To Do
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
                            }, { headers: { 'Content-Type': 'application/json' } }).then(async () => {
                                //set order state confirmed to remove it from sidebar
                                await axios.patch(url + "/customers/" + activeOrder.customer.id + "/orders/" + activeOrder.id,
                                    {
                                        state: "CONFIRMED"
                                    }, { headers: { 'Content-Type': 'application/json' } }).then(() => updateEvents());
                                getOrders();
                            });
                    } catch (error) {
                        Swal.fire({
                            position: 'top',
                            icon: 'error',
                            title: 'Terminüberlappung!',
                            confirmButtonText: 'Ok',
                            confirmButtonColor: 'var(--error)',
                            timer: 2500
                        });
                    }
                }
            } else {
                Swal.fire({
                    position: 'top',
                    title: "Startzeit des Termins befindet sich außerhalb des erlaubten Zeitrahmens",
                    icon: "warning",
                    iconColor: "var(--warning)",
                    confirmButtonColor: "var(--warning)",
                    confirmButtonText: "Ok",
                });
            }
        }
    }

    /**
     * creates new event from sidebar order & sets order state to "CONFIRMED" to remove it from sidebar
     * @param {*} e 
     */
    async function onDropFromOutside(e) {
        if (!allOrdersDisplayed) {
            const duration = activeOrder.plannedDuration * 3600000;
            const newEndDate = new Date(e.start.getTime() + duration);
            validateEvent(e.start, newEndDate);
        }
    }

    /**
     * styles events for different props
     */
    const eventPropGetter = useCallback((event, start, end, isSelected) => {
        var className = "default";

        switch (event.event.type) {
            case "ASSEMBLY":
                className += " assembly";
                break;

            case "DELIVERY":
                className += " delivery";
                break;

            case "MODIFICATION":
                className += " complaint";
                break;

            default:
                className = "default";
                break;
        }

        if (event.event?.order?.state == "CUSTOMER_CONFIRMED") {
            className += " showCustomerIcon";
        }

        return {
            className
        };
    }, [events, props.events]);

    return (
        <div className={style.calendar_wrapper} >
            <DnDCalendar
                defaultView="week"
                //components={components}
                events={events} //fct. die events returnt?
                onSelectEvent={togglePopUp}
                eventPropGetter={eventPropGetter}
                onEventDrop={changeEventDateTime}
                onEventResize={changeEventDateTime} // TO Do: fixen
                onDropFromOutside={onDropFromOutside}
                resizable
                //showAllEvents ------> To Do: Was macht das? 
                localizer={localizer}
                //showMultiDayTimes
                step={30}
                //min={minTime}
                //max={maxTime}
                views={views}
                dayLayoutAlgorithm="no-overlap"
                //selectable
                culture='de'
                style={style}
                length={6}
                messages={{ next: ">", previous: "<", today: "Heute", week: "Woche", day: "Tag", noEventsInRange: "Es gibt keine Termine für diesen Tag.", date: "Datum", time: "Uhrzeit", event: "Auftrag" }}
            />
            <PopUp events={events} updateEvents={updateEvents} trigger={isPopUpOpen} close={togglePopUp} path={"/events"} pathToItem={pathToItem} pathToEdit={pathToEdit} /> {/*To Do: Das mit dem PopUp öffnen & schließen anders regeln -> window eventlistener */}
        </div>
    )
}