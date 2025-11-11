import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useLocation } from "react-router-dom";
import "./sidebar.css";
import caddCentreLogo from "../assets/caddcentre.svg";
import { FiMenu } from "react-icons/fi";
import { VscHome } from "react-icons/vsc";
import { LuGraduationCap } from "react-icons/lu";
import { BsPerson, BsTelephone, BsSuitcaseLg } from "react-icons/bs";
import { MdOutlinePrivacyTip } from "react-icons/md";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const [appVersion, setAppVersion] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/side/sidebar"
        );
        setAppVersion(response.data);
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
      }
    };

    fetchSidebarData();
  }, []);

  const getIcons = (name) => {
    if (name === "My Courses") {
      return <VscHome size={24} />;
    } else if (name === "My Certificates") {
      return <LuGraduationCap size={24} />;
    } else if (name === "My Profile") {
      return <BsPerson size={24} />;
    } else if (name === "Contact Us") {
      return <BsTelephone size={24} />;
    } else if (name === "Privacy Policy") {
      return <MdOutlinePrivacyTip size={24} />;
    } else if (name === "Jobs") {
      return <BsSuitcaseLg size={24} />;
    }
    return null;
  };

  return (
    <>
      <div
        className={`leftside d-flex flex-column vh-100 bg-white border-end position-fixed top-0 start-0 ${
          isSidebarOpen ? "open" : ""
        }`}
      >
        <div className="top-left d-flex justify-content-center align-items-center border-bottom ">
          <img src={caddCentreLogo} alt="CADD Centre Logo" />
        </div>
        <div className="bottom-left flex-grow-1 overflow-auto">
          <ul className="list-unstyled p-2 d-flex flex-column gap-2">
            {appVersion.map((item) => (
              <li key={item.id}>
                <NavLink
                  className={({ isActive }) => {
                    let finalIsActive = isActive;
                    if (
                      item.route === "home" &&
                      (location.pathname === "/" ||
                        location.pathname.startsWith("/my-courses"))
                    ) {
                      finalIsActive = true;
                    }
                    if (
                      item.route === "profile" &&
                      location.pathname.startsWith("/profile")
                    ) {
                      finalIsActive = true;
                    }
                    // Using template literals to combine classes
                    return `sidebar-link d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none ${
                      finalIsActive ? "active" : ""
                    }`;
                  }}
                  to={
                    item.name === "My Courses"
                      ? "/home"
                      : `/${item.route.toLowerCase()}`}
                  onClick={toggleSidebar}
                >
                  <span>
                    {getIcons(item.name)}
                  </span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
}
