import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
export default function AdminPrivateRoute()
{
  const { currentUser } = useSelector((state) => state.user);
  // Outlet lets us to run the nested navigate url 
  return currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to="/signIn" />;
}
