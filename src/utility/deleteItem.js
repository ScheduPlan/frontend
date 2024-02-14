import Swal from "sweetalert2";
import axios from "axios";

/**
   * deletes element from list & fire swal pop-up
   * @param {*} event 
   */
export default function deleteItem(path, onSuccess, onError) {
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
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await axios.delete(path).then(() => {
                    Swal.fire({
                        position: 'top',
                        title: "Element gelöscht!",
                        icon: "success",
                        confirmButtonText: "Ok",
                        confirmButtonColor: "var(--success)",
                        timer: 2000
                      }).then(() => {
                        onSuccess(res);
                      });
                })
            } catch (error) {
                if(onError) {
                    onError(error);
                }
            }
        }
    });
}