import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../redux/UserSlice";
import axios from "axios";
export default function DashBoardSidebar()
{
  const location = useLocation();
  const [tab, settab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() =>
  {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    settab(tabFromUrl);
  }, [location.search]);
  const handleSignOut = async () =>
  {
    try
    {
      await axios.post("/api/user/signOut").then(() =>
      {
        dispatch(signOutSuccess())
      })
    } catch (err)
    {
      console.log(err)
    }
  }
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1" >

          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor={"dark"}
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <>
              <Sidebar.Item icon={HiChartPie} className="cursor-pointer" as="div" active={tab === "dashboard" || !tab}>
                <Link to="/dashboard?tab=dashboard">
                  Dashboard
                </Link>
              </Sidebar.Item>
              <Link to={"/dashboard?tab=posts"}>
                <Sidebar.Item active={tab === "posts"} icon={HiDocumentText} as="div">
                  Posts
                </Sidebar.Item>
              </Link>
              <Link to={"/dashboard?tab=users"} >
                <Sidebar.Item active={tab === "users"} icon={HiOutlineUserGroup} as="div" >
                  Users
                </Sidebar.Item>
              </Link>
              <Sidebar.Item icon={HiAnnotation} className="cursor-pointer">
                <Link to="/dashboard?tab=comments">
                  Comments
                </Link>
              </Sidebar.Item>
            </>
          )}

          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignOut}>
            Log Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
