import Swal from "sweetalert2";
import axios from "axios";

/**
   * deletes element from list & fire swal pop-up
   * @param {*} event 
   */
export default function deleteItem(path) {    
    Swal.fire({
        title: "Sind Sie sicher, dass Sie dieses Element löschen möchten?",
        icon: "warning",
        iconColor: "#A50000AB",
        showCancelButton: true,
        confirmButtonColor: "var(--primary)",
        cancelButtonColor: "var(--red)",
        cancelButtonText: "Nein",
        confirmButtonText: "Ja",
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(path);

            Swal.fire({
                title: "Element gelöscht!",
                icon: "success",
                showConfirmButton: false,
                timer: 2000
            });

            setTimeout(function () {
                window.location.reload();
            }, 2500);
        }
    });
}