import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useLocation } from "react-router-dom";
import "./sidebar.css";
import caddCentreLogo from "../assets/caddcentre.png";
import { VscHome } from "react-icons/vsc";
import { LuGraduationCap } from "react-icons/lu";
import { BsPerson, BsTelephone, BsSuitcaseLg } from "react-icons/bs";
import {
  MdOutlinePrivacyTip,
  MdScience,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { RiMenuFold2Fill, RiMenuFoldFill } from "react-icons/ri";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const [appVersion, setAppVersion] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const response = await axios.get(
          "https://9kz24kbm-7000.inc1.devtunnels.ms/api/side/sidebar"
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
    } else if (name === "Test") {
      return <MdScience size={24} />;
    }
    return null;
  };
  const handleLinkClick = () => {
    if (window.innerWidth <= 992) {
      toggleSidebar();
    }
  };
  return (
    <>
      <div
        className={`leftside d-flex flex-column vh-100 bg-white border-end ${
          isSidebarOpen ? "open" : "collapsed"
        }`}
      >
        <div className="top-left d-flex align-items-center border-bottom p-3 justify-center">
          {isSidebarOpen && (
            <img src={caddCentreLogo} alt="CADD Centre Logo" loading="eager" />
          )}
          <button
            className={`btn p-0  ${
              isSidebarOpen ? "ms-auto position-relative right-2" : "mx-auto"
            }`}
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <RiMenuFoldFill size={22} />
            ) : (
              <RiMenuFold2Fill size={22} />
            )}
          </button>
        </div>
        <div className="bottom-left  overflow-auto">
          <ul className="list-unstyled p-2 d-flex flex-column gap-2">
            {appVersion.map((item) => (
              <li key={item.id}>
                <NavLink
                  className={({ isActive }) => {
                    let finalIsActive = isActive;
                    if (
                      item.name === "My Courses" &&
                      (location.pathname === "/" ||
                        location.pathname === "/home")
                    ) {
                      finalIsActive = true;
                    }
                    if (
                      item.route === "profile" &&
                      location.pathname.startsWith("/profile")
                    ) {
                      finalIsActive = true;
                    }
                    return `sidebar-link d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none ${
                      finalIsActive ? "active" : ""
                    }`;
                  }}
                  to={
                    item.name === "My Courses"
                      ? "/home"
                      : `/${item.route.toLowerCase()}`
                  }
                  onClick={handleLinkClick}
                >
                  <span>{getIcons(item.name)}</span>
                  <span className="sidebar-link-text">{item.name}</span>
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
