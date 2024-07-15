import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
export default function PrivateRoute()
{
  const { currentUser } = useSelector((state) => state.user);
  // Outlet lets us to run the nested navigate url 
  return currentUser ? <Outlet /> : <Navigate to="/signIn" />;
}
