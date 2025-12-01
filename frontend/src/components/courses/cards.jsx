/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PaymentOverlay from "./PaymentOverlay"; // Import the new component
import Spinner from "../courses/Spinner";

const Cards = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);

  const base_api = "https://9kz24kbm-7000.inc1.devtunnels.ms/api";

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.post(`${base_api}/courses/my-courses`, {
          token: token,
        });

        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div className="p-5 text-red-500">{error}</div>;

  const filteredCourses = courses.filter((course) => {
    if (filter === "inprogress") {
      return course.status === 1;
    }
    if (filter === "finished") {
      return course.status !== 1;
    }
    return true; // 'all'
  });

  return (
    <div className="p">
      <div className="filter-buttons-container">
        <button
          onClick={() => setFilter("all")}
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("inprogress")}
          className={`filter-btn ${filter === "inprogress" ? "active" : ""}`}
        >
          Inprogress
        </button>
        <button
          onClick={() => setFilter("finished")}
          className={`filter-btn ${filter === "finished" ? "active" : ""}`}
        >
          Finished
        </button>
      </div>
      {/* Animation Wrapper: The key changes when the filter changes, re-triggering the animation */}
      <div key={filter} style={{ animation: "fadeIn 0.5s ease-out" }}>
        <div className="course-grid">
          {filteredCourses.map((course, index) => (
            <SingleCourseCard
              key={course.courses_code || index}
              course={course}
              base_api={base_api}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const SingleCourseCard = ({ course, base_api }) => {
  const navigate = useNavigate(); // <--- ADD THIS LINE
  const [showPayment, setShowPayment] = useState(false); // State to control the overlay

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const calculateProgress = (start, end) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const today = new Date().getTime();

    if (today < startDate) return 0;
    if (today > endDate) return 100;

    const totalDuration = endDate - startDate;
    const timeElapsed = today - startDate;

    if (totalDuration <= 0) return 100;

    return Math.floor((timeElapsed / totalDuration) * 100);
  };

  const progress = calculateProgress(course.start_date, course.end_date);

  // Open overlay to show payment status
  const handlePaymentStatusClick = () => {
    setShowPayment(true);
  };

  return (
    <>
      <div className="course-card">
        <div className="card-image">
          <img
            src={`${base_api.replace("/api", "")}${course.img_url}`}
            alt={course.courses_name}
            loading="eager"
          />
          <span
            className={`status-badge ${
              course.status === 1 ? "status-active" : "status-completed"
            }`}
          >
            {course.status === 1 ? "inprogress" : "Finished"}
          </span>
        </div>
        <div className="card-bodys">
          <h3 className="course-title-1">{course.courses_name}</h3>
          <div className="date-row">
            <span>Start: {formatDate(course.start_date)}</span>
            <span>End: {formatDate(course.end_date)}</span>
          </div>
          <div className="progress-container">
            <div className="progress-label">
              <span>Course Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="footer">
          <button
            className="footer-button"
            style={{
              backgroundColor:
                Number(course.pending_amount) > 0 ? "#fee2e2" : "#dcfce7",
              color: Number(course.pending_amount) > 0 ? "#dc2626" : "#16a34a",
            }}
            onClick={handlePaymentStatusClick}
          >
            {Number(course.pending_amount) > 0 ? "Due" : "Paid"}
          </button>

          <button
            className="footer-button"
            onClick={() => navigate(`/course/${course.courses_code}`)}
          >
            View Course
          </button>
        </div>
      </div>

      {/* Render the Payment Overlay */}
      <PaymentOverlay
        show={showPayment}
        onClose={() => setShowPayment(false)}
        courseName={course.courses_name}
        totalAmount={course.courses_amount}
        paidAmount={course.courses_amount - course.pending_amount}
        dueAmount={course.pending_amount}
      />
    </>
  );
};

export default Cards;
