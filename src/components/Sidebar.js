import React, { useEffect, useState } from 'react';
import style from './Sidebar.module.css';
import axios from 'axios';
import url from '../BackendURL';
import sortItems from '../utility/sortItems';

export const appoint = [
    {
        order: "Prod01_2023",
        time: 2.5,
        category: "Montage"
    },
    {
        order: "Prod02_2023",
        time: 4,
        category: "Reklamation"
    }
    ,
    {
        order: "Prod03_2023",
        time: 4,
        category: "Reklamation"
    },
    {
        order: "Prod01_2023",
        time: 2.5,
        category: "Montage"
    },
    {
        order: "Prod02_2023",
        time: 4,
        category: "Reklamation"
    }
    ,
    {
        order: "Prod03_2023",
        time: 4,
        category: "Reklamation"
    },
    {
        order: "Prod01_2023",
        time: 2.5,
        category: "Montage"
    },
    {
        order: "Prod02_2023",
        time: 4,
        category: "Reklamation"
    }
    ,
    {
        order: "Prod03_2023",
        time: 4,
        category: "Reklamation"
    }
]

export default function Sidebar(props) {

    const [orders, setOrders] = useState([]);
    const [isOpen, setOpen] = useState(true);

    useEffect(() => {
        if(props.activeTeamId != null && props.activeTeamId != "") {
            axios.get(url + "/teams/" + props.activeTeamId + "/orders").then(res => {
                setOrders(sortItems(res.data, "commissionNumber"))});
        } else {
            axios.get(url + "/orders").then(res => {
                setOrders(sortItems(res.data, "commissionNumber"));
            });
        }
    }, [props.activeTeamId]);

    function toggleSidebar(e) {
        if (isOpen) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }

    return (
        <div className={style.sidebar + (!isOpen ? " " + style.sidebar_closed : " ")}>
            <h2>Aufträge</h2>
            <div className={style.btn_close} onClick={toggleSidebar}>{'<'}</div>
            <div className={style.appointment_box_wrapper}>
                {orders.map(order => {
                    <div key={order.id} className={style.appointment_box}>
                        <p className={style.title}>Komm.-Nr. {order.commissionNumber}</p>
                        <div className={style.appointment_detail}>
                            <p><b>Kategorie:</b> {order.customer.company}</p>
                            <p><b>Zeitaufwand:</b> {order.weight}</p>
                        </div>
                    </div>
                })}
                {appoint.map((a, index) => (
                    <div key={index} className={style.appointment_box}>
                        <p className={style.title}>{a.order}</p>
                        <div className={style.appointment_detail}>
                            <p><b>Kategorie:</b> {a.category}</p>
                            <p><b>Zeitaufwand:</b> {a.time}</p>
                        </div>
                    </div>
                ))}
                {orders.map((order) => (
                    <div key={order.id} className={style.appointment_box}>
                        <p className={style.title}>{order.commissionNumber}</p>
                        <div className={style.appointment_detail}>
                            <p><b>Kategorie:</b> XY</p>
                            <p><b>geschätzter Aufwand:</b> XYh</p>
                            <p><b>Kunde:</b> {order.company}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
