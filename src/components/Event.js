import React from 'react'
import popupStyle from './PopUp.module.css';
import moment from 'moment';

export default function Event(props) {
    const day = moment(props.object.startDate).format("ddd DD.MM.");
    const start = moment(props.object.startDate).format("HH:mm");
    const end = moment(props.object.endDate).format("HH:mm");

    return (
        props.extended ?
            <>
                <h2>{day} {start} - {end} Uhr</h2>
                <div className={popupStyle.popup_details}>
                    <p><b>Auftr.nr.: </b>{props.object.order?.number}</p>
                    <p><b>Komm.nr.: </b>{props.object.order?.commissionNumber}</p>
                    <p><b>Kunde: </b>{props.object.order?.customer?.customerNumber} {props.object.order?.customer?.company}</p>
                    <p><b>Status: </b>{props.object?.order?.state}</p>
                    {props.object.helpers?.length > 0 ?
                        <p><b>Helfer: </b>{props.object.helpers.map((helper, index) => {
                            return (
                              ((props.object.helpers?.length > 1) && (props.object.helpers?.length - 1 > index)) ?
                              "Test" + helper.firstName + " " + helper.lastName + ", "
                              :
                              helper.firstName + " " + helper.lastName
                            )
                          })}</p>
                        : ""}
                </div>
            </> :
            <>
                <div>
                    {props.object.order.number} - {props.object.order.customer.customerNumber} {props.object.order.customer.company}
                </div>
            </>
    )
}
