import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaAward, FaTrophy, FaMedal } from "react-icons/fa6";
import "./home.css";
import Spinner from "../components/courses/Spinner";
import HtmlCertificateBtn from "../components/certificate/HtmlCertificateBtn";

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const base_api = "https://9kz24kbm-7000.inc1.devtunnels.ms/api";
  const token = localStorage.getItem("token");

  const studentName = localStorage.getItem("userName") || "Student";

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.post(`${base_api}/courses/my-courses`, {
          token: token,
        });

        const completedCourses = response.data.filter((c) => c.status === 2);

        setCertificates(completedCourses);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  if (loading) return <Spinner />;

  const totalCount = certificates.length;

  const getLastAchievementDate = () => {
    if (totalCount === 0) return "N/A";

    const sortedCerts = [...certificates].sort((a, b) => {
      return new Date(b.end_date) - new Date(a.end_date);
    });

    const lastDate = sortedCerts[0].end_date;
    return new Date(lastDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-4">
      <h2 className="page-title">My Certificates</h2>

      <div className="stats-overview">
        <div className="stat-box total-box">
          <div className="stat-icon-circle blue">
            <FaTrophy />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Earned</span>
            <h3 className="stat-value">{totalCount}</h3>
          </div>
        </div>

        <div className="stat-box achievement-box">
          <div className="stat-icon-circle gold">
            <FaMedal />
          </div>
          <div className="stat-details">
            <span className="stat-label">Last Achievement</span>
            <h3 className="stat-value">{getLastAchievementDate()}</h3>
          </div>
        </div>

      </div>

      {certificates.length > 0 ? (
        <div className="cert-grid">
          {certificates.map((cert ,index) => (
            <div key={cert.user_course_id || index} className="cert-card">

              <div className="cert-icon-box">
                <FaAward />
              </div>

              <div className="cert-info">
                <h3>{cert.courses_name}</h3>
                <p>Course Code: {cert.courses_code}</p>
                <span className="completed-date">Status: Completed</span>
              </div>

              <div className="cert-action">
                <HtmlCertificateBtn
                  studentName={studentName}
                  courseName={cert.courses_name}
                />
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FaAward size={50} color="#cbd5e1" />
          <p>You haven't completed any courses yet.</p>
        </div>
      )}
    </div>
  );
};

export default MyCertificates;