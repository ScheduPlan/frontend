import React, { useMemo, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { Calendar, Views, DateLocalizer, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/de';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import style from './Calendar.module.css';
import AuthContext from '../AuthProvider';

export default function CalendarComponent(props) {

    const { auth, user } = useContext(AuthContext);

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


    return (
        <div className={style.calendar_wrapper} >
            <Calendar
                defaultView="week"
                components={components}
                /*events={appointments}*/
                /*backgroundEvents={timeslots}*/
                /*eventPropGetter={eventPropGetter}*/
                localizer={localizer}
                max={max}
                showMultiDayTimes
                step={30}
                views={views}
                /*onSelectEvent={handleClick}*/
                dayLayoutAlgorithm="no-overlap"
                tooltipAccessor={{}}
                /*onSelectSlot={onSelectSlot}*/
                selectable
                culture='de'
                style={style}
                length={6}
                messages={{next: ">", previous: "<", today: "Heute", week: "Woche", day: "Tag"}} 
            />
        </div>
    )
}