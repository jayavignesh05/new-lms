import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaBriefcase, FaSpinner, FaArrowRight, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

// 1. JOB DATA
const availableJobs = [
  {
    id: 1,
    title: "Java Full Stack Developer",
    company: "Infosys",
    salary: "₹4.5 LPA",
    requiredCourses: ["ESS-106", "DATA-203"], 
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Zoho",
    salary: "₹7 LPA",
    requiredCourses: ["PRO-306", "ADV-UX-999"],
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "TCS",
    salary: "₹5 LPA",
    requiredCourses: ["DATA-202", "DATA-203"],
  },
  {
    id: 4,
    title: "Cloud Architect",
    company: "Amazon AWS",
    salary: "₹15 LPA",
    requiredCourses: ["AWS-900", "LINUX-101"],
  },
];

const courseNames = {
  "ESS-106": "Java Programming",
  "PRO-306": "UI/UX Design",
  "DATA-202": "Power BI",
  "DATA-203": "HTML & Database",
  "ADV-UX-999": "Advanced Interaction Design",
  "AWS-900": "AWS Solutions Arch",
  "LINUX-101": "Linux Basics"
};

export default function Jobs() {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [ongoingCourses, setOngoingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post("http://localhost:7000/api/courses/my-courses", { token });
        
        // --- LOGIC: Separate Completed (Status 2) vs Ongoing (Status 1) ---
        const completed = response.data
          .filter(c => c.status === 2)
          .map(c => c.courses_code);
          
        const ongoing = response.data
          .filter(c => c.status === 1)
          .map(c => c.courses_code);

        setCompletedCourses(completed);
        setOngoingCourses(ongoing);

      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="p-10 flex justify-center"><FaSpinner className="animate-spin text-3xl text-blue-600"/></div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Career Path</h1>
        <p className="text-gray-500">Jobs based on your COMPLETION status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {availableJobs.map((job) => {
          // Identify Status for each requirement
          const statusList = job.requiredCourses.map(code => {
            if (completedCourses.includes(code)) return "DONE";
            if (ongoingCourses.includes(code)) return "ONGOING";
            return "MISSING";
          });

          // If more than 1 course is MISSING (Not bought), Hide Job
          const missingCount = statusList.filter(s => s === "MISSING").length;
          if (missingCount > 1) return null;

          const isEligible = statusList.every(s => s === "DONE");
          const hasOngoing = statusList.includes("ONGOING");

          // Determine Card Color
          let borderColor = "border-red-200";
          let badgeText = "Enroll Now";
          let badgeColor = "bg-red-100 text-red-700";

          if (isEligible) {
            borderColor = "border-green-200";
            badgeText = "Ready to Apply";
            badgeColor = "bg-green-100 text-green-700";
          } else if (hasOngoing) {
            borderColor = "border-blue-200";
            badgeText = "Finish Learning";
            badgeColor = "bg-blue-100 text-blue-700";
          } else if (missingCount === 1) {
            borderColor = "border-yellow-200";
            badgeText = "1 Step Away";
            badgeColor = "bg-yellow-100 text-yellow-700";
          }

          return (
            <div key={job.id} className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col ${borderColor}`}>
              
              <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${badgeColor}`}>
                {badgeText}
              </div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </div>
              </div>

              {/* Requirement Checklist */}
              <div className="mb-6 flex-grow">
                <div className="flex flex-col gap-3">
                  {job.requiredCourses.map((code) => {
                    const isDone = completedCourses.includes(code);
                    const isOngoing = ongoingCourses.includes(code);

                    return (
                      <div key={code} className="flex items-center justify-between text-sm">
                        <span className={`flex items-center gap-2 ${isDone ? "text-gray-700" : "text-gray-500"}`}>
                          {/* ICON LOGIC */}
                          {isDone ? (
                            <FaCheckCircle className="text-green-500" />
                          ) : isOngoing ? (
                            <FaClock className="text-blue-500" />
                          ) : (
                            <FaTimesCircle className="text-yellow-500" />
                          )}
                          
                          {courseNames[code] || code}
                        </span>
                        
                        {/* Status Text */}
                        {isOngoing && <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">In Progress</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Button Logic */}
              <div className="pt-4 border-t border-gray-100">
                {isEligible ? (
                  <button className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
                    Apply Now <FaBriefcase />
                  </button>
                ) : hasOngoing ? (
                  // If course is bought but status is 1
                  <Link to={`/course/${job.requiredCourses.find(c => ongoingCourses.includes(c))}`} 
                    className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                    Continue Learning <FaArrowRight />
                  </Link>
                ) : (
                  // If missing 1 course
                  <Link to={`/course/${job.requiredCourses.find(c => !completedCourses.includes(c) && !ongoingCourses.includes(c))}`}
                    className="w-full bg-yellow-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-yellow-600 transition flex items-center justify-center gap-2">
                    Enroll Now <FaArrowRight />
                  </Link>
                )}
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}