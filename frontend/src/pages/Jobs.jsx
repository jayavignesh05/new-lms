import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaBriefcase, FaSpinner, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

// 1. UPDATED JOB DATA (Using YOUR REAL CODES)
const availableJobs = [
  {
    id: 1,
    title: "Java Full Stack Developer",
    company: "Infosys",
    salary: "₹4.5 LPA",
    // You HAVE both "Java" (ESS-106) and "HTML/DB" (DATA-203)
    // Result: 100% Eligible (Green)
    requiredCourses: ["ESS-106", "DATA-203"], 
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Zoho",
    salary: "₹7 LPA",
    // You HAVE "UI/UX" (PRO-306)
    // You DO NOT HAVE "Advanced Design" (ADV-999) -> Result: 50% Match (Yellow)
    requiredCourses: ["PRO-306", "ADV-999"],
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "TCS",
    salary: "₹5 LPA",
    // You HAVE "Power BI" (DATA-202) and "Database" (DATA-203)
    // Result: 100% Eligible (Green)
    requiredCourses: ["DATA-202", "DATA-203"],
  },
  {
    id: 4,
    title: "Senior Cloud Architect",
    company: "Amazon AWS",
    salary: "₹15 LPA",
    // You DO NOT HAVE these courses -> Result: Hidden (as per logic > 1 missing)
    requiredCourses: ["AWS-900", "LINUX-101"],
  },
];

// 2. HELPER MAP (To show nice names instead of codes)
const courseNames = {
  "ESS-106": "Java Programming",
  "PRO-306": "UI/UX Design",
  "DATA-202": "Power BI",
  "DATA-203": "HTML & Database",
  "ADV-999": "Advanced Design Patterns", // Fake course for demo
  "AWS-900": "AWS Solutions Arch",
  "LINUX-101": "Linux Administration"
};

export default function Jobs() {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. FETCH DATA (Same Logic)
  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post("http://localhost:7000/api/courses/my-courses", { token });
        
        // Extracting codes from your real API structure
        const codes = response.data.map(c => c.courses_code);
        setMyCourses(codes);
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
        <p className="text-gray-500">Jobs matched based on your skills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {availableJobs.map((job) => {
          // --- LOGIC: Calculate Missing Courses ---
          const missingCourses = job.requiredCourses.filter(code => !myCourses.includes(code));
          const missingCount = missingCourses.length;

          // HIDE jobs that require MORE than 1 new course
          if (missingCount > 1) return null;

          const isEligible = missingCount === 0;

          return (
            <div 
              key={job.id} 
              className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col ${
                isEligible ? "border-green-200" : "border-yellow-200"
              }`}
            >
              {/* Badge */}
              <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${
                isEligible ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {isEligible ? "Ready to Apply" : "1 Step Away"}
              </div>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </div>
              </div>

              {/* Requirement List */}
              <div className="mb-6 flex-grow">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Requirements</p>
                <div className="flex flex-col gap-3">
                  {job.requiredCourses.map((code) => {
                    const isDone = myCourses.includes(code);
                    return (
                      <div key={code} className="flex items-center justify-between text-sm">
                        <span className={`flex items-center gap-2 ${isDone ? "text-gray-700" : "text-gray-400"}`}>
                          {isDone ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-yellow-500" />}
                          {courseNames[code] || code}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Area */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                   <span className="text-sm font-semibold text-gray-600">{job.salary}</span>
                </div>

                {isEligible ? (
                  <button className="w-full bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
                    Apply Now <FaBriefcase />
                  </button>
                ) : (
                  // If 1 course is missing, show direct Enroll link
                  <Link 
                    to={`/course/${missingCourses[0]}`} 
                    className="w-full bg-yellow-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-yellow-600 transition flex items-center justify-center gap-2"
                  >
                    Enroll in {courseNames[missingCourses[0]]} <FaArrowRight />
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