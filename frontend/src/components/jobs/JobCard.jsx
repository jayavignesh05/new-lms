import React, { useState } from "react"; // 1. Import useState
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaRegNewspaper,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import { courseNames } from "./jobsData";

export default function JobCard({
  job,
  completedCourses,
  ongoingCourses,
  onClick,
}) {
  // 2. Add state to track "Applied" status
  const [hasApplied, setHasApplied] = useState(false);

  const matchedCourses = job.requiredCourses.filter((code) =>
    completedCourses.includes(code)
  );

  const matchPercentage = Math.round(
    (matchedCourses.length / job.requiredCourses.length) * 100
  );

  const isEligible = matchPercentage === 100;

  const statusList = job.requiredCourses.map((code) => {
    if (completedCourses.includes(code)) return "DONE";
    if (ongoingCourses.includes(code)) return "ONGOING";
    return "MISSING";
  });

  const missingCount = statusList.filter((s) => s === "MISSING").length;
  if (missingCount > 1) return null;

  // 3. Handler for Apply Button
  const handleApply = (e) => {
    e.stopPropagation(); // Prevents the click from triggering the parent card onClick
    setHasApplied(true);
    // You can add an API call here if needed
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between relative group w-full cursor-pointer"
    >
      {/* Top Content */}
      <div>
        <div className="flex justify-between items-start gap-3 mb-2">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight mb-1 truncate">
              {job.title}
            </h2>
            <div className="text-xs sm:text-sm text-gray-600 font-medium flex flex-wrap items-center gap-2">
              <span className="truncate max-w-[140px] sm:max-w-[200px]">
                {job.company}
              </span>
              <span className="text-gray-400 text-[11px] sm:text-xs">
                ★ 4.2 (25 Reviews)
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://img.icons8.com/color/48/company.png"
              alt="Logo"
              className="w-10 h-10 opacity-60"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs sm:text-sm text-gray-500 my-3">
          <div className="flex items-center gap-1.5">
            <MdWorkHistory className="text-gray-400" />
            <span>{job.experience || "0-2 Yrs"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaRupeeSign className="text-gray-400" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaMapMarkerAlt className="text-gray-400" />
            <span>{job.city || job.location}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-500 mb-2">
          <FaRegNewspaper className="text-gray-400 mt-1 min-w-4" />
          <span className="text-gray-600 leading-relaxed line-clamp-2">
            {job.description ||
              "We are looking for a skilled professional to join our team. Good communication skills required."}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {job.requiredCourses.map((code) => (
            <span
              key={code}
              className="bg-orange-50 text-gray-600 text-[11px] sm:text-xs px-2 py-1 rounded border border-orange-100 whitespace-nowrap"
            >
              {courseNames[code] || code}
            </span>
          ))}
        </div>

        {/* Match / Apply Button */}
        <div className="shrink-0 w-full sm:w-auto">
          {isEligible ? (
            // 4. Updated Logic for Eligible Button
            <button
              onClick={handleApply}
              disabled={hasApplied}
              className={`relative w-full sm:w-auto px-4 py-2 rounded-lg font-semibold text-xs md:text-sm shadow-sm transition flex items-center justify-center gap-2 whitespace-nowrap
                ${
                  hasApplied
                    ? "bg-green-100 text-green-700 border border-green-200 cursor-default"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                }`}
            >
              <FaCheckCircle /> {hasApplied ? "Applied" : "Apply"}
            </button>
          ) : (
            <button className="relative w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold text-xs md:text-sm overflow-hidden shadow-sm transition flex items-center justify-center gap-2 whitespace-nowrap">
              <span
                className="absolute left-0 top-0 h-full bg-orange-500/50 transition-all duration-700"
                style={{ width: `${matchPercentage}%` }}
              ></span>
              <span className="relative z-10 flex items-center gap-2">
                <FaLock />
                {matchPercentage}%
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
