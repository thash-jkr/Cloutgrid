import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

const PublicRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/" replace />;
};

export default PublicRoute;
