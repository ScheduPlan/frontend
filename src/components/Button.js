import style from './Button.module.css';

function Button(props) {
    return (
        <input className={style[props.className]} type={props.type} value={props.label} />
    )
}

export default Button;