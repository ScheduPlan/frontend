import Swal from "sweetalert2";
import url from "../BackendURL";
import axios from "axios";

/**
   * deletes element from list & fire swal pop-up
   * @param {*} event 
   */
export default function deleteItem(path) {
    console.log(path);
    
    Swal.fire({
        title: "Sind Sie sicher, dass Sie dieses Element löschen möchten?",
        icon: "warning",
        iconColor: "#A50000AB",
        showCancelButton: true,
        confirmButtonColor: "var(--green)",
        cancelButtonColor: "var(--red)",
        cancelButtonText: "Nein",
        confirmButtonText: "Ja",
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(url + path);

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