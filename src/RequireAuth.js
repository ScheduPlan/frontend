import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./AuthProvider";


const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useContext(AuthContext);

    return (
        auth?.roles?.find(role => {console.log("Rolle:", role);
            return allowedRoles?.includes(role);

            }) //alles hinter auth? nur aufrufen, wenn auth nicht null //find = for each "role"
            ? <Outlet /> // Rendere eingebetete Route(n) im Routing (greift element aus Route ab)
            : auth?.email 
                ? window.location.href = '/unauthorized' //<Navigate to="/unauthorized" replace /> // falsche Rolle
                : <Navigate to="/" replace /> // nicht angemeldet
    );
}
export default RequireAuth;