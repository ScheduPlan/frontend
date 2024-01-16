import React, { useContext, useEffect, useState } from 'react';
import style from './Sidebar.module.css';
import axios from 'axios';
import url from '../BackendURL';
import sortItems from '../utility/sortItems';
import PopUp from './PopUp';
import AuthContext from '../AuthProvider';
import Swal from 'sweetalert2';

export default function Sidebar(props) {

    const { user } = useContext(AuthContext);
    const path = "/orders";

    const [orders, setOrders] = useState([]);
    const [isOpen, setOpen] = useState(true);

    const [sortOption, setSortOption] = useState();
    const [filterOption, setFilterOption] = useState();

    const [itemObjects, setItemObjects] = useState([]);
    const [pathToItem, setPathToItem] = useState("");
    const [pathToEdit, setPathToEdit] = useState("");
    const [isPopUpOpen, setPopUpOpen] = useState(false);

    useEffect(() => {
        getItemObjects();
    }, [user, path]);

    /**
     * get all Items from database for the list
     */
    function getItemObjects() {
        axios.get(url + path)
            .then(response => {
                setItemObjects(response.data);
            });
    }

    /**
     * gets all orders from API for the selected team
     */
    useEffect(() => {
        if (props.activeTeamId != null && props.activeTeamId != "") {
            axios.get(url + "/orders").then(res => {
                setOrders(sortItems(res.data.filter(order => (order.team.id == props.activeTeamId) && (order.state == "PLANNED")), "commissionNumber"));
            });
        } else {
            getAllOrders();
        }
    }, [props.activeTeamId]);

    /**
   * toggles pop up & sets path to items and path to the edit forms
   * @param {*} item 
   */
    function togglePopUp(item) {
        if (isPopUpOpen) {
            setPopUpOpen(false);
        } else {
            const customerId = itemObjects.find(elem => elem.id == item.id).customer.id;
            setPathToItem(url + "/customers/" + customerId + path + "/" + item.id);

            setPathToEdit('/' + user.user.role.toLowerCase() + path + "/" + item.id);

            setTimeout(() => {
                setPopUpOpen(true);
            }, 250);
        }
    }

    /**
     * gets all orders that are not already planned
     */
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

    /**
     * sorts order list for the choosen option
     * @param {*} e 
     */
    const getSortOption = (e) => {
        setSortOption(e.target.value);

        switch (e.target.value) {
            case null:
                setOrders(sortItems(orders, "commissionNumber"));
                break;
            case "none":
                setOrders(sortItems(orders, "commissionNumber"));
                break;
            case "company":
                setOrders(sortItems(orders, "customer", "company"));
                break;
            case "team":
                setOrders(sortItems(orders, "team", "description", "name"));
            default: setOrders(sortItems(orders, e.target.value));
                break;
        }
    }

    /**
     * allows to drag and drop an order into a calendar if a team calendar is picked
     * returns error alert if not
     */
    function validateCurrentTeam(order) {
        if(!props.allOrdersDisplayed) {
            props.activeOrder(order);
        } else {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Termin anlegen nicht möglich!',
                text: "Bitte, wählen Sie zuerst ein Team aus.",
                showConfirmButton: true,
                confirmButtonColor: "var(--primary)",
                confirmButtonText: "Ok",
                timer: 5000,
            });
        }
    }

    return (
        <div className={style.sidebar + (!isOpen ? " " + style.sidebar_closed : " ")}>
            <h2>Aufträge</h2>
            <div className={style.btn_close} onClick={toggleSidebar}>{'<'}</div>

            <div className={style.filter_row}>
                <span>sortieren</span>
                <select name="sortOptions" className={style.filter} onChange={getSortOption}>
                    <option value="none" readOnly>Bitte wählen</option>
                    <option value="number">Auftr.-Nr.</option>
                    <option value="commissionNumber">Kom.-Nr.</option>
                    <option value="company">Kunde</option>
                    <option value="plannedDuration">geschätzter Aufwand</option>
                    <option value="weight">Gewicht</option>
                    {props.allOrdersDisplayed ?
                        <option value="team">Team</option> : ""}
                </select>
            </div>
            <div className={style.filter_row}>
                <span>filtern</span>
                <select name="filterOptions" className={style.filter}>
                    <option value="none" readOnly>Bitte wählen</option>
                    <option value="number">Auftr.-Nr.</option>
                    <option value="commissionNumber">Kom.-Nr.</option>
                    <option value="company">Kunde</option>
                    <option value="plannedDuration">geschätzter Aufwand</option>
                </select>
            </div>
            <button className={'btn secondary ' + style.btn_showAll} onClick={() => {getAllOrders(); props.setAllOrdersDisplayed(true);}}>alle anzeigen</button>

            <div className={style.appointment_box_wrapper}>
                {orders.map((order) => (
                    <div key={order.id} className={style.appointment_box} id={order.id} onClick={() => togglePopUp(order)} draggable onDragStart={() => {validateCurrentTeam(order)}}>
                        <p className={style.title}>Auftr.-Nr.: {order.number}</p>
                        <div className={style.appointment_detail}>
                            <p><b>Kom.-Nr.:</b> {order.commissionNumber}</p>
                            <p><b>Kunde:</b> {order.customer.company}</p>
                            <p><b>geschätzter Aufwand:</b> {order.plannedDuration}h</p>
                            <p><b>Team:</b> {order.team.description.name}</p>
                        </div>
                    </div>
                ))}
            </div>
            <PopUp trigger={isPopUpOpen} close={togglePopUp} path={path} pathToItem={pathToItem} pathToEdit={pathToEdit} /> {/*To Do: Das mit dem PopUp öffnen & schließen anders regeln -> window eventlistener */}
        </div>
    )
}
