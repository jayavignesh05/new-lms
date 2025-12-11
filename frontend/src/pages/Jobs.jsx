import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import RightSidebar from "../components/jobs/Sidebar.jsx";
import JobCard from "../components/jobs/JobCard.jsx";
import JobFilters from "../components/jobs/JobFilters.jsx";
import { availableJobs } from "../components/jobs/jobsData";
import JobDetails from "../components/jobs/JobDetails"; 
import axios from "axios";

export default function Jobs() {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [ongoingCourses, setOngoingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- MODAL STATE ---
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Filter State
  const [filters, setFilters] = useState({
    jobTypes: [],
    workModes: [],
    experienceLevels: [],
    locations: [],
  });
  
  // 1. CHANGED: State for Min AND Max salary
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 1500000 });

  // Toggle Checkbox Filters
  const handleToggleFilter = (section, value) => {
    setFilters((prev) => {
      const current = prev[section] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [section]: exists
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  // 2. CHANGED: Handle Range Object from Child
  const handleSalaryChange = (range) => {
    // range comes in as { min: 10000, max: 500000 }
    setSalaryRange(range);
  };

  // Clear All Filters
  const handleClearFilters = () => {
    setFilters({
      jobTypes: [],
      workModes: [],
      experienceLevels: [],
      locations: [],
    });
    // Reset range to defaults
    setSalaryRange({ min: 0, max: 1500000 });
  };

  // Close Modal Handler
  const closeJobModal = () => {
    setSelectedJobId(null);
  };

  // Fetch User Courses
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
          { token }
        );

        const myCourses = response.data || [];
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

  // 3. CHANGED: Filter Logic for Range
  const filteredJobs = availableJobs.filter((job) => {
    if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(job.jobType)) return false;
    if (filters.workModes.length > 0 && !filters.workModes.includes(job.workMode)) return false;
    if (filters.experienceLevels.length > 0 && !filters.experienceLevels.includes(job.experienceLevel)) return false;
    if (filters.locations.length > 0 && !filters.locations.includes(job.city)) return false;
    
    // Check if job salary is within range
    // Assumes job.salaryNumber exists in your data
    if (job.salaryNumber) {
      if (job.salaryNumber < salaryRange.min || job.salaryNumber > salaryRange.max) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="relative ">
      <div className="mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Recommended Jobs for You
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          
          {/* LEFT FILTERS */}
          <div className="w-full lg:w-64 xl:w-72 shrink-0 hidden md:block">
            <div className="sticky top-4">
              <JobFilters
                filters={filters}
                onToggleFilter={handleToggleFilter}
                onClear={handleClearFilters}
                onSalaryChange={handleSalaryChange} // Passes function that accepts {min, max}
              />
            </div>
          </div>

          {/* CENTER JOB LIST */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-8 text-center text-gray-500 bg-white rounded-xl border">
                No jobs match the selected filters.
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id}>
                  <JobCard
                    job={job}
                    completedCourses={completedCourses}
                    ongoingCourses={ongoingCourses}
                    onClick={() => setSelectedJobId(job.id)}
                  />
                </div>
              ))
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="shrink-0 w-full lg:w-80 ">
            <div className="sticky top-4">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>

      {/* --- POPUP MODAL --- */}
      {selectedJobId && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          
          {/* Dark Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px] transition-opacity"
            onClick={closeJobModal}
          ></div>

          {/* Modal Content Container */}
          <div className="relative w-full max-w-[1200px] h-[90vh] bg-gray-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 ring-1 ring-white/10">
            <JobDetails jobId={selectedJobId} onClose={closeJobModal} />
          </div>
        </div>
      )}
    </div>
  );
}