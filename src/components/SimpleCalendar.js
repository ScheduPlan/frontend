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
    const [appointment, setAppointment] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newEvent, setNewEvent] = useState({});

    const [isPopUpOpen, setPopUpOpen] = useState(false);

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
    ), [props.appointments]);

    return (
        <div className={style.calendar_wrapper} >
            <Calendar
                defaultView="week"
                components={components}
                events={/*appointments*/ props.appointments}
                /*backgroundEvents={timeslots}*/
                /*eventPropGetter={eventPropGetter}*/
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