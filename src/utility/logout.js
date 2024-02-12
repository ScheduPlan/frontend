export default function logout(callback) {
    sessionStorage.clear();
    callback();
}