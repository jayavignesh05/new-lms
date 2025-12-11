import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { availableJobs, courseNames } from "./jobsData";
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBriefcase,
  FaBuilding,
  FaCheckCircle,
  FaArrowLeft,
  FaSpinner,
  FaGraduationCap,
  FaInfoCircle,
  FaTimes, 
} from "react-icons/fa";
import { FiTarget, FiCheckSquare, FiAlertCircle } from "react-icons/fi";
import axios from "axios";

export default function JobDetails({ jobId: propId, onClose }) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  
  const idToUse = propId ? parseInt(propId) : parseInt(paramId);
  const job = availableJobs.find((j) => j.id === idToUse);

  const [completedCourses, setCompletedCourses] = useState([]);
  const [ongoingCourses, setOngoingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Stats Logic
  const courseCompletion = 50;
  const assessments = 20;
  const score = Math.round((courseCompletion + assessments) / 2);
  const totalScore = 100;
  const percentage = (score / totalScore) * 100;
  const arcLength = 157;
  const strokeDashoffset = arcLength - (arcLength * percentage) / 100;

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const response = await axios.post(
          "https://9kz24kbm-7000.inc1.devtunnels.ms/api/courses/my-courses",
          { token: token }
        );
        const myCourses = response.data;
        const completed = [];
        const ongoing = [];

        myCourses.forEach((course) => {
          if (course.status === 2) completed.push(course.courses_code);
          else if (course.status === 1) ongoing.push(course.courses_code);
        });

        setCompletedCourses(completed);
        setOngoingCourses(ongoing);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserCourses();
  }, []);

  if (!job) return <div className="p-10 text-center">Job not found</div>;
  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );

  const requiredCourses = job.requiredCourses;
  const matchedCourses = requiredCourses.filter((code) =>
    completedCourses.includes(code)
  );
  const missingCourses = requiredCourses.filter(
    (code) => !completedCourses.includes(code)
  );
  const matchPercentage = Math.round(
    (matchedCourses.length / requiredCourses.length) * 100
  );
  const isEligible = matchPercentage === 100;

  return (
    <div className="h-full flex flex-col bg-gray-50 font-sans">
      
      {/* --- 1. HEADER HERO SECTION (Fixed Top Bar) --- */}
      <div className="bg-[#0f172a] p-5 shrink-0 relative shadow-md z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          
          <div className="flex items-center gap-5">
            <div className="bg-white p-2 rounded-lg shadow-sm w-14 h-14 flex items-center justify-center shrink-0">
              <img
                src={job.logo || "https://img.icons8.com/color/48/company.png"}
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight leading-none">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-slate-400 text-xs font-medium">
                <span className="flex items-center gap-1">
                  <FaBuilding /> {job.company}
                </span>
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt /> {job.location}
                </span>
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <FaRupeeSign /> {job.salary}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end md:self-center">
             <button
                disabled={!isEligible}
                className={`px-5 py-2.5 rounded-lg font-bold text-xs shadow-lg transition active:scale-95 ${
                  isEligible
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isEligible ? "Apply Now" : `Complete Skills to Apply`}
              </button>

              {onClose ? (
                <button
                  onClick={onClose}
                  className="bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white p-2 rounded-full transition-all"
                >
                  <FaTimes size={18} />
                </button>
              ) : (
                <button
                  onClick={() => navigate("/jobs")}
                  className="text-slate-400 hover:text-white text-sm font-medium flex items-center gap-1"
                >
                  <FaArrowLeft /> Back
                </button>
              )}
          </div>
        </div>
      </div>

      {/* --- 2. SCROLLABLE MAIN CONTENT --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
          {/* LEFT COLUMN (Content) - Spans 8 cols */}
          {/* CHANGED: Replaced space-y-6 with flex flex-col gap-6 */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* SKILL COMPATIBILITY CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FiTarget className="text-blue-600" /> Skill Compatibility
                </h3>
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${matchPercentage === 100 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                  {matchPercentage}% Match
                </span>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: What User Has */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" /> Your Skills
                  </p>
                  {matchedCourses.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {matchedCourses.map((code) => (
                        <div key={code} className="flex items-center gap-2 px-3 py-2 rounded bg-green-50 border border-green-100">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                           <span className="text-xs font-semibold text-gray-700">{courseNames[code] || code}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No matching skills yet.</p>
                  )}
                </div>

                {/* Right: What is Missing */}
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                    <FiAlertCircle className="text-orange-500" /> Missing Required Skills
                  </p>
                  {missingCourses.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {missingCourses.map((code) => {
                        const isOngoing = ongoingCourses.includes(code);
                        return (
                          <div key={code} className="flex justify-between items-center px-3 py-2 rounded bg-white border border-gray-200 shadow-sm hover:border-blue-200 transition-colors">
                            <span className="text-xs font-medium text-gray-600 border-l-2 border-orange-400 pl-2">
                               {courseNames[code] || code}
                            </span>
                            <button
                              onClick={() => navigate(`/course/${code}`)}
                              className="text-[10px] text-blue-600 font-bold hover:underline uppercase"
                            >
                              {isOngoing ? "Continue" : "enrol now"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-green-600 font-medium flex items-center gap-2">
                      <FaCheckCircle /> You have all required skills!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaBriefcase className="text-gray-400" /> Job Description
              </h3>
              <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                {job.description}
              </div>
            </div>

            {/* ELIGIBILITY */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaGraduationCap className="text-gray-400" /> Eligibility Criteria
              </h3>
              {/* CHANGED: Replaced space-y-2 with flex flex-col gap-2 */}
              <ul className="flex flex-col gap-2">
                {job.eligibility?.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                    <FiCheckSquare className="text-blue-500 mt-1 shrink-0" />
                    {point}
                  </li>
                )) || <li className="text-gray-500 text-sm">Freshers eligible.</li>}
              </ul>
            </div>

            {/* COMPANY */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaBuilding className="text-gray-400" /> About Company
              </h3>
              <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  {job.aboutCompany?.bio}
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-800 font-semibold mt-2">
                  <FaMapMarkerAlt /> {job.aboutCompany?.address}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Stats) - Spans 4 cols */}
          {/* CHANGED: Replaced space-y-6 with flex flex-col gap-6 */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* SCORE CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                  <h3 className="font-bold text-lg text-gray-800">Your CADD Score</h3>
                  <FaInfoCircle className="text-gray-300 hover:text-blue-500 cursor-pointer" />
              </div>
              
              <div className="relative w-40 h-20 mx-auto mb-6">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 120 60">
                  <path d="M 10,60 A 50,50 0 0,1 110,60" stroke="#f1f5f9" strokeWidth="8" fill="none" strokeLinecap="round"/>
                  <path d="M 10,60 A 50,50 0 0,1 110,60" stroke="#3b82f6" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={arcLength} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-end -bottom-1">
                  <span className="text-3xl font-black text-gray-900">{score}</span>
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wide">Total Score</span>
                </div>
              </div>

              {/* CHANGED: Replaced space-y-4 with flex flex-col gap-4 */}
              <div className="flex flex-col gap-4 pt-2">
                 <ProgressBar label="Assessments" percent={assessments} color="bg-indigo-500" />
                 <ProgressBar label="Coursework" percent={courseCompletion} color="bg-blue-400" />
              </div>

              <button className="w-full mt-6 py-3 bg-[#0f172a] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                View Analysis
              </button>
            </div>

            {/* SALARY CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Estimated Salary</h4>
               <div className="text-2xl font-bold text-gray-800">{job.salary}</div>
               <p className="text-[11px] text-gray-400 mt-1">Based on industry standards for {job.location}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const ProgressBar = ({ label, percent, color }) => (
  <div>
    <div className="flex justify-between text-[11px] font-semibold text-gray-500 mb-1">
      <span>{label}</span>
      <span className="text-gray-900">{percent}%</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);