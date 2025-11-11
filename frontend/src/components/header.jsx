import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useNavigate, Link } from "react-router-dom";
import "./header.css";

export default function Header() {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const navigate = useNavigate();

  const toggleBox = () => {
    setIsBoxOpen(!isBoxOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const closeBox = () => {
    setIsBoxOpen(false);
  };

  return (
    <div className="app-header ">
      <div className="header-root d-flex align-items-center ms-auto">
        <div className="profile-name fs-6 ">jayavignesh</div>
        <div
          className="profile-icon"
          onClick={toggleBox}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <CgProfile size={30} />
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
