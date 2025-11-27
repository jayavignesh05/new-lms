import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useNavigate, Link } from "react-router-dom";
import "./header.css";

export default function Header({ profilePic }) {
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
    navigate("/");
  };

  const closeBox = () => {
    setIsBoxOpen(false);
  };
const name = localStorage.getItem("userName");

  return (
    <div className="app-header ">
      <div className="header-root d-flex align-items-center ms-auto">
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
