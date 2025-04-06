import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

const PrivateRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
