import { useDispatch} from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { deleteUserSuccess } from "../redux/UserSlice";



export default function CheckToken()
{
    const dispatch = useDispatch();
    const token = document.cookie.split("token=")[1];

    return token ? <Outlet /> : (dispatch(deleteUserSuccess()),<Navigate to="/signIn" />)
}
