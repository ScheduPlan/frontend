import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/de';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import style from './ScheduleCalendar.module.css';
import url from '../BackendURL';
import PopUp from './PopUp';

export default function CalendarComponent(props) {

    const [events, setEvents] = useState([]);
    const [isPopUpOpen, setPopUpOpen] = useState(false);
    const [pathToItem, setPathToItem] = useState("");

    useEffect(() => {
        getEvents();
        console.log(props.events);
    }, [props.events]);

    function togglePopUp(item) {
        if (isPopUpOpen) {
            setPopUpOpen(false);
        } else {
            setPathToItem(url + "/customers/" + item.event.order.customer.id + "/orders/" + item.event.order.id + "/events/" + item.event.id);
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
    const { views } = useMemo(
        () => ({
            views: [Views.WEEK, Views.DAY, Views.AGENDA],
        }),
        []
    );

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
        <div className={style.calendar_wrapper + " " + style.simple} >
            <Calendar
                defaultView="week"
                events={events}
                eventPropGetter={eventPropGetter}
                localizer={localizer}
                showMultiDayTimes
                step={30}
                views={views}
                onSelectEvent={togglePopUp}
                dayLayoutAlgorithm="overlap"
                //tooltipAccessor={{}}
                culture='de'
                style={style}
                length={6}
                resizable={false}
                messages={{ next: ">", previous: "<", today: "Heute", week: "Woche", day: "Tag", noEventsInRange: "Es gibt keine Termine für diesen Tag." }}
            />
            <PopUp isFitter={true} trigger={isPopUpOpen} close={togglePopUp} path={"/events"} pathToItem={pathToItem} />
        </div>
    )
}