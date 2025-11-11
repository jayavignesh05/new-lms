import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { MdOutlineEdit } from "react-icons/md";
import profileImage from "../assets/profilepic.png";
import dayjs from "dayjs";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdClear, MdCheck } from "react-icons/md";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingCard, setEditingCard] = useState(null); // <-- Ithu thaan namma state
  const [formData, setFormData] = useState({});
  const [genders, setGenders] = useState([]);
  const [currentStatuses, setCurrentStatuses] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const [profileRes, genderRes, statusRes, countryRes] =
          await Promise.all([
            axios.post("http://localhost:8000/api/profile/show", { token }),
            axios.get("http://localhost:8000/api/location/genders"),
            axios.get("http://localhost:8000/api/location/currentstatus"),
            axios.get("http://localhost:8000/api/location/countries"),
          ]);

        setProfileData(profileRes.data);
        setGenders(genderRes.data);
        setCurrentStatuses(statusRes.data);
        setCountries(countryRes.data);
      } catch (e) {
        const errorMessage = e.response?.data?.error || e.message;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const handleEditClick = (cardName) => {
    setEditingCard(cardName);
    const dob = profileData.date_of_birth
      ? dayjs(profileData.date_of_birth).format("YYYY-MM-DD")
      : "";
    setFormData({
      ...profileData,
      email_id: profileData.email,
      gender_id: profileData.gender_id,
      date_of_birth: dob,
      addresses: profileData.addresses.map((addr) => ({
        ...addr,
        countries_id: addr.countries_id,
        state_id: addr.state_id,
      })),
    });

    if (
      cardName === "personalInfo" &&
      profileData.addresses &&
      profileData.addresses.length > 0
    ) {
      fetchStates(profileData.addresses[0].countries_id);
    }
  };

  const handleCancel = () => {
    setEditingCard(null); // <-- Ithu page ah normal aakidum
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://localhost:8000/api/profile/update",
        { ...formData, token }
      );

      const profileRes = await axios.post(
        "http://localhost:8000/api/profile/show",
        { token }
      );
      setProfileData(profileRes.data);

      toast.success(response.data.message || "Profile updated successfully!");
      setEditingCard(null); // <-- Ithu page ah normal aakidum
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update profile.";
      toast.error(errorMessage);
    }
  };

  const fetchStates = async (countryId) => {
    if (!countryId) {
      setStates([]);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/location/states",
        { country_id: countryId }
      );
      setStates(response.data);
    } catch (error) {
      console.error("Failed to fetch states", error);
      setStates([]);
    }
  };

  const handleAddressInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
    setFormData((prev) => ({ ...prev, addresses: updatedAddresses }));

    if (name === "countries_id") {
      fetchStates(value);
    }
  };

  if (loading) return <div className="loading-error-message">Loading...</div>;
  if (error) return <div className="loading-error-message error">{error}</div>;
  if (!profileData)
    return <div className="loading-error-message">No profile data found.</div>;

  return (
    <>
      {/* ====================================================================
        CHANGE 1: Inga 'editing-active' nu oru class add pannirukom.
        editingCard la value iruntha, intha class add aagum.
        ====================================================================
      */}
      <div
        className={`profile-page-wrapper ${
          editingCard ? "editing-active" : ""
        }`}
      >
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
        <div className="profile-grid-container">
          <div className="left-column">
            <div className="grid-card profile-pic-card">
              <div className="profile-pic">
                <img src={profileImage} alt="Profile" />
              </div>
            </div>

            {/* ====================================================================
              CHANGE 2: 'contact-card' kooda 'is-editing' class add pannirukom.
              ====================================================================
            */}
            <div
              className={`grid-card contact-card ${
                editingCard === "contact" ? "is-editing" : ""
              }`}
            >
              <h3>Contact</h3>
              {editingCard === "contact" ? (
                <>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email_id"
                      value={formData.email_id || ""}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact No</label>
                    <input
                      type="text"
                      name="contact_no"
                      value={formData.contact_no || ""}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="contact-item">
                    <span>📧</span>
                    <span>{profileData.email}</span>
                  </div>
                  <div className="contact-item">
                    <span>📞</span>
                    <span>{profileData.contact_no}</span>
                  </div>
                </>
              )}
              <div className="header-actions">
                {editingCard === "contact" ? (
                  <div className="edit-controls">
                    <button onClick={handleSave} className="save-btn">
                      <MdCheck />
                    </button>
                    <button onClick={handleCancel} className="cancel-btn">
                      <MdClear />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick("contact")}
                    className="edit-profile-btn"
                  >
                    <MdOutlineEdit />
                  </button>
                )}
              </div>
            </div>

            <div className="grid-card education-card">
              <h3>Education</h3>
              <p>No education data available.</p>
            </div>
          </div>

          <div className="right-column">
            {/* ====================================================================
              CHANGE 3: 'header-card' kooda 'is-editing' class add pannirukom.
              ====================================================================
            */}
            <div
              className={`grid-card header-card ${
                editingCard === "header" ? "is-editing" : ""
              }`}
            >
              {editingCard === "header" ? (
                <>
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name || ""}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name || ""}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Current Status</label>
                    <select
                      name="current_status_id"
                      value={formData.current_status_id || ""}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="">Select Status</option>
                      {currentStatuses.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <h1>
                    {profileData.first_name} {profileData.last_name}
                  </h1>
                  <p>{profileData.current_status_name || "N/A"}</p>
                </>
              )}
              <div className="header-actions">
                {editingCard === "header" ? (
                  <div className="edit-controls">
                    <button onClick={handleSave} className="save-btn">
                      <MdCheck />
                    </button>
                    <button onClick={handleCancel} className="cancel-btn">
                      <MdClear />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick("header")}
                    className="edit-profile-btn"
                  >
                    <MdOutlineEdit />
                  </button>
                )}
              </div>
            </div>

            {/* ====================================================================
              CHANGE 4: 'profile-summary-card' kooda 'is-editing' class add pannirukom.
              ====================================================================
            */}
            <div
              className={`grid-card profile-summary-card ${
                editingCard === "personalInfo" ? "is-editing" : ""
              }`}
            >
              <h3>Personal Information</h3>
              {editingCard === "personalInfo" ? (
                <>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender_id"
                      value={formData.gender_id || ""}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="">Select Gender</option>
                      {genders.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.gender_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth || ""}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <hr className="form-divider" />
                  <div className="address-edit-header">
                    <h4>Addresses</h4>
                  </div>
                  {formData.addresses &&
                    formData.addresses.map((addr, index) => (
                      <div
                        key={addr.address_id || `new-${index}`}
                        className="address-form-group"
                      >
                        <div className="form-group">
                          <label>Door No</label>
                          <input
                            type="text"
                            name="door_no"
                            value={addr.door_no || ""}
                            onChange={(e) => handleAddressInputChange(index, e)}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label>Street</label>
                          <input
                            type="text"
                            name="street"
                            value={addr.street || ""}
                            onChange={(e) => handleAddressInputChange(index, e)}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label>Area</label>
                          <input
                            type="text"
                            name="area"
                            value={addr.area || ""}
                            onChange={(e) => handleAddressInputChange(index, e)}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label>City</label>
                          <input
                            type="text"
                            name="city"
                            value={addr.city || ""}
                            onChange={(e) => handleAddressInputChange(index, e)}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label>Pincode</label>
                          <input
                            type="text"
                            name="pincode"
                            value={addr.pincode || ""}
                            onChange={(e) => handleAddressInputChange(index, e)}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label>Country</label>
                          <select
                            name="countries_id"
                            value={addr.countries_id || ""}
                            onChange={(e) => handleAddressInputChange(index, e)}
                            className="form-control"
                          >
                            <option value="">Select Country</option>
                            {countries.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>State</label>
                          <select
                            name="state_id"
                            value={addr.state_id || ""}
                            onChange={(e) => handleAddressInputChange(index, e)}
                            className="form-control"
                            disabled={!addr.countries_id}
                          >
                            <option value="">Select State</option>
                            {states.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  <div className="header-actions">
                    {/* This is intentionally left here to place the buttons at the top right */}
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <strong>Gender:</strong> {profileData.gender || "N/A"}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {formatDate(profileData.date_of_birth)}
                  </p>
                  <div className="address-list-title">Addresses:</div>
                  {profileData.addresses &&
                  profileData.addresses.length > 0 ? (
                    profileData.addresses.map((addr) => (
                      <div key={addr.address_id} className="address-item">
                        <div>
                          {addr.door_no}, {addr.street}
                        </div>
                        <div>
                          {addr.area}, {addr.city} - {addr.pincode}
                        </div>
                        <div>
                          {addr.state_name}, {addr.country_name}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No addresses found.</p>
                  )}
                </>
              )}
              <div className="header-actions">
                {editingCard === "personalInfo" ? (
                  <div className="edit-controls">
                    <button onClick={handleSave} className="save-btn">
                      <MdCheck />
                    </button>
                    <button onClick={handleCancel} className="cancel-btn">
                      <MdClear />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick("personalInfo")}
                    className="edit-profile-btn"
                  >
                    <MdOutlineEdit />
                  </button>
                )}
              </div>
            </div>

            <div className="grid-card experience-card">
              <h3>Experience</h3>
              <p>No work experience data available.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;