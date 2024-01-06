import React, { useEffect, useState } from 'react';
import style from './Sidebar.module.css';
import axios from 'axios';
import url from '../BackendURL';
import sortItems from '../utility/sortItems';

export default function Sidebar(props) {

    const [orders, setOrders] = useState([]);
    const [isOpen, setOpen] = useState(true);

    useEffect(() => {
        if (props.activeTeamId != null && props.activeTeamId != "") {
            axios.get(url + "/orders").then(res => {
                setOrders(sortItems(res.data.filter(order => (order.team.id == props.activeTeamId) && (order.state == "PLANNED")), "commissionNumber"));
            });
        } else {
            getAllOrders();
        }
    }, [props.activeTeamId])

    function getAllOrders() {
        axios.get(url + "/orders").then(res => {
            setOrders(sortItems(res.data.filter(order => order.state == "PLANNED"), "commissionNumber"));
        });
    }

    function toggleSidebar(e) {
        if (isOpen) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }

    function setOrderData(e) {
        props.activeOrder(e);
    }

    return (
        <div className={style.sidebar + (!isOpen ? " " + style.sidebar_closed : " ")}>
            <h2>Aufträge</h2>
            <div className={style.btn_close} onClick={toggleSidebar}>{'<'}</div>
            <button className={'btn secondary ' + style.btn_showAll} onClick={getAllOrders}>alle anzeigen</button>
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
                {orders.map((order) => (
                    <div key={order.id} className={style.appointment_box} draggable onDragStart={() => {setOrderData(order)}}>
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
