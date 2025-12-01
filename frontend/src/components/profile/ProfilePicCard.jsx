import React, { useRef } from "react";
import { MdOutlineEdit } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const ProfilePicCard = ({ profilePic, setProfilePic, defaultImage }) => {
  const fileInputRef = useRef(null);
  const base_api = "https://9kz24kbm-7000.inc1.devtunnels.ms/api";

  const handleProfilePicEditClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Data = reader.result.split(",")[1];
      const token = localStorage.getItem("token");

      try {
        const response = await axios.post(`${base_api}/profile/addProfilePic`, {
          token,
          mime_type: file.type,
          file_data: base64Data,
        });

        toast.success(response.data.message);
        const imageUrl = URL.createObjectURL(file);
        setProfilePic(imageUrl);
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to upload profile picture.";
        toast.error(errorMessage);
      }
    };
  };

  return (
    <div className="grid-card profile-pic-card">
      <div className="profile-pic">
        <img src={profilePic || defaultImage} alt="Profile" loading="eager"/>
        <div className="profile-pic-edit" onClick={handleProfilePicEditClick}>
          <MdOutlineEdit />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleProfilePicChange}
          style={{ display: "none" }}
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default ProfilePicCard;