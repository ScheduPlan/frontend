import React, { useEffect, useState } from 'react';
import style from './Sidebar.module.css';
import axios from 'axios';
import url from '../BackendURL';

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
    }
]

export default function Sidebar() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get(url + "/orders").then(res => {
            console.log("Orders", res.data);
            setOrders(res.data);
        })
    }, []);
    return (
        <div className={style.sidebar}>
            <h2>Aufträge</h2>
            <div className={style.appointment_box_wrapper}>
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
