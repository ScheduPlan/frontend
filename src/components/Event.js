import React, { useContext, useEffect, useState } from 'react'
import popupStyle from './PopUp.module.css';
import moment from 'moment';
import axios from 'axios';
import url from '../BackendURL';
import AuthContext from '../AuthProvider';

export default function Event(props) {
    const { user } = useContext(AuthContext);
    const day = moment(props.object.startDate).format("ddd DD.MM.");
    const start = moment(props.object.startDate).format("HH:mm");
    const end = moment(props.object.endDate).format("HH:mm");

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
            type: 'MODIFICATION',
            alias: "Reklamation"
        }
    ];

    const [isCustomerConfirmed, setCustomerConfirmed] = useState();

    useEffect(() => {
        setCustomerConfirmed(props.object?.order?.state == "CUSTOMER_CONFIRMED");
    }, [props.object]);

    async function changeEventType(e) {
        await axios.patch(url + "/customers/" + props.object.order.customer.id + "/orders/" + props.object.order.id + "/events/" + props.object.id,
            {
                type: e.target.value
            }, { headers: { 'Content-Type': 'application/json' } }
        );
    }

    function toggleCustomerConfirmation() {
        if (isCustomerConfirmed) {
            axios.patch(url + "/customers/" + props.object.order.customer.id + "/orders/" + props.object.order.id,
                {
                    state: "CONFIRMED"
                }, { headers: { 'Content-Type': 'application/json' } }).then(() => {
                    props.updateEvents();
                    setCustomerConfirmed(false);
                });
        } else {
            axios.patch(url + "/customers/" + props.object.order.customer.id + "/orders/" + props.object.order.id,
                {
                    state: "CUSTOMER_CONFIRMED"
                }, { headers: { 'Content-Type': 'application/json' } }).then(() => {
                    setCustomerConfirmed(true);
                    props.updateEvents();
                });
        }
    }

    return (
        props.extended ?
            <>
                <h2>{day} {start} - {end} Uhr</h2>
                <div className={popupStyle.popup_details}>
                    <p><b>Auftr.nr.: </b>{props.object.order?.number}</p>
                    <p><b>Komm.nr.: </b>{props.object.order?.commissionNumber}</p>
                    <p><b>Kunde: </b>{props.object.order?.customer?.customerNumber} {props.object.order?.customer?.company}</p>
                    {props.object.helpers?.length > 0 ?
                        <p><b>Helfer: </b>{props.object.helpers.map((helper, index) => {
                            return (
                                ((props.object.helpers?.length > 1) && (props.object.helpers?.length - 1 > index)) ?
                                    helper.firstName + " " + helper.lastName + ", "
                                    :
                                    helper.firstName + " " + helper.lastName
                            )
                        })}</p>
                        : ""}
                    {props.object.order?.team?.id != user.teamId ?
                        <p><b>Team: </b>{props.object.order?.team?.description?.name}</p>
                        : ""}
                    {!props.isFitter ?
                        <label>
                            <input
                                type="checkbox"
                                checked={isCustomerConfirmed}
                                onChange={toggleCustomerConfirmation}
                            />
                            vom Kunden bestätigt
                        </label>
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
