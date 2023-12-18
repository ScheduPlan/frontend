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

    const { auth, user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [appointment, setAppointment] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newEvent, setNewEvent] = useState({});

    const [isPopUpOpen, setPopUpOpen] = useState(false);

    const DnDCalendar = withDragAndDrop(Calendar);

    function togglePopUp(appointment) {
        if (isPopUpOpen) {
            setPopUpOpen(false);
        } else {
            setAppointment(appointment);
            setPopUpOpen(true);
        }
    }

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
        let appointments = [];
        props.appointments.forEach((appointment) => {
            let elem = {
                title: appointment.category,
                start: new Date(appointment.start),
                end: new Date(appointment.end),
                appointment: appointment.category,
            };
            appointments = [...appointments, elem];
        });
        setAppointments(appointments);

        //get all orders
        axios.get(url + "/orders")
                .then(response => {
                    const itemData = response.data;
                    setOrders(itemData);
                    console.log("Orders", itemData);
                });

        //get all events
        axios.get(url + "/events")
                .then(response => {
                    const itemData = response.data;
                    setOrders(itemData);
                    console.log("Orders", itemData);
                });

    }, [props.appointments]);

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
            ...(event.title === "Montage" && { //ToDo: title in timeslot z-index:1 setzen
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
    ), [appointments]);

    //set new event dates
    function setNewEventDates(e) {
        console.log("event " + e.event + ", start " + e.start + ", end " + e.end);
        
        Swal.fire({
            title: "Sind Sie sicher, dass Sie den Termin verschieben möchten?",
            icon: "warning",
            iconColor: "#A50000AB",
            showCancelButton: true,
            confirmButtonColor: "var(--green)",
            cancelButtonColor: "var(--red)",
            cancelButtonText: "Nein",
            confirmButtonText: "Ja",
          }).then(async (result) => {
            if (result.isConfirmed) {
                const newEvent = await axios.patch(url + '/customers/' + e.event.customer. id + '/orders/' + e.event.orders.id + '/events' + e.event.id,
                {
                    startDate: e.start,
                    endDate: e.end
                },
                { headers: { 'Content-Type': 'application/json' } });
      
              Swal.fire({
                title: "Element gelöscht!",
                icon: "success",
                showConfirmButton: false,
              });
      
              setTimeout(function () {
                //window.location.reload();
              }, 2500);
            }
          });
    }

    return (
        <div className={style.calendar_wrapper} >
            <DnDCalendar
                defaultView="week"
                components={components}
                events={/*appointments*/ props.appointments}
                /*backgroundEvents={timeslots}*/
                /*eventPropGetter={eventPropGetter}*/
                onEventDrop={setNewEventDates}
                localizer={localizer}
                max={max}
                showMultiDayTimes
                step={30}
                views={views}
                onSelectEvent={togglePopUp}
                dayLayoutAlgorithm="no-overlap"
                tooltipAccessor={{}}
                /*onSelectSlot={onSelectSlot}*/
                selectable
                culture='de'
                style={style}
                length={6}
                resizable={false}
                messages={{ next: ">", previous: "<", today: "Heute", week: "Woche", day: "Tag" }}
            />
            <PopUp trigger={isPopUpOpen} close={togglePopUp} type="dateDetail" appointment={appointment} />
        </div>
    )
}