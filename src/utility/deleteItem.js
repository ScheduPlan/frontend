import Swal from "sweetalert2";
import axios from "axios";

/**
   * deletes element from list & fire swal pop-up
   * @param {*} event 
   */
export default function deleteItem(path) {
    Swal.fire({
        position: 'top',
        title: 'Sind Sie sicher, dass Sie dieses Element löschen möchten?',
        icon: 'warning',
        iconColor: 'var(--warning)',
        showCancelButton: true,
        confirmButtonColor: "var(--success)",
        cancelButtonColor: "var(--error)",
        cancelButtonText: "Nein",
        confirmButtonText: "Ja",
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(path);

            Swal.fire({
                position: 'top',
                title: "Element gelöscht!",
                icon: "success",
                confirmButtonText: 'Ok',
                confirmButtonColor: 'var(--success)',
                timer: 2000
            })

            /*setTimeout(function () {
                window.location.reload();
            }, 2500);*/
        }
    });
}

export function deleteOrderWithEvents(path) {
    Swal.fire({
        position: 'top',
        title: "Sind Sie sicher, dass Sie dieses Element inkl. aller zugehöriger Termine löschen möchten?",
        icon: 'warning',
        iconColor: 'var(--warning)',
        showCancelButton: true,
        confirmButtonColor: "var(--success)",
        cancelButtonColor: "var(--error)",
        cancelButtonText: "Nein",
        confirmButtonText: "Ja",
    }).then((result) => {
        if (result.isConfirmed) {
            axios.get(path + "/events").then(res => {
                res.data.forEach(event => axios.delete(path + "/events/" + event.id));
                axios.delete(path);
            });

            Swal.fire({
                position: 'top',
                title: "Element gelöscht!",
                icon: "success",
                confirmButtonText: 'Ok',
                confirmButtonColor: 'var(--success)',
                timer: 2000
            });

            /*setTimeout(function () {
                window.location.reload();
            }, 2500);*/
        }
    });
}