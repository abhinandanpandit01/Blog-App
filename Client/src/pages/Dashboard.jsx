import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashBoardSidebar from "../Components/DashBoardSidebar";
import DashBoardProfile from "../Components/DashBoardProfile";
import DashBoardPost from "../Components/DashBoardPost";
import DashBoardUsers from "../Components/DashBoardUsers";
import DashboardComment from "../Components/DashboardComment";
import DashDashboard from "../Components/DashDashboard";

export default function Dashboard() {
  const location = useLocation();
  const [tab, settab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    settab(tabFromUrl);
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* SideBar */}
        <DashBoardSidebar />
      </div>
      {/* Main */}
      {tab === "profile" && <DashBoardProfile />}
      {tab === "posts" && <DashBoardPost/>}
      {tab === "users" && <DashBoardUsers/>}
      {tab === "comments" && <DashboardComment/>}
      {tab === "dashboard" && <DashDashboard/>}
    </div>
  );
}
