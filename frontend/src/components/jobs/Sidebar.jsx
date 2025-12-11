import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaUserCircle,
  FaEdit,
} from "react-icons/fa";

const RightSidebar = () => {
  const [userData, setUserData] = useState(null);
  const [education, setEducation] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const base_api = "https://9kz24kbm-7000.inc1.devtunnels.ms/api";

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [userRes, eduRes, picRes] = await Promise.all([
          axios.post(`${base_api}/profile/show`, { token }),
          axios.post(`${base_api}/profile/geteducation`, { token }),
          axios.post(
            `${base_api}/profile/getProfilePic`,
            { token },
            { responseType: "blob" }
          ),
        ]);

        if (userRes.data) setUserData(userRes.data);
        if (eduRes.data?.[0]) setEducation(eduRes.data[0]);
        if (picRes.data.size > 0)
          setProfilePic(URL.createObjectURL(picRes.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const courseCompletion = 50;
  const assessments = 20;
  const score = Math.round((courseCompletion + assessments) / 2);
  const totalScore = 100;
  const percentage = (score / totalScore) * 100;
  const arcLength = 157;
  const strokeDashoffset = arcLength - (arcLength * percentage) / 100;

  // Skeleton
  if (loading) {
    return (
      <div className="flex flex-col gap-2 w-full lg:w-80">
        {/* Skeleton Card 1 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-pulse">
          <div className="flex items-center gap-3 mb-3 border-b border-gray-200 pb-3">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-gray-200" />
                <div className="h-3 w-40 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
          <div className="w-full h-8 bg-gray-200 rounded-lg" />
        </div>

        {/* Skeleton Card 2 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-pulse">
          <div className="h-3 w-24 bg-gray-200 rounded mb-4" />
          <div className="w-32 h-16 mx-auto mb-4">
            <div className="w-full h-full rounded-full bg-gray-100" />
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <div className="h-2 w-16 bg-gray-100 rounded" />
                  <div className="h-2 w-8 bg-gray-100 rounded" />
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
          <div className="w-full h-8 bg-gray-200 rounded-lg mt-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full lg:w-80">
      {/* CARD 1: PROFILE INFO */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-3 mb-2 border-b border-gray-200 pb-2">
          {profilePic ? (
            <img
              src={profilePic}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border border-gray-100 shrink-0"
            />
          ) : (
            <FaUserCircle className="w-12 h-12 text-gray-300 shrink-0" />
          )}
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-gray-900 truncate">
              {userData
                ? `${userData.first_name} ${userData.last_name}`
                : "User"}
            </h2>
            <p className="text-[13px] sm:text-[15px] text-gray-500 truncate">
              {userData?.current_status_name || "Student"}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-[13px] sm:text-[15px] text-gray-600 mb-4">
          <InfoItem
            icon={<FaPhoneAlt />}
            text={userData?.contact_no || "N/A"}
          />
          <InfoItem icon={<FaEnvelope />} text={userData?.email || "N/A"} />
          <InfoItem
            icon={<FaLinkedinIn />}
            text={userData?.linkedin_url || "N/A"}
            // link={userData?.linkedin_url}
          />
          <InfoItem
            icon={<FaMapMarkerAlt />}
            text={userData?.addresses?.[0]?.city || "N/A"}
          />
          <InfoItem
            icon={<FaGraduationCap />}
            text={education?.name || "N/A"}
          />
        </div>

        <button
          onClick={() => navigate("/profile")}
          className="w-full flex items-center justify-center gap-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 py-2 rounded-lg text-xs sm:text-[13px] font-bold transition-colors"
        >
          <FaEdit /> Edit Profile
        </button>
      </div>

      {/* CARD 2: CADD SCORE */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
        <h3 className="text-gray-500 mb-4 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
          Your CADD Score
        </h3>

        <div className="relative w-28 sm:w-32 h-16 mx-auto mb-4">
          <svg className="w-full h-full" viewBox="0 0 120 60">
            <path
              d="M 10,60 A 50,50 0 0,1 110,60"
              stroke="#f3f4f6"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 10,60 A 50,50 0 0,1 110,60"
              stroke="#0ea5e9"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">
              {score}
            </span>
            <span className="text-gray-400 text-[9px] sm:text-[15px] font-medium mt-0.5">
              / {totalScore}
            </span>
          </div>
        </div>

        <div className="space-y-3 text-left">
          <ProgressBar
            label="Course Completion"
            percent={courseCompletion}
            color="bg-orange-500"
          />
          <ProgressBar
            label="Assessments"
            percent={assessments}
            color="bg-orange-500"
          />
        </div>

        <button className="w-full mt-3 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-all shadow-sm text-xs sm:text-[13px] active:scale-95">
          Improve Score
        </button>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, text, link }) => (
  <div
    onClick={() =>
      link &&
      window.open(link.startsWith("http") ? link : `https://${link}`, "_blank")
    }
    className={`flex items-center gap-2.5 p-1.5 rounded hover:bg-gray-50 ${
      link ? "cursor-pointer text-orange-600 hover:underline" : ""
    }`}
  >
    <span className="text-gray-400 text-[14px] w-4 flex justify-center">
      {icon}
    </span>
    <span className="truncate w-full">{text}</span>
  </div>
);

const ProgressBar = ({ label, percent, color }) => (
  <div>
    <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
      <span>{label}</span>
      <span className="text-gray-800">{percent}%</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-all duration-500`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  </div>
);

export default RightSidebar;
