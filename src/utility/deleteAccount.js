import axios from "axios";
import url from "../BackendURL";
import Swal from "sweetalert2";
import logout from "./logout";

export default async function deleteAccount(user, callback) {
    Swal.fire({
        position: 'top',
        title: 'Sind Sie sicher, dass Sie Ihren Account löschen möchten?',
        icon: 'warning',
        iconColor: 'var(--warning)',
        showCancelButton: true,
        confirmButtonColor: "var(--success)",
        cancelButtonColor: "var(--error)",
        cancelButtonText: "Nein",
        confirmButtonText: "Ja",
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.delete(url + "/employees/" + user.id).then(() => {
                    Swal.fire({
                        position: 'top',
                        icon: 'info',
                        title: 'Account gelöscht!',
                        text: 'Sie werden automatisch abgemeldet.',
                        showConfirmButton: false,
                        timer: 3000
                    }).then(() => {
                        logout(callback);
                    });
                })
            } catch (e) {
                alert(e);
            }
        }
    });
}