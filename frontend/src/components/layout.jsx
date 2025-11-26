import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import axios from "axios";
import defaultProfilePic from "../assets/profilepic.png";

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(defaultProfilePic);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchProfilePic = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const picRes = await axios.post(
          `http://localhost:7000/api/profile/getProfilePic`,
          { token },
          { responseType: "blob" }
        );
        if (picRes.data.size > 0) {
          setProfilePic(URL.createObjectURL(picRes.data));
        }
      } catch (err) {
        console.error("Failed to fetch profile picture for header:", err);
      }
    };

    fetchProfilePic();
  }, []);

  return (
    <div className="layout">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="rightside">
        <Header toggleSidebar={toggleSidebar} profilePic={profilePic} />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
