import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import axios from "axios";
import defaultProfilePic from "../assets/profilepic.jpg";

export default function Layout() {
  // Set initial state based on window width
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 992);
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
          `https://9kz24kbm-7000.inc1.devtunnels.ms/api/profile/getProfilePic`,
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

  // Add effect to handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setSidebarOpen(false); // Collapse on small screens
      } else {
        setSidebarOpen(true); // Expand on large screens
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="layout">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isCollapsed={!isSidebarOpen}
      />
      <div className={`rightside ${!isSidebarOpen ? "sidebar-collapsed" : ""}`}>
        <Header toggleSidebar={toggleSidebar} profilePic={profilePic} />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
