import React from 'react';
import style from './Sidebar.module.css';

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
]

export default function Sidebar() {
    return (
        <div className={style.sidebar}>
            <h4>Termine</h4>
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
            </div>
        </div>
    )
}
