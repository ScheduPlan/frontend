import React, { useMemo, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { Calendar, Views, DateLocalizer, momentLocalizer } from 'react-big-calendar';
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

    const [activeOrder, setActiveOrder] = useState({});
    const [events, setEvents] = useState([]);

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
    const { components, max, views } = useMemo(
        () => ({
            views: [Views.WEEK, Views.DAY, Views.AGENDA],
        }),
        []
    )

    //get all appointments
    useEffect(() => {
        getEvents();
    }, [props.events]);

    useEffect(() => {
        setActiveOrder(props.activeOrder);
    }, [props.activeOrder]);

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
     * calls patch function for event to set new start and end date
     * @param {*} e 
     */
    async function changeEventDateTime(e) {
        console.log(e);
        console.log("start", e.start);
        console.log("end", e.end);
        var addMlSeconds = (2 * 60) * 60000;
        console.log("END?", new Date(e.start.getTime() + addMlSeconds));
        const newEnd = new Date(e.start.getTime() + addMlSeconds);

        const response = await axios.patch(url + "/customers/" + e.event?.event?.order?.customer?.id + "/orders/" + e.event?.event?.order?.id + "/events/" + e.event?.event?.id,
            {
                date: e.start,
                endDate: newEnd,
            }, { headers: { 'Content-Type': 'application/json' } });
        console.log("response", response);
        //getEvents();
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
            ...(event.event.type === "ASSEMBLY" && { //ToDo: title in timeslot z-index:1 setzen
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
     * creates new event from sidebar order & sets order state to "CONFIRMED" to remove it from sidebar
     * @param {*} e 
     */
    async function onDropFromOutside(e) {
        console.log("dragEvent", e);
        console.log("order", activeOrder);//patch order (state CONFIRMED)
        try {
            const response = await axios.post(url + "/customers/" + activeOrder.customer.id + "/orders/" + activeOrder.id + "/events",
                {
                    date: e.start,
                    endDate: e.end,
                    type: "ASSEMBLY",
                    orderId: activeOrder.id
                }, { headers: { 'Content-Type': 'application/json' } });
            console.log(response);

            //set order state confirmed to remove it from sidebar
            axios.patch(url + "/customers/" + activeOrder.customer.id + "/orders/" + activeOrder.id,
                {
                    state: "CONFIRMED"
                }, { headers: { 'Content-Type': 'application/json' } });
            getEvents();
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className={style.calendar_wrapper} >
            <DnDCalendar
                defaultView="week"
                components={components}
                events={events}
                eventPropGetter={eventPropGetter}
                onEventDrop={changeEventDateTime}
                onDropFromOutside={onDropFromOutside}
                localizer={localizer}
                max={max}
                showMultiDayTimes
                step={30}
                views={views}
                /*onSelectEvent={togglePopUp}*/
                dayLayoutAlgorithm="no-overlap"
                /*onSelectSlot={onSelectSlot}*/
                selectable
                culture='de'
                style={style}
                length={6}
                resizable={false}
                messages={{ next: ">", previous: "<", today: "Heute", week: "Woche", day: "Tag" }}
            />
        </div>
    )
}