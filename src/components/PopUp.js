import React from 'react'
import style from './PopUp.module.css';

export function test() {
    alert("Hello");
}

export default function PopUp(props) {
    return (props.trigger ?
        <div className={style.popup_wrapper}>
            <h1 onClick={props.close}>PopUp</h1>
        </div> : ""
    )
}
