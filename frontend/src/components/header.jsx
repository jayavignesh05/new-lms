import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdMenu } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import "./header.css";
import { RiMenuFold2Fill } from "react-icons/ri";

export default function Header({ profilePic, toggleSidebar }) {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsBoxOpen(true);
  };

  const handleMouseLeave = () => {
    setIsBoxOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const closeBox = () => {
    setIsBoxOpen(false);
  };
const name = localStorage.getItem("userName");

  return (
    <div className="app-header ">
      <button
        className="btn p-0 d-lg-none me-3" 
        onClick={toggleSidebar}
      >
        <RiMenuFold2Fill size={22} />
      </button>
      <div className="header-root d-flex align-items-center ms-auto ">
        <div
          className="profile-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="profile-name fs-6 ">{name}</div>
          <div className="profile-icon">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="header-profile-pic"
                loading="eager"
              />
            ) : (
              <CgProfile size={30} />
            )}
          </div>
          {isBoxOpen && (
            <div className="profile-dropdown">
              <Link
                to="/profile"
                className="dropdown-items"
                onClick={closeBox}
              >
                Edit Profile
              </Link>
              <div
                className="dropdown-items"
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
